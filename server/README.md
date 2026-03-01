# Nanox Backend API (SQLite)

## Setup
1. Copy `.env.example` to `.env` and set values.
2. Run `npm install`.
3. Run `npm run api`.

## Database
- Uses SQLite file database (`SQLITE_PATH` in `.env`).
- Tables are auto-created on server startup.

## Public endpoints
- `GET /api/portfolio?category=Portrait`
- `GET /api/portfolio/:id`
- `GET /api/about`
- `GET /api/services`
- `POST /api/contact`
- `GET /api/privacy-policy`
- `GET /api/terms-of-service`

## Admin endpoints (password/JWT protected)
Send either:
- `x-admin-password: <ADMIN_PASSWORD>`
- or `Authorization: Bearer <jwt>` if `JWT_SECRET` is configured.

- `POST /api/admin/portfolio`
- `PUT /api/admin/portfolio/:id`
- `DELETE /api/admin/portfolio/:id`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`
- `PUT /api/admin/about`
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`
- `GET /api/admin/contact`
- `PUT /api/admin/contact/:id`
- `DELETE /api/admin/contact/:id`

## Validation + security
- Input sanitization strips `<` and `>` from text fields.
- Portfolio image URL requires HTTPS.
- Contact email validated by RFC-style regex.
- Rate limit: 10 req/min for admin mutations and contact submit.
- Rate limit: 5 req/min for `PUT /api/admin/about`.
