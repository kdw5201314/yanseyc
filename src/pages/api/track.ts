import type { APIRoute } from 'astro';
import { appendEvent } from '../../lib/store';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const event = {
      ...body,
      ip: request.headers.get('x-forwarded-for') || 'local',
      receivedAt: Date.now(),
    };
    appendEvent(event);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }
};
