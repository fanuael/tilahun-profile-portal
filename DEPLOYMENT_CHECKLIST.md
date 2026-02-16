# Tilahun Profile Portal - Deployment Checklist

## ✅ Pre-Deployment Verification

### Backend - Django

- [ ] Python 3.10+ installed
- [ ] Virtual environment created and activated
- [ ] All dependencies installed: `pip install -r requirements.txt`
- [ ] Database migrations applied: `python manage.py migrate`
- [ ] Admin user created: `python manage.py createsuperuser`
- [ ] Test data loaded: `python manage.py loaddata portal/fixtures/seed_data.json`
- [ ] Development server runs: `python manage.py runserver`
- [ ] Admin panel accessible at `http://127.0.0.1:8000/admin/`
- [ ] All content API endpoints respond:
  - ✓ `http://127.0.0.1:8000/api/content`
  - ✓ `http://127.0.0.1:8000/api/health`
  - ✓ `http://127.0.0.1:8000/api/story`
  - ✓ `http://127.0.0.1:8000/api/publications`

### Frontend - React

- [ ] Node.js 16+ installed
- [ ] npm dependencies installed: `npm install`
- [ ] Development server runs: `npm run dev`
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] No console errors in browser DevTools
- [ ] All pages load correctly:
  - ✓ Home page
  - ✓ Story page
  - ✓ Experience page
  - ✓ Education page
  - ✓ Skills page
  - ✓ Publications page
  - ✓ Contact page

### Integration Testing

- [ ] Frontend successfully connects to backend on `http://127.0.0.1:8000`
- [ ] Profile data loads correctly
- [ ] All content displays properly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Forms work (contact form)
- [ ] No CORS errors

---

## 🚀 Deployment Steps

### Step 1: Prepare Backend for Production

**Environment Variables:**
```powershell
# Set these securely on your production server
$env:DJANGO_DEBUG="0"
$env:DJANGO_SECRET_KEY="your-long-random-secret-key-here"
$env:DJANGO_ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"
$env:MYSQL_DATABASE="tilahun_prod"
$env:MYSQL_USER="prod_user"
$env:MYSQL_PASSWORD="strong-random-password"
$env:MYSQL_HOST="your-mysql-server.com"
$env:MYSQL_PORT="3306"
$env:DJANGO_CORS_ALLOWED_ORIGINS="https://yourdomain.netlify.app,https://yourdomain.com"
```

