import { type Env, hashIp, isAdmin, json, verifyTurnstile } from './utils';

const MAX_NAME_LENGTH = 80;
const MAX_BODY_LENGTH = 3000;

interface CommentRow {
  id: number;
  post_slug: string;
  author_name: string;
  body: string;
  created_at: string;
  approved: number;
}

export async function handleGetComments(request: Request, env: Env): Promise<Response> {
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return json({ error: 'Missing slug' }, 400);

  const { results } = await env.DB.prepare(
    'SELECT author_name, body, created_at FROM comments WHERE post_slug = ? AND approved = 1 ORDER BY created_at ASC'
  )
    .bind(slug)
    .all<Pick<CommentRow, 'author_name' | 'body' | 'created_at'>>();

  return json(
    results.map((r) => ({ name: r.author_name, text: r.body, created_at: r.created_at }))
  );
}

export async function handlePostComment(request: Request, env: Env): Promise<Response> {
  let payload: { slug?: string; name?: string; text?: string; turnstileToken?: string; hp?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { slug, name, text, turnstileToken, hp } = payload;

  // Honeypot: bots fill hidden fields. Pretend success, drop silently.
  if (hp) {
    return json({ ok: true, message: 'Thanks — your comment is awaiting approval.' }, 201);
  }

  if (!slug || !name?.trim() || !text?.trim()) {
    return json({ error: 'Missing required fields' }, 400);
  }
  if (name.length > MAX_NAME_LENGTH || text.length > MAX_BODY_LENGTH) {
    return json({ error: 'Name or comment is too long' }, 400);
  }

  const ip = request.headers.get('cf-connecting-ip') ?? '0.0.0.0';

  const turnstileOk = await verifyTurnstile(turnstileToken ?? '', env.TURNSTILE_SECRET_KEY, ip);
  if (!turnstileOk) {
    return json({ error: 'Verification failed — please try again' }, 400);
  }

  const ipHash = await hashIp(ip);

  const recent = await env.DB.prepare(
    "SELECT COUNT(*) as n FROM comments WHERE ip_hash = ? AND created_at > datetime('now', '-30 seconds')"
  )
    .bind(ipHash)
    .first<{ n: number }>();
  if (recent && recent.n > 0) {
    return json({ error: 'Please wait a bit before posting again' }, 429);
  }

  const daily = await env.DB.prepare(
    "SELECT COUNT(*) as n FROM comments WHERE ip_hash = ? AND created_at > datetime('now', '-1 day')"
  )
    .bind(ipHash)
    .first<{ n: number }>();
  if (daily && daily.n >= 20) {
    return json({ error: 'Daily comment limit reached' }, 429);
  }

  await env.DB.prepare(
    'INSERT INTO comments (post_slug, author_name, body, approved, ip_hash) VALUES (?, ?, ?, 0, ?)'
  )
    .bind(slug, name.trim(), text.trim(), ipHash)
    .run();

  return json({ ok: true, message: 'Thanks — your comment is awaiting approval.' }, 201);
}

export async function handleAdminListPending(request: Request, env: Env): Promise<Response> {
  if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);

  const { results } = await env.DB.prepare(
    'SELECT id, post_slug, author_name, body, created_at FROM comments WHERE approved = 0 ORDER BY created_at ASC'
  ).all<Omit<CommentRow, 'approved'>>();

  return json(results);
}

export async function handleAdminApprove(request: Request, env: Env, id: string): Promise<Response> {
  if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);

  await env.DB.prepare('UPDATE comments SET approved = 1 WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

export async function handleAdminReject(request: Request, env: Env, id: string): Promise<Response> {
  if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);

  await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
  return json({ ok: true });
}
