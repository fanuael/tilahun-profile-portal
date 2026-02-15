from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.test import RequestFactory
from django.utils import timezone

from portal.views import load_content


class Command(BaseCommand):
    help = "Export published portal content and media for static frontend deployment."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--output-json",
            default="frontend/public/published-content.json",
            help="Path to output JSON file relative to project root.",
        )
        parser.add_argument(
            "--output-media-dir",
            default="frontend/public/published-media",
            help="Path to output media folder relative to project root.",
        )

    def handle(self, *args, **options) -> None:
        repo_root = Path(__file__).resolve().parents[4]
        output_json = (repo_root / options["output_json"]).resolve()
        output_media_dir = (repo_root / options["output_media_dir"]).resolve()

        if not output_json.parent.exists():
            output_json.parent.mkdir(parents=True, exist_ok=True)

        output_media_dir.mkdir(parents=True, exist_ok=True)

        factory = RequestFactory()
        request = factory.get("/")
        request.META["HTTP_HOST"] = "127.0.0.1:8000"
        request.META["wsgi.url_scheme"] = "http"

        try:
            payload = load_content(request)
        except Exception as exc:
            raise CommandError(f"Unable to load content from database: {exc}") from exc

        copied_files: set[Path] = set()
        media_url = settings.MEDIA_URL.rstrip("/") + "/"

        def remap_media_url(value: str) -> str:
            if not value:
                return value

            parsed = urlparse(value)
            path = parsed.path if parsed.scheme or parsed.netloc else value
            if not path.startswith(media_url):
                return value

            relative_path = path[len(media_url) :].lstrip("/")
            if not relative_path:
                return value

            source_file = Path(settings.MEDIA_ROOT) / relative_path
            destination_file = output_media_dir / relative_path
            destination_file.parent.mkdir(parents=True, exist_ok=True)

            if source_file.exists():
                if destination_file not in copied_files:
                    shutil.copy2(source_file, destination_file)
                    copied_files.add(destination_file)
            else:
                self.stderr.write(f"Missing media file: {source_file}")

            return f"/published-media/{relative_path.replace('\\', '/')}"

        def walk(data: Any) -> Any:
            if isinstance(data, dict):
                return {key: walk(value) for key, value in data.items()}
            if isinstance(data, list):
                return [walk(item) for item in data]
            if isinstance(data, str):
                return remap_media_url(data)
            return data

        exported = walk(payload)
        exported["meta"] = {
            "generated_at": timezone.now().isoformat(),
            "source": "django-admin-export",
        }

        output_json.write_text(json.dumps(exported, indent=2, ensure_ascii=False), encoding="utf-8")
        self.stdout.write(
            self.style.SUCCESS(
                f"Exported content to {output_json} and media to {output_media_dir}"
            )
        )
