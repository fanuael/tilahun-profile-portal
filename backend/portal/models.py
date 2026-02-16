from django.db import models


DEFAULT_RESUME_TEXT = """TILAHUN ALENE TERFIE

Addis Ababa, Ethiopia
Email: tilahunalenee@gmail.com | Phone: +251 941 883 746

PROFESSIONAL PROFILE
Strategic Innovation and Public Policy Expert with over 15 years of progressive leadership experience in education reform, national innovation systems development, startup ecosystem support, and digital government transformation. Currently serving as Senior Expert in Startup and Innovative Enterprise Development at the Ministry of Innovation and Technology, Ethiopia.

Demonstrated expertise in designing and implementing national innovation frameworks, leading multi-sector coordination initiatives, managing large-scale ICT and e-government projects, and mentoring technology-based startups. Strong academic foundation with multiple degrees in History, Economics, Management, and Public Policy Studies.

Recognized for strategic leadership, institutional capacity building, and driving systemic transformation across public institutions.

CORE COMPETENCIES
Startup Ecosystem Development
Innovation Policy and System Design
E-Government and Digital Transformation
Strategic Leadership and Team Management
Public Sector Reform
Project and Program Management
Curriculum Development and Education Reform
Stakeholder Engagement and Intergovernmental Coordination
Mentorship and Capacity Building
Problem-Solving and Analytical Thinking

PROFESSIONAL EXPERIENCE
Senior Expert - Startup and Innovative Enterprise Development
Ministry of Innovation and Technology (May 2022 - Present)
Provide structured training, mentorship, and acceleration support to technology-based startups.
Design and implement national startup support mechanisms.
Facilitate networking opportunities between startups, investors, and ecosystem actors.
Support innovation-driven enterprises in scaling sustainable business models.
Contribute to strengthening Ethiopia's national innovation ecosystem.

Project Manager - ICT and E-Government Initiatives
Ministry of Innovation and Technology (Oct 2021 - May 2022)
Led national-level ICT projects with a multidisciplinary technical team.
Managed implementation of e-government (e-service) systems.
Enabled more than 300 government institutions to provide online services.
Strengthened institutional digital service delivery frameworks.
Coordinated cross-sector stakeholders to ensure project success.

Team Leader - Councils and Regions Coordination Directorate
Ministry of Innovation and Technology (2016 - 2021)
Led a five-member core team coordinating establishment of national innovation systems across regional states.
Successfully facilitated the establishment of Science, Technology, and Innovation institutions in all regions of Ethiopia.
Delivered training, workshops, and policy advisory services to regional governments.
Engaged high-level regional leaders to institutionalize innovation governance frameworks.

Education Curriculum Coordinator
Addis Ababa Education Office (2014 - 2016)
Led coordination of local curriculum implementation across schools.
Supervised 150+ education experts, teachers, and administrators.
Collaborated with international development partners.
Launched community libraries to enhance student learning access.
Received certificates of recognition for contributions.

Teacher - History and Social Sciences
Amhara Education Bureau (2013 - 2014)
Taught primary and secondary school students.
Developed engaging instructional methods.
Contributed to curriculum enhancement initiatives.

EDUCATION
MA in Public Policy Studies - Ethiopian Civil Service University (2021)
BA in Management - Bahir Dar University (2022)
BA in Economics - Arsi University (2021)
BA in History and Heritage Management - Debre Markos University (2013)

LANGUAGES
Amharic - Fluent
English - Advanced

TECHNICAL AND ADDITIONAL SKILLS
Strategic Planning and Policy Analysis
ICT Project Oversight
Startup Mentorship and Acceleration
Public Sector Innovation Design
Basic Full-Stack Development Skills
Leadership and Institutional Capacity Building

PROFESSIONAL REFERENCES
Available upon request."""


