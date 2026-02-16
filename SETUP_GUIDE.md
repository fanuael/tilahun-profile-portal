# Tilahun Profile Portal - Rebuild & Setup Guide

## Overview

Your portfolio website is a full-stack application with:
- **Backend**: Django 5.1 + Python (MySQL + SQLite support)
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: MySQL 8.0+ (production) / SQLite (development)
- **Deployment**: Netlify (frontend) + Your server (backend)

---

## 🚀 Quick Start - Local Development

### 1. Backend Setup (Django + MySQL/SQLite)

#### Prerequisites
- Python 3.10+
- MySQL 8.0+ (optional, SQLite available for dev)
- Virtual environment

#### Installation

```powershell
cd backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create migrations (if needed)
python manage.py makemigrations
```

#### Database Configuration - SQLite (Development)

```powershell
# Use SQLite for quick local testing
$env:USE_SQLITE="1"
python manage.py migrate
python manage.py loaddata portal/fixtures/seed_data.json  # Load sample data
python manage.py createsuperuser  # Create admin account
python manage.py runserver 127.0.0.1:8000
```

**Admin Access:**
- URL: `http://127.0.0.1:8000/admin/`
- Default: username=`admin`, password=`admin123` (after loading fixture)

#### Database Configuration - MySQL (Recommended)

##### Windows Setup

**Step 1: Install MySQL**
```powershell
# Using Chocolatey (if installed)
choco install mysql

# Or download from https://dev.mysql.com/downloads/mysql/
```

**Step 2: Start MySQL Service**
```powershell
# Start MySQL (if not auto-running)
net start MySQL80

# Or in PowerShell (as Administrator):
# Get-Service MySQL80 | Start-Service
```

**Step 3: Create Database & User**
```powershell
# Open MySQL Command Line Client or use PowerShell
mysql -u root -p

# Then execute:
CREATE DATABASE tilahun_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tilahun'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON tilahun_portal.* TO 'tilahun'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Step 4: Configure Django for MySQL**
```powershell
cd backend

# Set environment variables
$env:USE_SQLITE="0"
$env:MYSQL_DATABASE="tilahun_portal"
$env:MYSQL_USER="tilahun"
$env:MYSQL_PASSWORD="your_secure_password"
$env:MYSQL_HOST="127.0.0.1"
$env:MYSQL_PORT="3306"

# Run migrations
python manage.py migrate

# Load initial data
python manage.py loaddata portal/fixtures/seed_data.json

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver 127.0.0.1:8000
```

**Save Configuration (Optional - Create `.env` file in backend/):**
```
USE_SQLITE=0
MYSQL_DATABASE=tilahun_portal
MYSQL_USER=tilahun
MYSQL_PASSWORD=your_secure_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
DJANGO_CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

---

### 2. Frontend Setup (React + Vite)

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Development URL:** `http://localhost:5173`

The frontend automatically connects to `http://127.0.0.1:8000` locally.

---

## 🔧 Content Management

### Adding/Editing Content

1. **Access Django Admin**
   - URL: `http://127.0.0.1:8000/admin/`
   - Login with your superuser account

2. **Edit Profile Information**
   - **SiteProfile**: Main profile data (name, title, bio, contact)
   - **HighlightStats**: Key statistics displayed on home
   - **StoryItems**: Timeline of career milestones
   - **ExperienceItems**: Work history with highlights
   - **EducationItems**: Degrees and education
   - **ProgramItems**: Certifications and training
   - **SkillItems**: Competencies (Core, Technical, Languages, Interests)
   - **PublicationItems**: Research papers, articles
   - **IdeaItems**: Innovative projects
   - **MediaAssets**: Images and documents

### Publishing Content

When you update content in Django admin, it's automatically available via the API at:
- `http://127.0.0.1:8000/api/content` (Complete content)
- `http://127.0.0.1:8000/api/story` (Career timeline)
- `http://127.0.0.1:8000/api/publications` (Publications)
- `http://127.0.0.1:8000/api/ideas` (Ideas)
- `http://127.0.0.1:8000/api/media` (Media assets)

---

## 📦 Create Static Build for Netlify

### Step 1: Export Content Snapshot

```powershell
cd backend

# Ensure MySQL variables are set
$env:MYSQL_DATABASE="tilahun_portal"
$env:MYSQL_USER="tilahun"
$env:MYSQL_PASSWORD="your_password"
$env:MYSQL_HOST="127.0.0.1"

# Export content as static JSON
python manage.py export_portal_snapshot
```

This creates:
- `frontend/public/published-content.json`
- Copies media to `frontend/public/published-media/`

### Step 2: Build Frontend

```powershell
cd ..\frontend

# Build for production
npm run build

# Output: frontend/dist/
```

### Step 3: Deploy to Netlify

```powershell
# Install Netlify CLI if needed
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir frontend/dist
```

**Or use Netlify UI:**
1. Go to https://netlify.com
2. Connect your GitHub repository
3. Set Build Command: `cd frontend && npm run build`
4. Set Publish Directory: `frontend/dist`
5. Deploy!

