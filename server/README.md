# Nanox Backend API (Screen 1–7 scope)

## Setup
1. Copy `.env.example` to `.env` and set values.
2. Run `npm install`.
3. Run `npm run api`.

## Data Models
- `portfolioImages`
- `categories`
- `services`
- `aboutPageContent`
- `contactSubmissions`

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

Portfolio:
- `POST /api/admin/portfolio`
- `PUT /api/admin/portfolio/:id`
- `DELETE /api/admin/portfolio/:id`

Categories:
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`

About:
- `PUT /api/admin/about`

Services:
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`

Contact submissions:
- `GET /api/admin/contact`
- `PUT /api/admin/contact/:id`
- `DELETE /api/admin/contact/:id`

## Validation + security
- Title max 100 chars
- Description max 500 chars
- Category max 50 chars and must exist
- `imageUrl` must be HTTPS URL
- Rate limit: 10 requests/minute for admin POST/PUT/DELETE (portfolio/categories/services/contact)
- Public contact submit rate limit: 10 requests/minute
- Rate limit: 5 requests/minute for admin about update
- Basic sanitization strips `<` and `>` from text fields

- Contact validation: name max 100, message max 2000, phone max 20, email RFC-style pattern