DEFAULT_PASSION_TEXT = """I am deeply passionate about startup and innovation-driven enterprise development as a transformative force for economic growth and societal progress. My professional journey has strengthened my commitment to building ecosystems where ideas evolve into sustainable ventures and entrepreneurs are empowered to create meaningful impact.

I am particularly driven by the process of creating, designing, and innovating new solutions - not only within existing systems but by reimagining how businesses can operate, scale, and contribute to national development. I believe startups are not merely small businesses; they are engines of structural transformation.

My focus extends beyond institutional support - I am committed to mentoring emerging entrepreneurs, guiding business owners in strategic thinking, helping them refine business models, and enabling them to transition from survival-driven enterprises to innovation-driven organizations.

I aspire to contribute to the development of inclusive and sustainable innovation ecosystems where creativity, technology, and policy intersect to generate long-term value."""


class PublishableOrderedModel(models.Model):
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True


class SiteProfile(models.Model):
    name = models.CharField(max_length=150)
    title = models.CharField(max_length=180)
    location = models.CharField(max_length=150, blank=True)
    email = models.EmailField(max_length=200, blank=True)
    phone = models.CharField(max_length=60, blank=True)
    nationality = models.CharField(max_length=80, blank=True)
    current_focus = models.CharField(max_length=255, blank=True)
    summary = models.TextField(blank=True)
    resume_text = models.TextField(
        blank=True,
        default=DEFAULT_RESUME_TEXT,
        help_text="Editable resume content shown on the Resume page.",
    )
    passion_text = models.TextField(
        blank=True,
        default=DEFAULT_PASSION_TEXT,
        help_text="Editable passion content shown on the Passion page.",
    )
    collaboration_blurb = models.TextField(
        blank=True,
        help_text="Displayed on the contact page.",
    )
    hero_image = models.ImageField(
        upload_to="profile/images/",
        blank=True,
        null=True,
    )
    cv_document = models.FileField(
        upload_to="profile/documents/",
        blank=True,
        null=True,
        help_text="Upload CV or profile document.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class ResumeContent(models.Model):
    title = models.CharField(max_length=160, default="Resume", blank=True)
    content = models.TextField(blank=True, default=DEFAULT_RESUME_TEXT)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Resume"
        verbose_name_plural = "Resume"

    def __str__(self) -> str:
        return self.title or "Resume"


class PassionContent(models.Model):
    title = models.CharField(max_length=160, default="Passion", blank=True)
    content = models.TextField(blank=True, default=DEFAULT_PASSION_TEXT)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Passion"
        verbose_name_plural = "Passion"

    def __str__(self) -> str:
        return self.title or "Passion"


class BlogItem(PublishableOrderedModel):
    CATEGORY_NEWS = "news"
    CATEGORY_ARTICLES = "articles"
    CATEGORY_INSIGHTS = "insights"
    CATEGORY_CHOICES = (
        (CATEGORY_NEWS, "News"),
        (CATEGORY_ARTICLES, "Articles"),
        (CATEGORY_INSIGHTS, "Insights"),
    )

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=220)
    summary = models.TextField(blank=True)
    content = models.TextField(blank=True)
    external_url = models.URLField(blank=True)
    published_on = models.DateField(blank=True, null=True)

    class Meta:
        ordering = ["category", "sort_order", "-id"]
        verbose_name = "Blog"
        verbose_name_plural = "Blogs"

    def __str__(self) -> str:
        return self.title


class NewsItemManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(category=BlogItem.CATEGORY_NEWS)


class ArticleItemManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(category=BlogItem.CATEGORY_ARTICLES)


class InsightItemManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(category=BlogItem.CATEGORY_INSIGHTS)


class NewsItem(BlogItem):
    objects = NewsItemManager()

    class Meta:
        proxy = True
        verbose_name = "News"
        verbose_name_plural = "News"


class ArticleItem(BlogItem):
    objects = ArticleItemManager()

    class Meta:
        proxy = True
        verbose_name = "Article"
        verbose_name_plural = "Articles"


class InsightItem(BlogItem):
    objects = InsightItemManager()

    class Meta:
        proxy = True
        verbose_name = "Insight"
        verbose_name_plural = "Insights"