---

## 🔐 Production Security

### Environment Variables for Production

```powershell
# Django Settings
$env:DJANGO_DEBUG="0"
$env:DJANGO_SECRET_KEY="your-long-random-secret-key"
$env:DJANGO_ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"

# MySQL Settings
$env:MYSQL_DATABASE="tilahun_prod"
$env:MYSQL_USER="prod_user"
$env:MYSQL_PASSWORD="strong-production-password"
$env:MYSQL_HOST="your-mysql-server.com"
$env:MYSQL_PORT="3306"

# CORS (for Netlify frontend)
$env:DJANGO_CORS_ALLOWED_ORIGINS="https://yourdomain.netlify.app,https://yourdomain.com"
```

### Security Checklist

- [ ] Generate strong `DJANGO_SECRET_KEY`
- [ ] Set `DJANGO_DEBUG=0` in production
- [ ] Configure `ALLOWED_HOSTS` for your domain
- [ ] Set up HTTPS/SSL certificate
- [ ] Use strong MySQL password
- [ ] Restrict database access to app server only
- [ ] Enable CORS only for your frontend domain
- [ ] Backup MySQL database regularly

---

## 📁 Project Structure

```
Tilahun. A/
├── backend/
│   ├── config/           # Django settings, WSGI, ASGI
│   ├── portal/
│   │   ├── models.py     # Database models (Profile, Experience, etc.)
│   │   ├── views.py      # API endpoints
│   │   ├── admin.py      # Django admin configuration
│   │   ├── urls.py       # URL routing
│   │   ├── fixtures/
│   │   │   └── seed_data.json  # Initial data
│   │   └── management/commands/  # Custom commands
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3        # SQLite (development only)
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # Route components
│   │   ├── components/   # Reusable components
│   │   ├── App.jsx       # Main app
│   │   └── content.js    # Data loading
│   ├── public/
│   │   └── published-content.json  # Static snapshot
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── README.md
└── DESIGN_DOCUMENTATION.md
```

---

## 🛠 Common Commands

### Backend

```powershell
# Django management
python manage.py runserver              # Start dev server
python manage.py makemigrations         # Create migrations
python manage.py migrate                # Apply migrations
python manage.py createsuperuser        # Create admin user
python manage.py loaddata <fixture>     # Load data
python manage.py shell                  # Interactive shell
python manage.py export_portal_snapshot # Export static content
```

### Frontend

```powershell
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check (if configured)
```

---

## 🐛 Troubleshooting

### Backend Issues

**"Database unavailable" Error**
- Ensure MySQL is running: `net start MySQL80`
- Verify credentials in environment variables
- Check MySQL has the database: `mysql -u root -p -e "SHOW DATABASES;"`

**"No such table" Error**
- Run migrations: `python manage.py migrate`

**CORS Errors**
- Add frontend URL to `DJANGO_CORS_ALLOWED_ORIGINS`
- Ensure backend is public (don't block port 8000)

### Frontend Issues

**API Returns Empty Data**
- Ensure backend is running on `http://127.0.0.1:8000`
- Check developer console for network errors
- Verify `apiUrl()` in `src/api.js`

**Build Fails**
- Clear node_modules: `rm -r node_modules` then `npm install`
- Update packages: `npm update`

---

## 📝 API Documentation

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API status |
| `/api/health` | GET | Health check |
| `/api/content` | GET | Complete profile data |
| `/api/story` | GET | Career timeline |
| `/api/publications` | GET | Publications/research |
| `/api/ideas` | GET | Ideas/projects |
| `/api/media` | GET | Media assets |
| `/api/contact` | POST | Submit contact form |

### Response Format

```json
{
  "profile": {
    "name": "Tilahun Alene Terfie",
    "title": "Innovation & Sustainable Business Professional",
    "email": "tilahunalenee@gmail.com",
    "hero_image_url": "",
    "cv_url": ""
  },
  "summary": "Professional summary...",
  "experience": [...],
  "education": [...],
  "skills": {...},
  "media": {...}
}
```

---

## 🎨 Customization

### Modify Frontend Styling
- Edit `frontend/tailwind.config.js` for colors and theme
- Modify `frontend/src/index.css` for global styles
- Component styles are in individual JSX files

### Add New Pages
- Create new component in `frontend/src/pages/`
- Add route in `frontend/src/App.jsx`
- Add navigation link in `frontend/src/components/Layout.jsx`

### Update Profile Data
- Edit via Django Admin at `/admin/`
- Or directly edit database fields
- Changes appear in API immediately

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Netlify Deploy Guide](https://docs.netlify.com/)

---

## 📞 Support

For issues:
1. Check this guide's troubleshooting section
2. Review Django/React error messages in console
3. Check network tab in browser DevTools
4. Verify all environment variables are set

---

**Last Updated**: February 2025  
**Created for**: Tilahun Alene Terfie  
**Stack**: Django 5.1 + React 18 + MySQL 8.0 + Tailwind CSS
