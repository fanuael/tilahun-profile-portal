"""Django settings for the Tilahun profile portal."""

import os
import shutil
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load local environment variables from .env if present.
load_dotenv(BASE_DIR.parent / '.env')
load_dotenv(BASE_DIR / '.env')


def env_csv(name: str, default: str = "") -> list[str]:
    raw = os.environ.get(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


def env_bool(name: str, default: str = "0") -> bool:
    return os.environ.get(name, default).lower() in ("1", "true", "yes")


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-dev-key-change-me",
)

# SECURITY WARNING: don't run with debug turned on in production!
if os.environ.get("VERCEL", "0") == "1" or os.environ.get("VERCEL_ENV"):
    DEBUG = os.environ.get("DJANGO_DEBUG", "0") == "1"
else:
    DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1"

default_allowed_hosts = ["127.0.0.1", "localhost", "testserver", ".vercel.app"]
raw_allowed_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS")
if raw_allowed_hosts:
    ALLOWED_HOSTS = env_csv("DJANGO_ALLOWED_HOSTS", "")
else:
    ALLOWED_HOSTS = default_allowed_hosts

# Allow Vercel preview and production domains even when the host is not explicitly listed.
if not any(host == "*" for host in ALLOWED_HOSTS) and ".vercel.app" not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(".vercel.app")


# Application definition

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "portal",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database: SQLite is the default for local development.
# In production, use a persistent MySQL database via USE_MYSQL=1 or DATABASE_URL.
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
if DATABASE_URL:
    parsed = urlparse(DATABASE_URL)
    db_scheme = parsed.scheme.lower()
    if db_scheme in ("mysql", "mysql+pymysql"):
        engine = "django.db.backends.mysql"
        default_port = 3306
        options = {"charset": "utf8mb4"}
    elif db_scheme in ("postgres", "postgresql"):
        engine = "django.db.backends.postgresql"
        default_port = 5432
        query_params = parse_qs(parsed.query)
        options = {}
        if "sslmode" in query_params:
            options["sslmode"] = query_params["sslmode"][0]
        if "options" in query_params:
            options["options"] = query_params["options"][0]
    else:
        raise RuntimeError(
            f"DATABASE_URL scheme '{db_scheme}' is not supported. Use mysql, mysql+pymysql, postgres, or postgresql."
        )

    database = {
        "ENGINE": engine,
        "NAME": parsed.path.lstrip("/"),
        "USER": parsed.username or "",
        "PASSWORD": parsed.password or "",
        "HOST": parsed.hostname or "",
        "PORT": str(parsed.port or str(default_port)),
    }
    if options:
        database["OPTIONS"] = options

    DATABASES = {
        "default": database
    }
elif os.environ.get("USE_MYSQL", "0") == "1":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": os.environ.get("MYSQL_DATABASE", "tilahun_portal"),
            "USER": os.environ.get("MYSQL_USER", "root"),
            "PASSWORD": os.environ.get("MYSQL_PASSWORD", ""),
            "HOST": os.environ.get("MYSQL_HOST", "127.0.0.1"),
            "PORT": os.environ.get("MYSQL_PORT", "3306"),
            "OPTIONS": {"charset": "utf8mb4"},
        }
    }
else:
    sqlite_path = BASE_DIR / "db.sqlite3"
    if os.environ.get("VERCEL", "0") == "1" or os.environ.get("VERCEL_ENV", "").lower() in ("production", "preview", "development"):
        writable_sqlite_path = Path("/tmp") / "db.sqlite3"
        if sqlite_path.exists() and not writable_sqlite_path.exists():
            try:
                shutil.copy2(sqlite_path, writable_sqlite_path)
            except OSError:
                pass
        sqlite_path = writable_sqlite_path

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": sqlite_path,
        }
    }

CONN_MAX_AGE = int(os.environ.get("DJANGO_DB_CONN_MAX_AGE", "60"))
ATOMIC_REQUESTS = os.environ.get("DJANGO_DB_ATOMIC_REQUESTS", "1") == "1"


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"

