import type { APIRoute } from 'astro';
import { readData } from '../../lib/store';

function verifyToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const [b64, sig] = token.split('.');
    const SECRET_KEY = 'yansheyuncheng_admin_2026';
    const expectedSig = Buffer.from(b64 + SECRET_KEY).toString('base64').slice(0, 16);
    if (sig !== expectedSig) return false;
    const payload = JSON.parse(Buffer.from(b64, 'base64').toString());
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyToken(auth || null)) {
    return new Response(JSON.stringify({ error: '未登录' }), { status: 401 });
  }

  const data = readData();
  return new Response(JSON.stringify(data), { status: 200 });
};
