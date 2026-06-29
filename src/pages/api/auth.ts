import type { APIRoute } from 'astro';

const VALID_USER = 'kongdewen';
const VALID_PASS = 'kongdewen521';
const SECRET_KEY = 'yansheyuncheng_admin_2026';

function createToken(username: string) {
  const payload = JSON.stringify({ username, exp: Date.now() + 24 * 3600 * 1000 });
  const b64 = Buffer.from(payload).toString('base64');
  const sig = Buffer.from(b64 + SECRET_KEY).toString('base64').slice(0, 16);
  return `${b64}.${sig}`;
}

function verifyToken(token: string): boolean {
  try {
    const [b64, sig] = token.split('.');
    const expectedSig = Buffer.from(b64 + SECRET_KEY).toString('base64').slice(0, 16);
    if (sig !== expectedSig) return false;
    const payload = JSON.parse(Buffer.from(b64, 'base64').toString());
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export { verifyToken };

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();
    if (username === VALID_USER && password === VALID_PASS) {
      const token = createToken(username);
      return new Response(JSON.stringify({ ok: true, token, username }), { status: 200 });
    }
    return new Response(JSON.stringify({ ok: false, error: '账户或密码错误' }), { status: 401 });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: '请求格式错误' }), { status: 400 });
  }
};
