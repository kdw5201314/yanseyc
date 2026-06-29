import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

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

  try {
    if (!fs.existsSync(ANALYTICS_FILE)) {
      return new Response(JSON.stringify({ events: [], feedbacks: [] }), { status: 200 });
    }
    const data = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
    return new Response(JSON.stringify(data), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ events: [], feedbacks: [] }), { status: 200 });
  }
};
