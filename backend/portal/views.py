from __future__ import annotations

import json

from django.db import DatabaseError
from django.http import HttpRequest, JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import (
    BlogItem,
    ContactMessage,
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
    resume_entry = ResumeContent.objects.order_by("-updated_at").first()
    passion_entry = PassionContent.objects.order_by("-updated_at").first()
    blog_items = BlogItem.objects.filter(is_published=True)
    stats = HighlightStat.objects.filter(is_published=True)
    story_items = StoryItem.objects.filter(is_published=True)
    experience_items = ExperienceItem.objects.filter(is_published=True)
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
    profile_version = str(int(profile.updated_at.timestamp())) if profile else None

    profile_payload = {
        "name": profile.name if profile else "",
        "title": profile.title if profile else "",
        "location": profile.location if profile else "",
        "email": profile.email if profile else "",
        "phone": profile.phone if profile else "",
        "nationality": profile.nationality if profile else "",
        "current_focus": profile.current_focus if profile else "",
        "hero_image_url": (
            file_url(request, profile.hero_image, profile_version)
            if profile and profile.hero_image
            else (home_images[0]["file_url"] if home_images else "")
        ),
        "cv_url": "",
        "updated_at": profile.updated_at.isoformat() if profile else "",
    }

    blog_payload = [
        {
            "id": item.id,
            "category": item.category,
            "title": item.title,
            "summary": item.summary,
            "content": item.content,
            "url": item.external_url,
            "published_on": item.published_on.isoformat() if item.published_on else "",
        }
        for item in blog_items
    ]

    return {
        "profile": profile_payload,
        "summary": profile.summary if profile else "",
        "resume_text": (
            resume_entry.content
            if resume_entry
            else (profile.resume_text if profile else "")
        ),
        "passion_text": (
            passion_entry.content
            if passion_entry
            else (profile.passion_text if profile else "")
        ),
        "resume": {
            "title": resume_entry.title if resume_entry else "Resume",
            "content": (
                resume_entry.content
                if resume_entry
                else (profile.resume_text if profile else "")
            ),
        },
        "passion": {
            "title": passion_entry.title if passion_entry else "Passion",
            "content": (
                passion_entry.content
                if passion_entry
                else (profile.passion_text if profile else "")
            ),
        },
        "contact_blurb": profile.collaboration_blurb if profile else "",
        "blogs": {
            "all": blog_payload,
            "news": [
                item for item in blog_payload if item["category"] == BlogItem.CATEGORY_NEWS
            ],
            "articles": [
                item for item in blog_payload if item["category"] == BlogItem.CATEGORY_ARTICLES
            ],
            "insights": [
                item for item in blog_payload if item["category"] == BlogItem.CATEGORY_INSIGHTS
            ],
        },
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
@never_cache
def health(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"status": "ok"}, status=200)


@require_GET
@never_cache
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
@never_cache
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
@never_cache
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
@never_cache
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
@never_cache
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
    raw_body = request.body.decode("utf-8", errors="ignore").strip()
    payload = {}

    if raw_body:
        try:
            payload = json.loads(raw_body)
        except json.JSONDecodeError:
            return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"detail": "JSON object payload is required"}, status=400)

    def clean_optional(value):
        if value is None:
            return ""
        return str(value).strip()

    try:
        ContactMessage.objects.create(
            name=clean_optional(payload.get("name")),
            email=clean_optional(payload.get("email")),
            subject=clean_optional(payload.get("subject")),
            message=clean_optional(payload.get("message")),
        )
    except DatabaseError:
        return JsonResponse(
            {"detail": "Database unavailable. Configure MySQL and run migrations."},
            status=503,
        )
    return JsonResponse({"status": "received"}, status=200)
