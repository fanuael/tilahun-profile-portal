# Tilahun Profile Portal - Quick Reference Guide

## 🚀 Start Development (Copy & Paste)

### Terminal 1 - Backend
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
$env:USE_SQLITE="1"
python manage.py runserver 127.0.0.1:8000
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000
- Admin: http://127.0.0.1:8000/admin (admin/admin123)

---

## 📝 Admin & Content Management

| Task | Action |
|------|--------|
| **Edit Profile** | Admin → SiteProfile → Edit |
| **Add Stat** | Admin → HighlightStat → Add |
| **Add Story** | Admin → StoryItem → Add |
| **Add Experience** | Admin → ExperienceItem → Add + ExperienceHighlight |
| **Add Education** | Admin → EducationItem → Add |
| **Add Skill** | Admin → SkillItem → Add (select category) |
| **Add Program** | Admin → ProgramItem → Add |
| **Add Publication** | Admin → PublicationItem → Add |
| **Add Idea** | Admin → IdeaItem → Add |
| **Upload Media** | Admin → MediaAsset → Add |

---

## 🛠️ Backend Commands

```powershell
# Start development server
python manage.py runserver 127.0.0.1:8000

# Create migrations (after model changes)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Run migrations for specific app
python manage.py migrate portal

# Create superuser
python manage.py createsuperuser

# Load fixtures
python manage.py loaddata portal/fixtures/seed_data.json

# Export data snapshot
python manage.py export_portal_snapshot

# Shell (interactive Python environment)
python manage.py shell

# Check for issues
python manage.py check

# Clear cache
python manage.py clear_cache

# Collect static files (production)
python manage.py collectstatic --no-input
```

---

## 📦 Frontend Commands

```powershell
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code (if configured)
npm run lint

# Update packages
npm update

# Clean install (if issues)
rm -r node_modules
npm install
```

---

## 🗄️ Database Commands

### SQLite (Development)
```powershell
# Migrate
python manage.py migrate

# View database
# (locate db.sqlite3 in folder)
```

### MySQL (Production)

```powershell
# Set environment variables
$env:MYSQL_DATABASE="tilahun_portal"
$env:MYSQL_USER="tilahun"
$env:MYSQL_PASSWORD="your_password"
$env:MYSQL_HOST="127.0.0.1"
$env:MYSQL_PORT="3306"

# Migrate
python manage.py migrate

# Backup
python manage.py dumpdata > backup.json

# Restore
python manage.py loaddata backup.json

# MySQL command line
mysql -u tilahun -p tilahun_portal
```

---

## 🚀 Deployment Commands

### Export Static Content
```powershell
cd backend
python manage.py export_portal_snapshot
```

### Build Frontend
```powershell
cd ../frontend
npm run build
```

### Deploy to Netlify
```powershell
npm install -g netlify-cli
netlify deploy --prod --dir frontend/dist
```

---

## 🔧 Configuration

### Environment Variables (Backend)

```powershell
# Development
$env:USE_SQLITE="1"
$env:DJANGO_DEBUG="1"
$env:DJANGO_ALLOWED_HOSTS="127.0.0.1,localhost"

# Production
$env:DJANGO_DEBUG="0"
$env:DJANGO_SECRET_KEY="your-secret-key"
$env:DJANGO_ALLOWED_HOSTS="yourdomain.com"
$env:MYSQL_DATABASE="tilahun_prod"
$env:MYSQL_USER="prod_user"
$env:MYSQL_PASSWORD="secure_password"
$env:DJANGO_CORS_ALLOWED_ORIGINS="https://yourdomain.netlify.app"
```

### Frontend (Environment Variables)
```
VITE_API_BASE_URL=http://127.0.0.1:8000  (for production override)
```

---

## 🔗 API Endpoints

| Endpoint | Method | Response |
|----------|--------|----------|
| `/` | GET | Service status |
| `/api/health` | GET | Health check |
| `/api/content` | GET | Complete profile |
| `/api/story` | GET | Career timeline |
| `/api/publications` | GET | Publications |
| `/api/ideas` | GET | Ideas |
| `/api/media` | GET | Media assets |
| `/api/contact` | POST | Submit contact form |

