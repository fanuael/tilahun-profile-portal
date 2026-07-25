# Coolify deployment guide

## 1. What to deploy
Deploy the repository as a Docker Compose stack with two services:
- frontend: serves the React/Vite app through Nginx
- backend: serves Django via Gunicorn

## 2. Coolify setup
In Coolify, create a new project and add the repository.

### Recommended settings
- Build method: Docker Compose
- Compose file: docker-compose.yml
- Environment file: .env.production.example (copy to your real env file in Coolify)
- Port mapping:
  - frontend: 3000 -> 80
  - backend: 8000 -> 8000

## 3. Required environment variables
Set these in Coolify before deployment:
- DJANGO_SECRET_KEY
- DJANGO_DEBUG=0
- DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,localhost,127.0.0.1
- DJANGO_CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
- DJANGO_CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
- DJANGO_SESSION_COOKIE_SECURE=1
- DJANGO_CSRF_COOKIE_SECURE=1
- DJANGO_SECURE_SSL_REDIRECT=1
- POSTGRES_DB=tilahun
- POSTGRES_USER=tilahun
- POSTGRES_PASSWORD=strong-password
- OPENAI_API_KEY=your-key
- AI_PROVIDER=openai

## 4. Important note about the database
The current container setup defaults to SQLite when DATABASE_URL is blank. That is acceptable for a starter deployment, but for production persistence you should configure Postgres or a managed database and set DATABASE_URL accordingly.

## 5. After deployment
- Open the frontend URL to verify the site
- Open /admin/ on the backend domain or the frontend proxy path if configured
- Check container logs if the backend fails to boot
