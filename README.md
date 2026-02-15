# Tilahun Profile Portal

Full-stack profile portal with a Python (Django) backend and React frontend.

## Quick Start

### 1) Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:MYSQL_DATABASE="tilahun_portal"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="your_password"
$env:MYSQL_HOST="127.0.0.1"
$env:MYSQL_PORT="3306"
python manage.py makemigrations
python manage.py migrate
python manage.py seed_portal_content --reset
python manage.py runserver 127.0.0.1:8000
```

If MySQL is not ready yet, you can run a temporary local fallback:

```powershell
$env:USE_SQLITE="1"
python manage.py migrate
python manage.py seed_portal_content --reset
python manage.py runserver 127.0.0.1:8000
```

Create an admin user (if needed):

```powershell
python manage.py createsuperuser
```

Default local admin in this environment:

- Username: `admin`
- Password: `admin123`

### 2) Frontend

```powershell
cd ..\frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

For production frontend builds (separate frontend/backend hosting), set:

```powershell
$env:VITE_API_BASE_URL="https://your-backend-domain.com"
npm run build
```

## Update Content

Use Django admin at `http://127.0.0.1:8000/admin/`.

Editable sections:

- `SiteProfile` (hero text, summary, contact data, hero image, CV document)
- `StoryItem`
- `ExperienceItem` + `ExperienceHighlight`
- `EducationItem`
- `ProgramItem`
- `SkillItem` (core, technical, language, interest)
- `PublicationItem` (links + uploaded docs/images)
- `IdeaItem` (links + uploaded docs/images)
- `MediaAsset` (images/documents by section)

All sections support publishing and ordering via `is_published` and `sort_order`.

## Contact Messages

Submitted messages are stored in MySQL via the `portal_contactmessage` table.

## API Endpoints

- `GET /` - backend status root
- `GET /api/health`
- `GET /api/content`
- `GET /api/story`
- `GET /api/publications`
- `GET /api/ideas`
- `GET /api/media`
- `POST /api/contact`

## Publish (Render + Netlify/Vercel)

Backend (Render):

1. Create a new Web Service from your GitHub repo, root `backend`.
2. Build command:
`pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
3. Start command:
`gunicorn config.wsgi:application`
4. Set backend environment variables:
- `DJANGO_DEBUG=0`
- `DJANGO_SECRET_KEY=your-secret`
- `DJANGO_ALLOWED_HOSTS=your-backend-domain.com`
- `DJANGO_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com`
- `DJANGO_CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.com`
- `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, `MYSQL_PORT`

Frontend (Netlify or Vercel):

1. Deploy `frontend` folder.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variable:
- `VITE_API_BASE_URL=https://your-backend-domain.com`

## Design Baseline

The portal visual refresh uses a free template direction inspired by:

- Start Bootstrap Freelancer (MIT): `https://startbootstrap.com/theme/freelancer`

Template alternatives reviewed:

- DevFolio (MIT): `https://github.com/saadpasta/developerFolio`
- React Portfolio Template (MIT): `https://github.com/yujisatojr/react-portfolio-template`