**Usage Example:**
```javascript
const response = await fetch('http://127.0.0.1:8000/api/content')
const data = await response.json()
console.log(data.profile)
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Module not found** | `pip install -r requirements.txt` |
| **Port 8000 in use** | `python manage.py runserver 127.0.0.1:8001` |
| **CORS error** | Check `DJANGO_CORS_ALLOWED_ORIGINS` in settings |
| **Database locked** | SQLite can't handle concurrent access, use MySQL |
| **Static files missing** | `python manage.py collectstatic --no-input` |
| **npm dependencies error** | `rm -r node_modules && npm install` |
| **API returns empty** | Check backend is running on http://127.0.0.1:8000 |
| **Admin won't load** | `python manage.py createsuperuser` |

---

## 📱 Responsive Breakpoints (Tailwind)

```css
sm: 640px   /* Mobile large */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

Example usage:
```jsx
<div className="md:grid-cols-2 lg:grid-cols-3">
  {/* Single column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## 🎨 Tailwind Color System

```javascript
// Primary colors (from tailwind.config.js)
primary: '#b7864b'  // Gold
ink: '#1d232b'      // Dark ink
teal: '#2f6569'     // Teal

// Usage
className="bg-yellow-100"  // Gold background
className="text-slate-900" // Ink text
className="border-teal-600" // Teal border
```

---

## 📁 File Locations

| Type | Location |
|------|----------|
| **Admin Interface** | `http://127.0.0.1:8000/admin/` |
| **Media Uploads** | `backend/media/` |
| **Static Files** | `backend/staticfiles/` |
| **React Pages** | `frontend/src/pages/` |
| **React Components** | `frontend/src/components/` |
| **Tailwind Config** | `frontend/tailwind.config.js` |
| **Vite Config** | `frontend/vite.config.js` |
| **Django Settings** | `backend/config/settings.py` |
| **Database (SQLite)** | `backend/db.sqlite3` |
| **Fixtures/Seeds** | `backend/portal/fixtures/` |

---

## 💾 Backup & Recovery

### Backup
```powershell
# Backend database
python manage.py dumpdata > backup_$(Get-Date -Format 'yyyyMMdd').json

# Frontend build
Copy-Item -Recurse frontend/dist dist_backup_$(Get-Date -Format 'yyyyMMdd')
```

### Restore
```powershell
# Restore database
python manage.py loaddata backup_20250216.json

# Restore from backup
Copy-Item -Recurse dist_backup_20250216/* frontend/dist
```

---

## ✅ Pre-Deployment Checklist

```powershell
# Backend
python manage.py check
python manage.py migrate
python manage.py createsuperuser
python manage.py export_portal_snapshot

# Frontend
npm run build
npm run preview  # Test build locally

# Security
# Set DJANGO_DEBUG=0
# Set DJANGO_SECRET_KEY
# Set ALLOWED_HOSTS
# Set MYSQL_PASSWORD securely
```

---

## 🎯 Development Workflow

### Daily Development
```powershell
# Terminal 1
cd backend && .\.venv\Scripts\Activate.ps1
$env:USE_SQLITE="1"
python manage.py runserver 127.0.0.1:8000

# Terminal 2
cd frontend && npm run dev

# Browser
http://localhost:5173
```

### After Model Changes
```powershell
# Backend Terminal
python manage.py makemigrations
python manage.py migrate
```

### Before Deployment
```powershell
# Backend
python manage.py check
python manage.py export_portal_snapshot

# Frontend
npm run build
npm run preview

# Netlify
netlify deploy --prod --dir frontend/dist
```

---

## 📊 Useful Git Commands

```powershell
# Status
git status

# Add files
git add .

# Commit
git commit -m "Update portfolio content"

# Push
git push origin main

# Pull
git pull origin main

# Check log
git log --oneline -10
```

---

## 🔗 Integration Testing

```powershell
# Check backend is responding
curl http://127.0.0.1:8000/

# Check API
curl http://127.0.0.1:8000/api/health

# Check CORS
curl -H "Origin: http://localhost:5173" http://127.0.0.1:8000/api/content
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SETUP_GUIDE.md` | Complete setup instructions |
| `DEPLOYMENT_CHECKLIST.md` | Production deployment |
| `DESIGN_DOCUMENTATION.md` | Design system & components |
| `REBUILD_SUMMARY.md` | What was rebuilt |
| `README.md` / `README_NEW.md` | Project overview |
| `QUICKSTART.md` | This file - Quick reference |

---

## 💡 Quick Tips

- **Never commit credentials** to git
- **Use environment variables** for sensitive data
- **Test locally first** before production
- **Keep backups** before major updates
- **Monitor error logs** regularly
- **Update dependencies** carefully
- **Document your changes** for future reference

---

**Last Updated**: February 2025  
**For**: Tilahun Alene Terfie  
**Stack**: Django + React + MySQL + Netlify