**Generate Django Secret Key:**
```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Collect Static Files:**
```powershell
python manage.py collectstatic --no-input
```

**Run Migrations on Production:**
```powershell
python manage.py migrate
```

### Step 2: Export Static Content for Netlify

```powershell
cd backend
python manage.py export_portal_snapshot
```

This creates:
- `frontend/public/published-content.json` - Static snapshot of all content
- `frontend/public/published-media/*` - Media files copy

### Step 3: Build Frontend

```powershell
cd ../frontend
npm run build
```

Output goes to `frontend/dist/` directory.

### Step 4: Deploy Frontend to Netlify

**Option A: Using Netlify CLI**
```powershell
npm install -g netlify-cli
netlify deploy --prod --dir frontend/dist
```

**Option B: Using Netlify Web UI**
1. Go to https://app.netlify.com
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
4. Deploy!

### Step 5: Deploy Backend

Choose your hosting platform:

**AWS EC2:**
```powershell
# Install Python, MySQL client, etc.
# Copy project files
# Set environment variables
# Create systemd service
# Run with Gunicorn: gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

**DigitalOcean App Platform:**
1. Connect GitHub repository
2. Set environment variables
3. Configure run command: `gunicorn config.wsgi:application --bind 0.0.0.0:8000`
4. Deploy!

**Azure App Service:**
1. Create App Service
2. Configure Python runtime
3. Set environment variables
4. Deploy via Git or Azure DevOps

**Heroku (if using Heroku Postgres):**
```
heroku create tilahun-portfolio
git push heroku main
```

---

## 📋 Production Checklist

### Security

- [ ] `DJANGO_DEBUG=0` in production
- [ ] `DJANGO_SECRET_KEY` is random and long (50+ characters)
- [ ] Database password is strong (16+ characters, mixed case, numbers, symbols)
- [ ] HTTPS/SSL certificate installed
- [ ] CORS only allows your frontend domain
- [ ] API authentication considered for future updates
- [ ] Automated backups enabled for MySQL database
- [ ] Security headers configured (X-Frame-Options, X-Content-Type-Options, etc.)

### Performance

- [ ] Static files served via CDN (Netlify does this auto)
- [ ] Database indexes on frequently queried fields
- [ ] Caching headers set appropriately
- [ ] Compression enabled (gzip)
- [ ] Image optimization in place

### Monitoring

- [ ] Error logging configured
- [ ] Database monitoring enabled
- [ ] Uptime monitoring set up (StatusCake, Uptime Robot, etc.)
- [ ] Backup verification tested (restore from backup)
- [ ] Email alerts configured for critical errors

### Content & Branding

- [ ] Profile information complete and accurate
- [ ] Hero image uploaded
- [ ] CV/Resume document uploaded
- [ ] All experience, education, skills entered
- [ ] Contact form tested and sending emails
- [ ] Social media links (if applicable)

---

## 🔄 Recurring Tasks

### Daily
- Monitor error logs
- Check uptime monitoring alerts

### Weekly
- Review contact form submissions
- Test contact form and critical paths
- Check error tracking for new issues

### Monthly
- Verify backups are occurring
- Review performance metrics
- Test disaster recovery procedure

### Quarterly
- Update dependencies (carefully)
- Security audit
- Content refresh/review

---

## 📊 Monitoring URLs (After Deployment)

- **Frontend**: https://yourdomain.netlify.app (or your custom domain)
- **Backend Health**: https://api.yourdomain.com/api/health
- **Content API**: https://api.yourdomain.com/api/content
- **Admin Panel**: https://api.yourdomain.com/admin/

---

## 🆘 Emergency Procedures

### Backend Down
1. Check error logs: `tail -f logs/django.log`
2. Verify database connection
3. Restart application server
4. Check uptime monitoring alerts

### Database Issues
1. Check disk space
2. Verify backups exist
3. Test database connection
4. Consider restoring from backup

### Frontend Issues
1. Check browser console for errors
2. Verify API is accessible
3. Clear browser cache
4. Trigger Netlify redeploy

### Cache Issues
1. Clear browser cache
2. Purge CDN cache
3. Restart servers
4. Verify static files were updated

---

## 📞 Support & Escalation

| Issue | Primary Check | Secondary Check |
|-------|--------------|-----------------|
| Frontend blank | Browser console errors | API accessibility |
| API errors | Database connection | Environment variables |
| Slow performance | Database queries | Server resources |
| Content not updating | Admin entry status | Cache invalidation |
| CORS errors | Allowed origins config | Frontend domain |

---

## 📝 Post-Deployment Tasks

### First 24 Hours
- [ ] Monitor error logs closely
- [ ] Test all functionality
- [ ] Verify contact form emails arriving
- [ ] Check performance metrics

### First Week
- [ ] Share URL with team/friends for feedback
- [ ] Test on various devices
- [ ] Update any SEO metadata
- [ ] Verify analytics are tracking

### Ongoing
- [ ] Update content regularly
- [ ] Monitor for security updates
- [ ] Review performance metrics monthly
- [ ] Plan feature enhancements

---

## 🎯 Future Enhancements

Potential improvements for future versions:

- [ ] Add blog section
- [ ] Implement skill endorsement system  
- [ ] Add photo gallery with lightbox
- [ ] Implement dark mode toggle
- [ ] Add multi-language support
- [ ] Implement analytics dashboard
- [ ] Add video portfolio sections
- [ ] Integrate newsletter signup
- [ ] Add project showcase with demos
- [ ] Implement search functionality

---

## 📚 Useful Commands

### Backend Maintenance
```powershell
# Create migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Backup database
python manage.py dumpdata > backup.json

# Restore database
python manage.py loaddata backup.json

# Clear cache
python manage.py clear_cache

# Create superuser
python manage.py createsuperuser
```

### Frontend Builds
```powershell
# Development with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

**Last Updated**: February 2025  
**For**: Tilahun Alene Terfie  
**Stack**: Django 5.1 + React 18 + MySQL 8.0 + Netlify
