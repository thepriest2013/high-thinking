export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_TOKEN: string;
  TURNSTILE_SECRET_KEY: string;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  if (!token) return false;

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) return false;
  const result = (await res.json()) as { success: boolean };
  return result.success === true;
}

export function isAdmin(request: Request, env: Env): boolean {
  const auth = request.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  return token.length > 0 && token === env.ADMIN_TOKEN;
}
