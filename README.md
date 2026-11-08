# Authenticated Blog API

Blog API upgraded with user registration, bcrypt password hashing, JWT authentication, and article ownership checks.

## Setup
1. Install Node.js (LTS).
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in your MongoDB connection string and a long random JWT secret.
4. Run `npm run dev` for development or `npm start` for production.

## Environment variables
- `PORT`: optional; Render supplies this automatically.
- `MONGO_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: long, private random string. Never commit `.env`.
- `JWT_EXPIRES_IN`: optional token lifetime, defaults to `1d`.

## Authentication endpoints
### POST `/auth/signup`
JSON body: `{ "name": "Your Name", "email": "you@example.com", "password": "at-least-8-characters" }`

### POST `/auth/login`
JSON body: `{ "email": "you@example.com", "password": "your-password" }`

Both return a JWT token. Copy it and send it with protected requests using:
`Authorization: Bearer YOUR_TOKEN`

## Article endpoints (all require a token)
- GET `/api/articles` — list articles
- GET `/api/articles/search?q=keyword` — search
- GET `/api/articles/:id` — get one article
- POST `/api/articles` — create an article
- PUT `/api/articles/:id` — update your own article
- DELETE `/api/articles/:id` — delete your own article

Article creation body: `{ "title": "...", "content": "At least ten characters...", "category": "...", "tags": ["one", "two"] }`.
The API assigns the authenticated user's name and ID. A user cannot edit or delete another user's article.

## Important migration note
The old seeded articles do not have a `userId`. They remain readable after login, but they cannot be edited or deleted through the ownership-protected routes. Create new articles after signing up, or separately migrate old records by assigning them to a real user.

## Assign your old seeded articles to your account
If your database already contains articles from the earlier version, sign up first, then run `npm run migrate:articles -- your-registered-email@example.com`. This assigns only legacy articles without a `userId` to that account.

## Render deployment
- Build command: `npm install`
- Start command: `npm start`
- Add `MONGO_URI`, `JWT_SECRET`, and optionally `JWT_EXPIRES_IN` in Render Environment settings. Do not upload `.env` to GitHub.
