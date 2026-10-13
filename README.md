# Logout exercise

A small Angular app where users log in and see their orders. Login works. **Logout doesn't.**

## Your task

> Clicking **Log out** doesn't do anything yet. Implement logout so the user is fully logged out.

Start in `src/app/core/auth.service.ts` → `logout()`. You can change any file under `src/`.

Talk through what you're doing as you go. When you think you're done, tell the interviewer how you'd convince yourself it works.

## Running it

- **StackBlitz:** it installs and starts by itself. When the preview appears, **open it in a new tab** (the button in the preview, or the prompt in the app). The login cookie can't be stored inside the editor's preview frame.
- **Locally:** `npm install` then `npm start`, and open http://localhost:4200.

`npm start` runs two things: the Angular app and a small mock API on port 3000. The app calls the API through `/api`.

### Test users

| Username | Password |
|---|---|
| `alice` | `alice123` |
| `bob` | `bob123` |
| `admin` | `admin123` |

## How the app works

- **Login:** `POST /api/auth/login`. The server answers with the user in the body and sets an `access` cookie holding a JWT. The cookie is **HttpOnly**, so JavaScript can't read it; the browser sends it with every `/api` request.
- **Who's logged in:** `GET /api/auth/session` returns the current user, or `401`.
- **Orders:** `GET /api/orders` returns the logged-in user's orders.
- **Logout:** `POST /api/auth/logout` exists on the server and works.

| File | What it does |
|---|---|
| `src/app/core/auth.service.ts` | Auth state (signals), login, session check, **logout** |
| `src/app/core/orders.store.ts` | The current user's orders, kept in memory |
| `src/app/core/auth.guard.ts` | Route guard for the logged-in pages |
| `src/app/core/unauthorized.interceptor.ts` | Sends the user to `/login` when the API answers `401` |
| `src/app/shell/shell.ts` | Header with the **Log out** button |
| `src/app/pages/…` | Login, dashboard and account pages |
| `server/index.mjs` | Mock API. You don't need to change it. |

The **Interviewer tools** box in the corner is for the interviewer. You can ignore it.
