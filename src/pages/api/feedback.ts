import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ events: [], feedbacks: [] }, null, 2));
  }
}

function readData() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
  } catch {
    return { events: [], feedbacks: [] };
  }
}

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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = readData();
    data.feedbacks.push({
      ...body,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'local',
    });
    if (data.feedbacks.length > 500) data.feedbacks = data.feedbacks.slice(-400);
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: '提交失败' }), { status: 400 });
  }
};

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!verifyToken(auth || null)) {
    return new Response(JSON.stringify({ error: '未登录' }), { status: 401 });
  }
  try {
    const data = readData();
    return new Response(JSON.stringify(data.feedbacks || []), { status: 200 });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
};
