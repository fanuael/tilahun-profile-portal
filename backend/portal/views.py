from __future__ import annotations

import json

from django.db import DatabaseError
from django.http import HttpRequest, JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods
# No external AI provider usage — assistant runs locally.

from .models import (
    BlogItem,
    CertificateItem,
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
    certificate_items = CertificateItem.objects.filter(is_published=True)
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
        "certificates": [
            {
                "id": item.id,
                "title": item.title,
                "issuer": item.issuer,
                "issued_on": item.issued_on,
                "expires_on": item.expires_on,
                "section": item.section,
                "summary": item.summary,
                "document_url": file_url(request, item.document),
                "image_url": file_url(request, item.certificate_image),
            }
            for item in certificate_items
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


def _build_local_assistant_reply(request: HttpRequest, message: str, page: str = "", url: str = "", structured: bool = False):
    """Build intelligent context-aware responses based on page and message content."""
    lower_message = message.lower().strip()
    page_lower = page.lower() if page else ""
    
    try:
        content = load_content(request)
    except DatabaseError:
        content = {}

    profile = content.get("profile", {}) if isinstance(content, dict) else {}
    summary = content.get("summary", "") if isinstance(content, dict) else ""
    name = profile.get("name", "Tilahun") if isinstance(profile, dict) else "Tilahun"
    title = profile.get("title", "") if isinstance(profile, dict) else ""
    location = profile.get("location", "") if isinstance(profile, dict) else ""
    focus = profile.get("current_focus", "") if isinstance(profile, dict) else ""
    email = profile.get("email", "") if isinstance(profile, dict) else ""
    phone = profile.get("phone", "") if isinstance(profile, dict) else ""
    
    # Page-specific question patterns
    page_questions = ["what's on", "what is on", "what can i find", "tell me about this", "what does", "about this page"]
    is_page_question = any(pq in lower_message for pq in page_questions)
    
    # Page descriptions
    page_descriptions = {
        "home": "The Home page provides an overview of Tilahun's professional profile, including key highlights, skills across different categories (core, technical, languages, and interests), academic credentials, and leadership experience.",
        "story": "The Story page presents Tilahun's professional journey chronologically, from his early career as a teacher through various roles in education, innovation, and startup ecosystem development.",
        "experience": "The Experience page details Tilahun's professional roles, including positions at education offices, the Ministry of Innovation and Technology, and current work in startup ecosystem development with descriptions of responsibilities and impact.",
        "education": "The Education page showcases academic credentials including an ongoing MBA in Sustainable International Business, a Master's degree in Public Policy Studies, and Bachelor's degrees in Management, Economics, and History.",
        "skills": "The Skills page on the home view breaks down expertise into four categories: Core Competencies (innovation ecosystem development, strategic planning), Technical Skills (Python, Django, React), Languages (Amharic, English), and Interests (sustainable entrepreneurship, technology reform).",
        "resume": "The Resume page contains Tilahun's comprehensive professional resume highlighting career progression, achievements, and current focus on sustainable business and international trade.",
        "passion": "The Passion page shares Tilahun's personal passions and focus areas, including commitment to sustainable entrepreneurship, innovation-driven economic transformation, and technology-enabled public sector reform.",
        "articles": "The Articles page displays blog articles from the portfolio, providing insights and perspectives on topics like innovation policy coordination in regional contexts.",
        "insights": "The Insights page features key insights on topics such as combining policy mechanisms with practical founder mentorship in startup ecosystems.",
        "ideas": "The Ideas page showcases innovative project concepts at various stages, including the Green Export Acceleration Hub, Innovation Policy Observatory, and Startup Readiness Fellowship.",
        "work": "The Work page displays recent news and updates about professional activities and achievements in the startup and innovation ecosystem.",
        "research": "The Research & Publications page showcases research works and publications including in-progress articles on sustainable entrepreneurship and innovation governance.",
        "certificates": "The Certificates page lists professional certifications and credentials including training in quality management, project preparation, and innovation leadership.",
        "contact": "The Contact page provides direct contact information and a message form to reach out for collaborations, consulting, or other inquiries.",
    }
    
    # Answer "what's on this page" questions
    if is_page_question and page_lower:
        page_key = page_lower.lower().replace(" & ", " and ").split()[0]
        page_desc = page_descriptions.get(page_key)
        if page_desc:
            return f"On the {page} page: {page_desc}"
    
    # Navigation and site structure questions
    if any(kw in lower_message for kw in ["how do i navigate", "how to navigate", "site structure", "what pages", "navigation"]):
        return (
            "This portfolio has several main sections accessible from the navigation menu: "
            "Home (overview), Experience, Education, Skills, Resume, Passion, Work (news), "
            "Research & Publications, Articles, Insights, Ideas, Certificates, and Contact. "
            "Each page can be accessed from the top navigation bar or dropdowns."
        )
    
    # Questions about specific topics
    topic_responses = {
        "contact": f"To get in touch with {name}, you can: Email: {email}, Phone: {phone}, or use the Contact form. The contact page also has additional partnership and collaboration details.",
        "experience": f"{name} has 15+ years of professional experience in public sector innovation, startup ecosystem development, education reform, and strategic leadership. His work spans national programs across Ethiopia and includes institutional coordination and policy implementation.",
        "education": f"{name}'s education includes a Master's in Public Policy Studies from the Ethiopian Civil Service University, Bachelor's degrees in Management, Economics, and History from various universities, plus an ongoing MBA in Sustainable International Business.",
        "skills": f"{name} has expertise in innovation ecosystem development, startup support, sustainable business strategy, and technical skills including Python, Django, and React. He's fluent in Amharic and English.",
        "publications": "Tilahun's publications work includes research on innovation and sustainable entrepreneurship in emerging economies, and regional innovation governance models in Ethiopia.",
        "ideas": "Tilahun is developing several innovative ideas including the Green Export Acceleration Hub for sustainable SMEs, an Innovation Policy Observatory for data-driven policy, and a Startup Readiness Fellowship for early-stage founders.",
        "background": f"{name} is {title}, based in {location}. {summary}",
    }
    
    for topic, response in topic_responses.items():
        if topic in lower_message:
            return response
    
    # Personal identification
    if any(token in lower_message for token in ["who is", "who's", "tell me about", "introduce yourself", "your name"]):
        intro = f"I'm representing {name}, a {title}"
        if location:
            intro += f" based in {location}"
        if focus:
            intro += f". Currently, {focus.lower()}"
        intro += "."
        if summary:
            intro += f" {summary}"
        return intro
    
    # Website issues and technical questions
    if any(kw in lower_message for kw in ["not working", "error", "bug", "issue", "problem", "broken", "not loading", "can't access"]):
        if any(word in lower_message for word in ["page", "content", "data", "load", "display"]):
            return (
                "If you're experiencing issues with page content not loading, try: "
                "1) Refresh the page (Ctrl+R or Cmd+R), "
                "2) Clear your browser cache, "
                "3) Try a different browser. "
                "If the problem persists, contact Tilahun directly at " + (email or "the contact form") + ". "
                "Backend content may take a moment to load on first visit."
            )
        if any(word in lower_message for word in ["contact", "form", "message", "submit"]):
            return (
                "For contact form issues: Make sure all required fields are filled, "
                "check your internet connection, and try submitting again. "
                "If it still fails, try using the direct email or phone contact methods instead."
            )
        return (
            "Please describe the specific issue you're experiencing. "
            "Common solutions: refresh the page, clear cache, or contact Tilahun directly. "
            "If you're seeing a specific error, please share the error message."
        )
    
    # Collaboration and partnership questions
    if any(kw in lower_message for kw in ["collaborate", "partnership", "project", "consulting", "work together", "hire"]):
        return (
            f"{name} is open to collaborations in innovation policy, sustainable entrepreneurship, "
            "and international business. Contact him through the Contact page or reach out directly at " 
            + (email or "the contact form") + " to discuss opportunities."
        )
    
    # General help
    if any(kw in lower_message for kw in ["help", "how to", "can you help", "what can you do"]):
        return (
            f"I can help you navigate and understand this portfolio! I can answer questions about "
            f"{name}'s professional background, experience, skills, projects, and ideas. "
            "I can also help you find contact information or discuss potential collaborations. "
            "Try asking 'Tell me about this page' or 'How do I contact you?'"
        )
    
    # Advanced site analysis and review
    analysis_keywords = ["analyze", "analysis", "review", "audit", "evaluate", "recommend"]
    if any(k in lower_message for k in analysis_keywords):
        # Build a concise site-wide analysis using loaded content
        skills = content.get("competencies", []) or []
        technical = content.get("technical", []) or []
        pubs = content.get("publications", []) or []
        ideas = content.get("ideas", []) or []
        stats = content.get("stats", []) or []

        strengths = []
        if skills or technical:
            strengths.append(f"Clear skills and technical stack: {', '.join((skills[:5] + technical[:5]))}.")
        if pubs:
            strengths.append(f"Research and publications are present ({len(pubs)} items).")
        if ideas:
            strengths.append(f"Innovative project ideas are described ({len(ideas)} concepts).")
        if stats:
            strengths.append(f"Key highlights and metrics are showcased: {', '.join([s.get('label')+':'+str(s.get('value')) for s in stats[:4]])}.")

        gaps = []
        if not skills and not technical:
            gaps.append("Skills section could be more detailed or categorized.")
        if not pubs:
            gaps.append("Consider adding more publication summaries or links to strengthen research credibility.")
        if not ideas:
            gaps.append("Idea pages could include clearer next-steps or calls-to-action for collaborators.")

        recommendations = []
        recommendations.append("Add short executive summaries on each major page to help readers scan content quickly.")
        recommendations.append("Expose downloadable artifacts (papers, CV, project briefs) for credibility and follow-up.")
        recommendations.append("Add structured metadata (tags, dates, and statuses) to improve discoverability and allow the assistant to reference exact items.")

        page_notes = []
        for p, desc in page_descriptions.items():
            page_notes.append(f"{p.title()}: {desc.split('.')[0]}")

        # Structured payload for programmatic consumption
        analysis_payload = {
            "site": name if name else "profile",
            "strengths": strengths,
            "gaps": gaps,
            "recommendations": recommendations,
            "pages": page_notes,
        }
        if structured:
            return analysis_payload

        analysis_parts = [
            f"Site analysis for {name if name else 'the profile'}:",
            "Strengths:\n" + ("\n".join(["- " + s for s in strengths]) if strengths else "- No major strengths detected."),
            "Opportunities / Gaps:\n" + ("\n".join(["- " + g for g in gaps]) if gaps else "- No obvious gaps detected."),
            "Recommendations:\n" + ("\n".join(["- " + r for r in recommendations])),
            "Per-page summary (short):\n" + ("\n".join(["- " + n for n in page_notes[:8]])),
        ]

        return "\n\n".join(analysis_parts)

    # Default helpful response
    return (
        f"I'm here to help you learn about {name}'s portfolio and professional work. "
        f"I can discuss {name}'s experience, skills, projects, education, and ideas. "
        "Feel free to ask questions like 'What's on this page?', 'Tell me about the experience section', "
        "or 'How can I contact you?' I'm available to answer most questions about this portfolio."
    )
    


def _build_assistant_response(
    request: HttpRequest,
    message: str,
    reply: str,
    provider_error: str | None = None,
    provider_status: int | None = None,
) -> JsonResponse:
    payload = {"reply": reply}
    if provider_error:
        payload["ai_provider_error"] = provider_error
    if provider_status is not None:
        payload["ai_provider_status"] = provider_status
    return JsonResponse(payload, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def assistant(request: HttpRequest) -> JsonResponse:
    """Lightweight assistant endpoint with page context awareness.

    Expects JSON payload: { "message": "...", "page": "...", "url": "..." }

    If `OPENAI_API_KEY` is set in the environment, this will proxy the message
    to OpenAI's Chat Completions API and return the reply. If not configured,
    or if the provider returns an error, returns a local fallback message.
    """
    raw_body = request.body.decode("utf-8", errors="ignore").strip()
    payload = {}

    if raw_body:
        try:
            payload = json.loads(raw_body)
        except json.JSONDecodeError:
            return JsonResponse({"detail": "Invalid JSON payload"}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"detail": "JSON object payload is required"}, status=400)

    message = str(payload.get("message", "")).strip()
    page = str(payload.get("page", "")).strip()
    url = str(payload.get("url", "")).strip()
    
    if not message:
        return JsonResponse({"detail": "Message is required"}, status=400)

    # Use only the local, rule-based assistant implementation.
    structured = bool(payload.get("structured", False))
    reply = _build_local_assistant_reply(request, message, page, url, structured=structured)
    # If the assistant returned a structured payload, return it directly
    if isinstance(reply, dict):
        return JsonResponse(reply, status=200)
    return JsonResponse({"reply": reply}, status=200)
