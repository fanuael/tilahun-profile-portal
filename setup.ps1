# Tilahun Profile Portal - Quick Start Setup (PowerShell)
# Run as: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tilahun Profile Portal - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Colors
$success = "Green"
$info = "Cyan"
$warning = "Yellow"

# Backend Setup
Write-Host "[1/4] Setting up Backend..." -ForegroundColor $info
Push-Location backend

if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor $info
    python -m venv .venv
}

Write-Host "Activating virtual environment..." -ForegroundColor $info
& .\.venv\Scripts\Activate.ps1

Write-Host "Installing dependencies..." -ForegroundColor $info
pip install -r requirements.txt -q

Write-Host "Configuring SQLite for local development..." -ForegroundColor $info
$env:USE_SQLITE = "1"

Write-Host "Running migrations..." -ForegroundColor $info
python manage.py migrate -q

Write-Host "Loading sample data..." -ForegroundColor $info
python manage.py loaddata portal/fixtures/seed_data.json -q

Write-Host "Setting up admin user..." -ForegroundColor $info
python manage.py shell <<< @"
from django.contrib.auth import get_user_model
User = get_user_model()
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={'email': 'admin@example.com', 'is_staff': True, 'is_superuser': True}
)
admin_user.set_password('admin123')
admin_user.save()
if created:
    print('✓ Admin user created: admin / admin123')
else:
    print('✓ Admin user password reset to: admin123')
"@ -ErrorAction SilentlyContinue

Write-Host "✓ Backend ready!" -ForegroundColor $success
Write-Host ""

Pop-Location

# Frontend Setup
Write-Host "[2/4] Setting up Frontend..." -ForegroundColor $info
Push-Location frontend

Write-Host "Installing npm dependencies..." -ForegroundColor $info
npm install -q 2>$null

Write-Host "✓ Frontend dependencies installed!" -ForegroundColor $success
Write-Host ""

Pop-Location

# Display Instructions
Write-Host "[3/4] Displaying startup instructions..." -ForegroundColor $info
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete! 🎉" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor $warning
Write-Host ""

Write-Host "1. Open first Terminal and run:" -ForegroundColor White
Write-Host '   cd backend' -ForegroundColor Cyan
Write-Host '   .\.venv\Scripts\Activate.ps1' -ForegroundColor Cyan
Write-Host '   python manage.py runserver 127.0.0.1:8000' -ForegroundColor Cyan
Write-Host ""

Write-Host "2. Open second Terminal and run:" -ForegroundColor White
Write-Host '   cd frontend' -ForegroundColor Cyan
Write-Host '   npm run dev' -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Open URLs in your browser:" -ForegroundColor White
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor $success
Write-Host "   Backend:   http://127.0.0.1:8000" -ForegroundColor $success
Write-Host "   Admin:     http://127.0.0.1:8000/admin" -ForegroundColor $success
Write-Host "   Username:  admin" -ForegroundColor White
Write-Host "   Password:  admin123" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "For MySQL setup, see SETUP_GUIDE.md" -ForegroundColor $info
Write-Host ""

Write-Host "Press any key to exit..."
[void][System.Console]::ReadKey($true)