class HighlightStat(PublishableOrderedModel):
    label = models.CharField(max_length=80)
    value = models.CharField(max_length=180)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.label


class StoryItem(PublishableOrderedModel):
    year = models.CharField(max_length=40)
    title = models.CharField(max_length=200)
    detail = models.TextField()

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.year} - {self.title}"


class ExperienceItem(PublishableOrderedModel):
    role = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    period = models.CharField(max_length=120)
    location = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.role} ({self.period})"


class EducationItem(PublishableOrderedModel):
    degree = models.CharField(max_length=100)
    field = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    year = models.CharField(max_length=32, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.degree} - {self.field}"


class ProgramItem(PublishableOrderedModel):
    title = models.CharField(max_length=255)
    organization = models.CharField(max_length=200, blank=True)
    period = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.title


class SkillItem(PublishableOrderedModel):
    CATEGORY_CORE = "core"
    CATEGORY_TECHNICAL = "technical"
    CATEGORY_LANGUAGE = "language"
    CATEGORY_INTEREST = "interest"

    CATEGORY_CHOICES = (
        (CATEGORY_CORE, "Core Competency"),
        (CATEGORY_TECHNICAL, "Technical Skill"),
        (CATEGORY_LANGUAGE, "Language"),
        (CATEGORY_INTEREST, "Professional Interest"),
    )

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    label = models.CharField(max_length=160)

    class Meta:
        ordering = ["category", "sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.get_category_display()}: {self.label}"


class PublicationItem(PublishableOrderedModel):
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=32, blank=True)
    item_type = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=80, blank=True)
    summary = models.TextField(blank=True)
    external_url = models.URLField(blank=True)
    document = models.FileField(upload_to="publications/documents/", blank=True, null=True)
    cover_image = models.ImageField(upload_to="publications/images/", blank=True, null=True)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name = "Research and Publication"
        verbose_name_plural = "Research and Publications"

    def __str__(self) -> str:
        return self.title


class IdeaItem(PublishableOrderedModel):
    title = models.CharField(max_length=255)
    stage = models.CharField(max_length=80, blank=True)
    summary = models.TextField(blank=True)
    impact = models.TextField(blank=True)
    external_url = models.URLField(blank=True)
    document = models.FileField(upload_to="ideas/documents/", blank=True, null=True)
    cover_image = models.ImageField(upload_to="ideas/images/", blank=True, null=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.title


class MediaAsset(PublishableOrderedModel):
    TYPE_IMAGE = "image"
    TYPE_DOCUMENT = "document"
    TYPE_CHOICES = (
        (TYPE_IMAGE, "Image"),
        (TYPE_DOCUMENT, "Document"),
    )

    SECTION_GENERAL = "general"
    SECTION_HOME = "home"
    SECTION_STORY = "story"
    SECTION_WORK = "work"
    SECTION_RESEARCH = "research"
    SECTION_LIBRARY = "library"
    SECTION_CHOICES = (
        (SECTION_GENERAL, "General"),
        (SECTION_HOME, "Home"),
        (SECTION_STORY, "Story"),
        (SECTION_WORK, "Work"),
        (SECTION_RESEARCH, "Research"),
        (SECTION_LIBRARY, "Library"),
    )

    title = models.CharField(max_length=200)
    caption = models.TextField(blank=True)
    asset_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    section = models.CharField(
        max_length=20,
        choices=SECTION_CHOICES,
        default=SECTION_GENERAL,
    )
    file = models.FileField(upload_to="assets/")

    class Meta:
        ordering = ["section", "sort_order", "id"]

    def __str__(self) -> str:
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=200, blank=True, null=True)
    subject = models.CharField(max_length=140, blank=True, null=True)
    message = models.TextField(max_length=2000, blank=True, null=True)
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-received_at"]

    def __str__(self) -> str:
        return f"{self.name or ''} - {self.subject or ''}".strip(" -")