# Determine a writable media root for the current runtime.
local_media_root = BASE_DIR / "media"
serverless_fallback = Path("/tmp/media")
if os.environ.get("DJANGO_MEDIA_ROOT"):
    MEDIA_ROOT = Path(os.environ["DJANGO_MEDIA_ROOT"])
elif local_media_root.exists() or os.access(local_media_root, os.W_OK):
    MEDIA_ROOT = local_media_root
elif os.environ.get("VERCEL", "0") == "1" or os.environ.get("VERCEL_ENV"):
    frontend_media_root = BASE_DIR.parent / "frontend" / "dist" / "published-media"
    frontend_public_media_root = BASE_DIR.parent / "frontend" / "public" / "published-media"
    if frontend_media_root.exists() and os.access(frontend_media_root, os.R_OK):
        MEDIA_ROOT = frontend_media_root
    elif frontend_public_media_root.exists() and os.access(frontend_public_media_root, os.R_OK):
        MEDIA_ROOT = frontend_public_media_root
    else:
        MEDIA_ROOT = serverless_fallback
else:
    MEDIA_ROOT = serverless_fallback

MEDIA_ROOT.mkdir(parents=True, exist_ok=True)

USE_PUBLISHED_MEDIA_URL = (
    os.environ.get("DJANGO_USE_PUBLISHED_MEDIA_URL", "0") == "1"
    or os.environ.get("VERCEL", "0") == "1"
    or bool(os.environ.get("VERCEL_ENV"))
)

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = env_csv(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    "http://127.0.0.1:5173,http://localhost:5173,https://tilahun-profile-portal.vercel.app",
)
CORS_ALLOWED_ORIGIN_REGEXES = env_csv(
    "DJANGO_CORS_ALLOWED_ORIGIN_REGEXES",
    r"https://.*\.vercel\.app",
)
CORS_ALLOW_ALL_ORIGINS = os.environ.get("DJANGO_CORS_ALLOW_ALL_ORIGINS", "0") == "1"
CORS_ALLOW_CREDENTIALS = os.environ.get("DJANGO_CORS_ALLOW_CREDENTIALS", "0") == "1"

CSRF_TRUSTED_ORIGINS = env_csv(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    "http://127.0.0.1:5173,http://localhost:5173,https://tilahun-profile-portal.vercel.app",
)
# Also allow the common alternate dev/preview port 5174 used by Vite/python preview
if not any('5174' in o for o in CORS_ALLOWED_ORIGINS):
    CORS_ALLOWED_ORIGINS += ['http://127.0.0.1:5174', 'http://localhost:5174']
if not any('5174' in o for o in CSRF_TRUSTED_ORIGINS):
    CSRF_TRUSTED_ORIGINS += ['http://127.0.0.1:5174', 'http://localhost:5174']

X_FRAME_OPTIONS = "SAMEORIGIN"

SESSION_COOKIE_SECURE = env_bool("DJANGO_SESSION_COOKIE_SECURE", "1") if not DEBUG else env_bool("DJANGO_SESSION_COOKIE_SECURE", "0")
CSRF_COOKIE_SECURE = env_bool("DJANGO_CSRF_COOKIE_SECURE", "1") if not DEBUG else env_bool("DJANGO_CSRF_COOKIE_SECURE", "0")
SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", "1") if not DEBUG else env_bool("DJANGO_SECURE_SSL_REDIRECT", "0")
SECURE_HSTS_SECONDS = int(os.environ.get("DJANGO_SECURE_HSTS_SECONDS", "31536000" if not DEBUG else "0"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool("DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", "1")
SECURE_HSTS_PRELOAD = env_bool("DJANGO_SECURE_HSTS_PRELOAD", "1")
SECURE_REFERRER_POLICY = os.environ.get("DJANGO_SECURE_REFERRER_POLICY", "same-origin")
SECURE_BROWSER_XSS_FILTER = env_bool("DJANGO_SECURE_BROWSER_XSS_FILTER", "1")
SECURE_CONTENT_TYPE_NOSNIFF = env_bool("DJANGO_SECURE_CONTENT_TYPE_NOSNIFF", "1")

if not DEBUG:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
