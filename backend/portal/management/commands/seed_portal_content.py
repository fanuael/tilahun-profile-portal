import json
from pathlib import Path

from django.core.management.base import BaseCommand

from portal.models import (
    BlogItem,
    DEFAULT_PASSION_TEXT,
    DEFAULT_RESUME_TEXT,
    EducationItem,
    ExperienceItem,
    HighlightStat,
    IdeaItem,
    MediaAsset,
    PassionContent,
    ProgramItem,
    PublicationItem,
    ResumeContent,
    SiteProfile,
    SkillItem,
    StoryItem,
)


class Command(BaseCommand):
    help = "Seed portal content models from backend/data/content.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Reset current portal content before importing.",
        )

    def handle(self, *args, **options):
        data_path = Path(__file__).resolve().parents[3] / "data" / "content.json"
        if not data_path.exists():
            self.stdout.write(self.style.ERROR(f"Missing file: {data_path}"))
            return

        with data_path.open("r", encoding="utf-8-sig") as file:
            payload = json.load(file)

        if options["reset"]:
            BlogItem.objects.all().delete()
            ResumeContent.objects.all().delete()
            PassionContent.objects.all().delete()
            ExperienceItem.objects.all().delete()
            StoryItem.objects.all().delete()
            EducationItem.objects.all().delete()
            ProgramItem.objects.all().delete()
            SkillItem.objects.all().delete()
            PublicationItem.objects.all().delete()
            IdeaItem.objects.all().delete()
            HighlightStat.objects.all().delete()
            MediaAsset.objects.all().delete()
            SiteProfile.objects.all().delete()

        profile_data = payload.get("profile", {})
        profile = SiteProfile.objects.first()
        if profile is None:
            profile = SiteProfile()

        profile.name = profile_data.get("name", "Tilahun Alene Terfie")
        profile.title = profile_data.get("title", "Innovation and Sustainable Business Professional")
        profile.location = profile_data.get("location", "Addis Ababa, Ethiopia")
        profile.email = profile_data.get("email", "")
        profile.phone = profile_data.get("phone", "")
        profile.nationality = profile_data.get("nationality", "")
        profile.current_focus = profile_data.get("current_focus", "")
        profile.summary = payload.get("summary", "")
        profile.resume_text = payload.get("resume_text", profile_data.get("resume_text", DEFAULT_RESUME_TEXT))
        profile.passion_text = payload.get("passion_text", profile_data.get("passion_text", DEFAULT_PASSION_TEXT))
        profile.collaboration_blurb = (
            "Open to partnerships in innovation policy, sustainable entrepreneurship, and international business."
        )
        profile.save()

        if options["reset"]:
            ResumeContent.objects.create(
                title="Resume",
                content=profile.resume_text or DEFAULT_RESUME_TEXT,
            )
            PassionContent.objects.create(
                title="Passion",
                content=profile.passion_text or DEFAULT_PASSION_TEXT,
            )

        if options["reset"]:
            default_stats = [
                ("15+ years", "Leadership in public sector innovation"),
                ("National programs", "Startup and ecosystem coordination"),
                ("Global exposure", "China, United States, UK partnerships"),
            ]
            for idx, stat in enumerate(default_stats):
                HighlightStat.objects.create(
                    label=stat[0],
                    value=stat[1],
                    sort_order=idx,
                    is_published=True,
                )

        if options["reset"]:
            for idx, item in enumerate(payload.get("story", [])):
                StoryItem.objects.create(
                    year=item.get("year", ""),
                    title=item.get("title", ""),
                    detail=item.get("detail", ""),
                    sort_order=idx,
                    is_published=True,
                )

            for idx, item in enumerate(payload.get("experience", [])):
                ExperienceItem.objects.create(
                    role=item.get("role", ""),
                    organization=item.get("organization", ""),
                    period=item.get("period", ""),
                    location=item.get("location", ""),
                    description=item.get("description", ""),
                    sort_order=idx,
                    is_published=True,
                )

            for idx, item in enumerate(payload.get("education", [])):
                EducationItem.objects.create(
                    degree=item.get("degree", ""),
                    field=item.get("field", ""),
                    institution=item.get("institution", ""),
                    year=item.get("year", ""),
                    sort_order=idx,
                    is_published=True,
                )

            for idx, item in enumerate(payload.get("programs", [])):
                if isinstance(item, dict):
                    title = item.get("title", "")
                    organization = item.get("organization", "")
                    period = item.get("period", "")
                else:
                    title = str(item)
                    organization = ""
                    period = ""
                ProgramItem.objects.create(
                    title=title,
                    organization=organization,
                    period=period,
                    sort_order=idx,
                    is_published=True,
                )

            category_mapping = [
                (SkillItem.CATEGORY_CORE, payload.get("competencies", [])),
                (SkillItem.CATEGORY_TECHNICAL, payload.get("technical", [])),
                (SkillItem.CATEGORY_LANGUAGE, payload.get("languages", [])),
                (SkillItem.CATEGORY_INTEREST, payload.get("interests", [])),
            ]
            for category, items in category_mapping:
                for idx, label in enumerate(items):
                    SkillItem.objects.create(
                        category=category,
                        label=label,
                        sort_order=idx,
                        is_published=True,
                    )

            for idx, item in enumerate(payload.get("publications", [])):
                PublicationItem.objects.create(
                    title=item.get("title", ""),
                    year=item.get("year", ""),
                    item_type=item.get("type", ""),
                    status=item.get("status", ""),
                    summary=item.get("summary", ""),
                    sort_order=idx,
                    is_published=True,
                )

            for idx, item in enumerate(payload.get("ideas", [])):
                IdeaItem.objects.create(
                    title=item.get("title", ""),
                    stage=item.get("stage", ""),
                    summary=item.get("summary", ""),
                    impact=item.get("impact", ""),
                    sort_order=idx,
                    is_published=True,
                )

            blog_groups = payload.get("blogs", {})
            blog_index = 0
            for category in ("news", "articles", "insights"):
                for item in blog_groups.get(category, []):
                    BlogItem.objects.create(
                        category=category,
                        title=item.get("title", ""),
                        summary=item.get("summary", ""),
                        content=item.get("content", ""),
                        external_url=item.get("url", ""),
                        sort_order=blog_index,
                        is_published=True,
                    )
                    blog_index += 1

        self.stdout.write(self.style.SUCCESS("Portal content seeding completed."))
