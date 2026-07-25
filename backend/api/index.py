import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

try:
    from config.admin_utils import enforce_admin_credentials
except ImportError:
    enforce_admin_credentials = None

if enforce_admin_credentials is not None:
    enforce_admin_credentials()
