# Tilahun Profile Portal

Full-stack profile portal with Django backend and React frontend.

## Deployment Mode

- Backend is private and local admin-only.
- Public website is static on Netlify.
- Content updates flow from Django admin to Netlify via snapshot export.

This removes tunnel passwords and avoids exposing backend publicly.

## Quick Start (Local)

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

MySQL mode:

```powershell
$env:MYSQL_DATABASE="tilahun_portal"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="your_password"
$env:MYSQL_HOST="127.0.0.1"
$env:MYSQL_PORT="3306"
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

SQLite fallback:

```powershell
$env:USE_SQLITE="1"
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Admin:

- URL: `http://127.0.0.1:8000/admin/`
- Username: `admin`
- Password: `admin123`

### Frontend (local dynamic mode)

```powershell
cd ..\frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

When running locally, frontend reads from `http://127.0.0.1:8000` automatically.

## Docker / Coolify Production Deployment

Use the Docker Compose deployment for production-ready hosting, including Coolify or other container platforms.

1. Copy `.env.example` to `.env` and update the values for your environment.
2. Ensure `DATABASE_URL` points to the `db` service or your managed Postgres instance.
3. Build and run the stack:

```powershell
docker compose build
docker compose up -d
```

4. Verify service status:

```powershell
docker compose ps
docker compose logs -f backend
```

The frontend container is served on port `3000` and proxies `/api/`, `/media/`, and `/static/` to the backend.

For same-origin deployment, leave `VITE_API_BASE_URL` empty in `.env` so the client requests relative API paths.

## Content Management and Publish

1. Update content in Django admin (`SiteProfile`, education, experience, skills, publications, ideas, media).
2. Export static snapshot and media:

```powershell
cd backend
$env:USE_SQLITE="1"  # or your MySQL env vars
python manage.py export_portal_snapshot
```

This command generates:

- `frontend/public/published-content.json`
- `frontend/public/published-media/*`

3. Deploy frontend to Netlify:

```powershell
cd ..\frontend
npm run build
cd ..
npx netlify-cli deploy --prod --dir frontend/dist
```

Do not set `VITE_API_BASE_URL` in Netlify for private-backend mode.

## Why This Fixes Your Error

- No `loca.lt` tunnel needed.
- No tunnel password prompt.
- Backend stays private (local admin-only).
- Public site remains fast and fully responsive.
