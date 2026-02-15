@echo off
set USE_SQLITE=1
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
