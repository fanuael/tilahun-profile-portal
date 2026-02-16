# Tilahun Profile Portal

A modern, full-stack professional portfolio website with Django backend, React frontend, and MySQL database.

## 🎯 Features

✨ **Modern Design**
- Responsive, mobile-first interface
- Smooth animations and transitions
- Professional color scheme (Gold, Ink, Teal)
- Built with Tailwind CSS

📱 **Full-Featured Portfolio**
- Professional profile with hero image and CV
- Career timeline and story sections
- Experience showcase with highlights
- Education and certifications
- Skills organized by category
- Publications and research materials
- Ideas and projects
- Media gallery
- Contact form

🔧 **Admin Dashboard**
- Easy content management via Django admin
- Organize skills by category (Core, Technical, Languages, Interests)
- Timeline-based story items
- Experience with achievement highlights
- Drag-and-drop ordering

🌐 **Smart Deployment**
- Backend: Private admin-only (local or private server)
- Frontend: Static site on Netlify (fast, scalable)
- Content snapshot export for offline updates
- API-driven architecture

---

## ⚡ Quick Start (3 minutes)

### Automated Setup (Windows)

```powershell
# Option 1: PowerShell (Recommended)
powershell -ExecutionPolicy Bypass -File setup.ps1

# Option 2: Batch File
setup.bat
```

### Manual Setup

**Backend:**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:USE_SQLITE="1"
python manage.py migrate
python manage.py loaddata portal/fixtures/seed_data.json
python manage.py runserver 127.0.0.1:8000
```

**Frontend (new terminal):**
```powershell
cd frontend
npm install
npm run dev
```

**Open in browser:**
- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000`
- Admin: `http://127.0.0.1:8000/admin` (username: admin, password: admin123)

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup & deployment instructions
- **[DESIGN_DOCUMENTATION.md](./DESIGN_DOCUMENTATION.md)** - Design system and components

---

## 📋 Project Structure

```
├── backend/                    # Django application
│   ├── config/                # Django settings
│   ├── portal/                # Main app with models & API
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                   # React/Vite application
│   ├── src/                   # React components & pages
│   ├── public/                # Static assets & published content
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── SETUP_GUIDE.md            # Complete setup documentation
├── DESIGN_DOCUMENTATION.md   # Design system details
├── setup.ps1 & setup.bat     # Quick setup scripts
└── README.md                 # This file
```

---

## 🗄️ Database

### SQLite (Development)
- Included by default
- No installation needed
- Perfect for testing

### MySQL (Recommended)

**Environment Variables:**
```powershell
$env:MYSQL_DATABASE="tilahun_portal"
$env:MYSQL_USER="tilahun"
$env:MYSQL_PASSWORD="secure_password"
$env:MYSQL_HOST="127.0.0.1"
$env:MYSQL_PORT="3306"
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for MySQL installation on Windows.

---

## 🎨 Content Management

### Edit Profile
1. Go to `http://127.0.0.1:8000/admin/`
2. Update **SiteProfile** section (name, title, contact info, bio)
3. Add/edit content items:
   - **HighlightStat** - Key statistics
   - **StoryItem** - Career timeline
   - **ExperienceItem** - Work history
   - **EducationItem** - Degrees
   - **SkillItem** - Competencies
   - **PublicationItem** - Research & articles
   - **IdeaItem** - Projects & concepts
   - **MediaAsset** - Images & documents

### Publish to Web

```powershell
cd backend
python manage.py export_portal_snapshot
cd ../frontend
npm run build
npx netlify-cli deploy --prod --dir dist
```

The export command creates a static JSON snapshot for offline access.

---

## 🚀 Deployment

### Backend (Django)
- Local development server
- Deploy to: AWS EC2, DigitalOcean, Azure, Heroku, etc.
- Requires Python 3.10+ and MySQL

### Frontend (React)
- Build: `npm run build`
- Deploy static files to: Netlify, Vercel, GitHub Pages, AWS S3, etc.
- No build tools needed on host

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

---

## 🔧 Development Commands

**Backend:**
```powershell
python manage.py runserver              # Start server
python manage.py migrate                # Apply migrations
python manage.py createsuperuser        # Create admin
python manage.py loaddata <fixture>     # Load data
python manage.py export_portal_snapshot # Export static content
```

**Frontend:**
```powershell
npm run dev      # Development server with hot reload
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 🐛 Troubleshooting

**Backend not connecting?**
```
✓ Ensure backend is running: http://127.0.0.1:8000
✓ Check frontend console for errors
✓ Verify CORS settings in Django
```

**Database errors?**
```
✓ SQLite: Just run migrations
✓ MySQL: Check connection string and MySQL is running
✓ See SETUP_GUIDE.md for detailed MySQL setup
```

**Frontend build fails?**
```
npm install  # Reinstall dependencies
npm run dev  # Test in development
npm run build  # Try building again
```

---

## 📞 Stack

- **Backend**: Django 5.1, Python 3.10+
- **Frontend**: React 18, Vite, Tailwind CSS
- **Database**: MySQL 8.0+ or SQLite
- **Deployment**: Netlify (frontend), Your server (backend)

---

## 📄 License

Personal portfolio project for Tilahun Alene Terfie.

---

## 📞 Contact

- **Email**: tilahunalenee@gmail.com
- **Phone**: +251 941 883 746
- **Location**: Addis Ababa, Ethiopia

---

**Last Updated**: February 2025
