import {
  handleAdminApprove,
  handleAdminListPending,
  handleAdminReject,
  handleGetComments,
  handlePostComment,
} from './handlers';
import type { Env } from './utils';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/api/comments') {
      if (request.method === 'GET') return handleGetComments(request, env);
      if (request.method === 'POST') return handlePostComment(request, env);
    }

    if (pathname === '/api/admin/comments' && request.method === 'GET') {
      return handleAdminListPending(request, env);
    }

    const approveMatch = pathname.match(/^\/api\/admin\/comments\/(\d+)\/approve$/);
    if (approveMatch && request.method === 'POST') {
      return handleAdminApprove(request, env, approveMatch[1]);
    }

    const rejectMatch = pathname.match(/^\/api\/admin\/comments\/(\d+)\/reject$/);
    if (rejectMatch && request.method === 'POST') {
      return handleAdminReject(request, env, rejectMatch[1]);
    }

    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
