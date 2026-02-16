@echo off
REM Tilahun Profile Portal - Quick Start Setup
REM This script sets up the entire project for local development

echo ========================================
echo Tilahun Profile Portal - Setup
echo ========================================
echo.

REM Backend Setup
echo [1/4] Setting up Backend...
cd backend
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt -q

echo Configuring SQLite for local development...
set USE_SQLITE=1

echo Running migrations...
python manage.py migrate -q

echo Loading sample data...
python manage.py loaddata portal/fixtures/seed_data.json -q

echo Creating admin account (skip if exists)...
python manage.py createsuperuser --noinput --username=admin --email=admin@example.com 2>nul
python manage.py shell << PYEOF
from django.contrib.auth import get_user_model
User = get_user_model()
if User.objects.filter(username='admin').exists():
    user = User.objects.get(username='admin')
    user.set_password('admin123')
    user.save()
    print("Admin password set to: admin123")
PYEOF

echo.
echo ✓ Backend ready!
echo.

cd ..

REM Frontend Setup
echo [2/4] Setting up Frontend...
cd frontend
call npm install -q
echo ✓ Frontend dependencies installed!
echo.
cd ..

REM Display Instructions
echo [3/4] Displaying startup instructions...
echo.
echo ========================================
echo Setup Complete! 🎉
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Open first PowerShell/Terminal window and run:
echo    cd backend
echo    .\.venv\Scripts\Activate.ps1
echo    python manage.py runserver 127.0.0.1:8000
echo.
echo 2. Open second PowerShell/Terminal window and run:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser:
echo    - Frontend:  http://localhost:5173
echo    - Backend:   http://127.0.0.1:8000
echo    - Admin:     http://127.0.0.1:8000/admin
echo       Username: admin
echo       Password: admin123
echo.
echo ========================================
echo.

REM Keep window open
pause
