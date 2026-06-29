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

function appendEvent(event: any) {
  const data = readData();
  // Keep last 5000 events max
  if (data.events.length > 5000) data.events = data.events.slice(-4000);
  data.events.push(event);
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

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
