from __future__ import annotations

import json

from django.db import DatabaseError
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import (
    ContactMessage,
    EducationItem,
    ExperienceItem,
    HighlightStat,
    IdeaItem,
    MediaAsset,
    ProgramItem,
    PublicationItem,
    SiteProfile,
    SkillItem,
    StoryItem,
)


def file_url(request: HttpRequest, file_field, version: str | None = None) -> str:
    if not file_field:
        return ""
    try:
        url = request.build_absolute_uri(file_field.url)
        if version:
            separator = "&" if "?" in url else "?"
            return f"{url}{separator}v={version}"
        return url
    except ValueError:
        return ""


def serialize_media(request: HttpRequest, queryset) -> list[dict]:
    return [
        {
            "id": asset.id,
            "title": asset.title,
            "caption": asset.caption,
            "asset_type": asset.asset_type,
            "section": asset.section,
            "file_url": file_url(request, asset.file),
        }
        for asset in queryset
    ]


def load_content(request: HttpRequest) -> dict:
    profile = SiteProfile.objects.order_by("-updated_at").first()
    stats = HighlightStat.objects.filter(is_published=True)
    story_items = StoryItem.objects.filter(is_published=True)
    experience_items = ExperienceItem.objects.filter(is_published=True).prefetch_related(
        "highlights"
    )
    education_items = EducationItem.objects.filter(is_published=True)
    program_items = ProgramItem.objects.filter(is_published=True)
    skill_items = SkillItem.objects.filter(is_published=True)
    publication_items = PublicationItem.objects.filter(is_published=True)
    idea_items = IdeaItem.objects.filter(is_published=True)
    media_items = MediaAsset.objects.filter(is_published=True)

    skills_by_category = {
        SkillItem.CATEGORY_CORE: [],
        SkillItem.CATEGORY_TECHNICAL: [],
        SkillItem.CATEGORY_LANGUAGE: [],
        SkillItem.CATEGORY_INTEREST: [],
    }
    for skill in skill_items:
        skills_by_category[skill.category].append(skill.label)

    media_payload = serialize_media(request, media_items)
    home_images = [
        item
        for item in media_payload
        if item["asset_type"] == MediaAsset.TYPE_IMAGE and item["section"] == MediaAsset.SECTION_HOME
    ]
    library_documents = [
        item
        for item in media_payload
        if item["asset_type"] == MediaAsset.TYPE_DOCUMENT and item["section"] == MediaAsset.SECTION_LIBRARY
    ]
    profile_version = str(int(profile.updated_at.timestamp())) if profile else None

    profile_payload = {
        "name": profile.name if profile else "Tilahun Alene Terfie",
        "title": profile.title if profile else "Innovation and Sustainable Business Professional",
        "location": profile.location if profile else "Addis Ababa, Ethiopia",
        "email": profile.email if profile else "tilahunalenee@gmail.com",
        "phone": profile.phone if profile else "+251 941 883 746",
        "nationality": profile.nationality if profile else "Ethiopian",
        "current_focus": profile.current_focus if profile else "",
        "hero_image_url": (
            file_url(request, profile.hero_image, profile_version)
            if profile and profile.hero_image
            else (home_images[0]["file_url"] if home_images else "")
        ),
        "cv_url": (
            file_url(request, profile.cv_document, profile_version)
            if profile and profile.cv_document
            else (library_documents[0]["file_url"] if library_documents else "")
        ),
        "updated_at": profile.updated_at.isoformat() if profile else "",
    }

    return {
        "profile": profile_payload,
        "summary": profile.summary if profile else "",
        "contact_blurb": profile.collaboration_blurb if profile else "",
        "stats": [{"label": item.label, "value": item.value} for item in stats],
        "story": [
            {
                "year": item.year,
                "title": item.title,
                "detail": item.detail,
            }
            for item in story_items
        ],
        "experience": [
            {
                "role": item.role,
                "organization": item.organization,
                "period": item.period,
                "location": item.location,
                "description": item.description,
                "highlights": [highlight.text for highlight in item.highlights.all()],
            }
            for item in experience_items
        ],
        "education": [
            {
                "degree": item.degree,
                "field": item.field,
                "institution": item.institution,
                "year": item.year,
            }
            for item in education_items
        ],
        "programs": [
            {
                "title": item.title,
                "organization": item.organization,
                "period": item.period,
            }
            for item in program_items
        ],
        "competencies": skills_by_category[SkillItem.CATEGORY_CORE],
        "technical": skills_by_category[SkillItem.CATEGORY_TECHNICAL],
        "languages": skills_by_category[SkillItem.CATEGORY_LANGUAGE],
        "interests": skills_by_category[SkillItem.CATEGORY_INTEREST],
        "publications": [
            {
                "title": item.title,
                "year": item.year,
                "type": item.item_type,
                "status": item.status,
                "summary": item.summary,
                "url": item.external_url,
                "document_url": file_url(request, item.document),
                "image_url": file_url(request, item.cover_image),
            }
            for item in publication_items
        ],
        "ideas": [
            {
                "title": item.title,
                "stage": item.stage,
                "summary": item.summary,
                "impact": item.impact,
                "url": item.external_url,
                "document_url": file_url(request, item.document),
                "image_url": file_url(request, item.cover_image),
            }
            for item in idea_items
        ],
        "media": {
            "all": media_payload,
            "images": [item for item in media_payload if item["asset_type"] == MediaAsset.TYPE_IMAGE],
            "documents": [
                item for item in media_payload if item["asset_type"] == MediaAsset.TYPE_DOCUMENT
            ],
            "home": [item for item in media_payload if item["section"] == MediaAsset.SECTION_HOME],
            "story": [item for item in media_payload if item["section"] == MediaAsset.SECTION_STORY],
            "work": [item for item in media_payload if item["section"] == MediaAsset.SECTION_WORK],
            "research": [
                item for item in media_payload if item["section"] == MediaAsset.SECTION_RESEARCH
            ],
            "library": [
                item for item in media_payload if item["section"] == MediaAsset.SECTION_LIBRARY
            ],
            "general": [
                item for item in media_payload if item["section"] == MediaAsset.SECTION_GENERAL
            ],
        },
    }


