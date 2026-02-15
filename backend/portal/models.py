from django.db import models


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


class ExperienceHighlight(models.Model):
    experience = models.ForeignKey(
        ExperienceItem,
        on_delete=models.CASCADE,
        related_name="highlights",
    )
    text = models.CharField(max_length=255)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.text


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
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=200)
    subject = models.CharField(max_length=140)
    message = models.TextField(max_length=2000)
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-received_at"]

    def __str__(self) -> str:
        return f"{self.name} - {self.subject}"
