// Mock API for the logout exercise.
// The API is complete — candidates don't need to change anything in this folder.
//
// Design: JWT access token in an HttpOnly cookie, a server-side session record
// for every login, and a per-request check that the session hasn't been revoked.

import express from 'express';
import crypto from 'node:crypto';

const PORT = 3000;
const ACCESS_TTL_SECONDS = 10 * 60;
const COOKIE_NAME = 'access';
const SECRET = crypto.randomBytes(32); // new secret on every server start

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const USERS = [
  { id: 'u1', username: 'alice', password: 'alice123', name: 'Alice Cohen', role: 'user' },
  { id: 'u2', username: 'bob', password: 'bob123', name: 'Bob Levi', role: 'user' },
  { id: 'u3', username: 'admin', password: 'admin123', name: 'Dana Admin', role: 'admin' },
].map(({ password, ...u }) => ({ ...u, passwordHash: hashPassword(password) }));

const SEED_ORDERS = [
  { id: 41, ownerId: 'u1', item: 'Standing desk', total: 1890, status: 'Shipped' },
  { id: 42, ownerId: 'u1', item: 'Ergonomic chair', total: 1250, status: 'Processing' },
  { id: 43, ownerId: 'u1', item: '4K monitor', total: 1499, status: 'Delivered' },
  { id: 51, ownerId: 'u2', item: 'Mechanical keyboard', total: 520, status: 'Delivered' },
  { id: 52, ownerId: 'u2', item: 'Noise-cancelling headphones', total: 1199, status: 'Shipped' },
  { id: 61, ownerId: 'u3', item: 'Server rack', total: 7400, status: 'Processing' },
];

// ---------------------------------------------------------------------------
// In-memory state
// ---------------------------------------------------------------------------
let sessions = new Map(); // sid -> { sid, userId, createdAt, lastSeenAt, revokedAt }
let dev = freshDevState();

function freshDevState() {
  return {
    failLogout: false, // POST /auth/logout answers 503 and does nothing
    slowApi: false, // GET /orders takes 2 seconds
    lastToken: null, // the most recent access token issued (for "replay old cookie")
    lastSid: null,
  };
}

// ---------------------------------------------------------------------------
// Helpers: passwords, JWT, cookies
// ---------------------------------------------------------------------------
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 32);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

const b64url = (input) => Buffer.from(input).toString('base64url');

function signJwt(payload) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyJwt(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const i = c.indexOf('=');
        return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))];
      }),
  );
}

function isLocalHost(req) {
  const host = (req.headers.host || '').split(':')[0];
  return host === 'localhost' || host === '127.0.0.1';
}

function cookieAttributes(req, maxAge) {
  // Secure everywhere except plain http://localhost during local development.
  const secure = isLocalHost(req) ? '' : '; Secure';
  return `; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

const publicUser = (u) => ({ id: u.id, username: u.username, name: u.name, role: u.role });

// Validates an access token the same way for real requests and for "replay".
function authenticateToken(token) {
  const payload = verifyJwt(token);
  if (!payload) return { ok: false, reason: 'Missing, invalid or expired token' };
  const session = sessions.get(payload.sid);
  if (!session) return { ok: false, reason: 'Unknown session' };
  if (session.revokedAt) return { ok: false, reason: 'Session was revoked (logged out)' };
  const user = USERS.find((u) => u.id === payload.sub);
  if (!user) return { ok: false, reason: 'Unknown user' };
  session.lastSeenAt = Date.now();
  return { ok: true, user, session };
}

function requireAuth(req, res, next) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  const result = authenticateToken(token);
  if (!result.ok) return res.status(401).json({ error: result.reason });
  req.user = result.user;
  req.session = result.session;
  next();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

const api = express.Router();

// --- Auth ------------------------------------------------------------------
api.post('/auth/login', (req, res) => {
  const { username, password } = req.body ?? {};
  const user = USERS.find((u) => u.username === String(username ?? '').toLowerCase().trim());
  if (!user || !verifyPassword(String(password ?? ''), user.passwordHash)) {
    return res.status(401).json({ error: 'Wrong username or password' });
  }

  const sid = crypto.randomUUID();
  const now = Date.now();
  sessions.set(sid, { sid, userId: user.id, createdAt: now, lastSeenAt: now, revokedAt: null });

  const token = signJwt({
    sub: user.id,
    sid,
    role: user.role,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + ACCESS_TTL_SECONDS,
  });
  dev.lastToken = token;
  dev.lastSid = sid;

  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}${cookieAttributes(req, ACCESS_TTL_SECONDS)}`);
  res.json({ user: publicUser(user) });
});

api.get('/auth/session', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

api.post('/auth/logout', (req, res) => {
  if (dev.failLogout) {
    return res.status(503).json({ error: 'Service unavailable (simulated by the dev panel)' });
  }
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  const payload = verifyJwt(token);
  if (payload) {
    const session = sessions.get(payload.sid);
    if (session && !session.revokedAt) session.revokedAt = Date.now();
  }
  // Clear the cookie with the same name and attributes it was set with.
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${cookieAttributes(req, 0)}`);
  res.status(204).end();
});

api.all('/auth/logout', (req, res) => {
  res.setHeader('Allow', 'POST');
  res.status(405).json({ error: 'Method not allowed. Logout only accepts POST.' });
});

// --- Orders ----------------------------------------------------------------
api.get('/orders', requireAuth, async (req, res) => {
  if (dev.slowApi) await sleep(2000);
  res.json({ orders: SEED_ORDERS.filter((o) => o.ownerId === req.user.id).map(({ ownerId, ...o }) => o) });
});

// --- Dev panel (interviewer tools; not part of the real API) ---------------
function devState() {
  const s = dev.lastSid ? sessions.get(dev.lastSid) : null;
  const u = s ? USERS.find((x) => x.id === s.userId) : null;
  return {
    failLogout: dev.failLogout,
    slowApi: dev.slowApi,
    lastSession: s
      ? { user: u.username, status: s.revokedAt ? 'revoked' : 'active', createdAt: s.createdAt }
      : null,
    activeSessions: [...sessions.values()].filter((x) => !x.revokedAt).length,
  };
}

api.get('/dev/state', (req, res) => res.json(devState()));

api.post('/dev/settings', (req, res) => {
  const { failLogout, slowApi } = req.body ?? {};
  if (typeof failLogout === 'boolean') dev.failLogout = failLogout;
  if (typeof slowApi === 'boolean') dev.slowApi = slowApi;
  res.json(devState());
});

// Simulates an attacker who copied the access cookie before logout and calls GET /orders with it.
api.post('/dev/replay', (req, res) => {
  if (!dev.lastToken) return res.json({ status: 'none', message: 'No one has logged in yet.' });
  const result = authenticateToken(dev.lastToken);
  if (!result.ok) return res.json({ status: 401, message: result.reason });
  const count = SEED_ORDERS.filter((o) => o.ownerId === result.user.id).length;
  return res.json({ status: 200, message: `Still works: returned ${count} orders for ${result.user.username}` });
});

api.post('/dev/reset', (req, res) => {
  sessions = new Map();
  dev = freshDevState();
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${cookieAttributes(req, 0)}`);
  res.json(devState());
});

app.use('/api', api);
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}`));