@require_GET
def root(request: HttpRequest) -> JsonResponse:
    return JsonResponse(
        {"service": "Tilahun Profile Portal API (Django + MySQL)", "status": "ok"},
        status=200,
    )


@require_GET
def health(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"status": "ok"}, status=200)


@require_GET
def content(request: HttpRequest) -> JsonResponse:
    try:
        payload = load_content(request)
    except DatabaseError:
        return JsonResponse(
            {"detail": "Database unavailable. Configure MySQL and run migrations."},
            status=503,
        )
    return JsonResponse(payload, status=200)


@require_GET
def story(request: HttpRequest) -> JsonResponse:
    try:
        payload = load_content(request).get("story", [])
    except DatabaseError:
        return JsonResponse(
            {"detail": "Database unavailable. Configure MySQL and run migrations."},
            status=503,
        )
    return JsonResponse(payload, safe=False, status=200)


@require_GET
def publications(request: HttpRequest) -> JsonResponse:
    try:
        payload = load_content(request).get("publications", [])
    except DatabaseError:
        return JsonResponse(
            {"detail": "Database unavailable. Configure MySQL and run migrations."},
            status=503,
        )
    return JsonResponse(payload, safe=False, status=200)


@require_GET
def ideas(request: HttpRequest) -> JsonResponse:
    try:
        payload = load_content(request).get("ideas", [])
    except DatabaseError:
        return JsonResponse(
            {"detail": "Database unavailable. Configure MySQL and run migrations."},
            status=503,
        )
    return JsonResponse(payload, safe=False, status=200)


@require_GET
def media(request: HttpRequest) -> JsonResponse:
    try:
        payload = load_content(request).get("media", {})
    except DatabaseError:
        return JsonResponse(
            {"detail": "Database unavailable. Configure MySQL and run migrations."},
            status=503,
        )
    return JsonResponse(payload, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def contact(request: HttpRequest) -> JsonResponse:
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    required = ("name", "email", "subject", "message")
    if not all(payload.get(key) for key in required):
        return JsonResponse({"detail": "Missing required fields"}, status=400)

    try:
        ContactMessage.objects.create(
            name=str(payload["name"]).strip(),
            email=str(payload["email"]).strip(),
            subject=str(payload["subject"]).strip(),
            message=str(payload["message"]).strip(),
        )
    except DatabaseError:
        return JsonResponse(
            {"detail": "Database unavailable. Configure MySQL and run migrations."},
            status=503,
        )
    return JsonResponse({"status": "received"}, status=200)
