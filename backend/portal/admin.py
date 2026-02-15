from django.contrib import admin

from .models import (
    ContactMessage,
    EducationItem,
    ExperienceHighlight,
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


@admin.register(SiteProfile)
class SiteProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "title", "email", "phone", "updated_at")
    fieldsets = (
        (
            "Identity",
            {
                "fields": (
                    "name",
                    "title",
                    "summary",
                    "current_focus",
                    "collaboration_blurb",
                )
            },
        ),
        (
            "Contact",
            {"fields": ("location", "email", "phone", "nationality")},
        ),
        (
            "Media",
            {"fields": ("hero_image", "cv_document")},
        ),
    )


@admin.register(HighlightStat)
class HighlightStatAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "sort_order", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("label", "value")


@admin.register(StoryItem)
class StoryItemAdmin(admin.ModelAdmin):
    list_display = ("year", "title", "sort_order", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("year", "title", "detail")


class ExperienceHighlightInline(admin.TabularInline):
    model = ExperienceHighlight
    extra = 1
    fields = ("text", "sort_order")


@admin.register(ExperienceItem)
class ExperienceItemAdmin(admin.ModelAdmin):
    list_display = ("role", "organization", "period", "sort_order", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("role", "organization", "period", "description")
    inlines = [ExperienceHighlightInline]


@admin.register(EducationItem)
class EducationItemAdmin(admin.ModelAdmin):
    list_display = ("degree", "field", "institution", "year", "sort_order", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("degree", "field", "institution", "year")


@admin.register(ProgramItem)
class ProgramItemAdmin(admin.ModelAdmin):
    list_display = ("title", "organization", "period", "sort_order", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("title", "organization", "period")


@admin.register(SkillItem)
class SkillItemAdmin(admin.ModelAdmin):
    list_display = ("label", "category", "sort_order", "is_published")
    list_filter = ("category", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("label",)


@admin.register(PublicationItem)
class PublicationItemAdmin(admin.ModelAdmin):
    list_display = ("title", "year", "item_type", "status", "sort_order", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("title", "summary", "year", "item_type", "status")


@admin.register(IdeaItem)
class IdeaItemAdmin(admin.ModelAdmin):
    list_display = ("title", "stage", "sort_order", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("title", "stage", "summary", "impact")


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("title", "asset_type", "section", "sort_order", "is_published")
    list_filter = ("asset_type", "section", "is_published")
    list_editable = ("sort_order", "is_published")
    search_fields = ("title", "caption")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "received_at")
    search_fields = ("name", "email", "subject")
    readonly_fields = ("name", "email", "subject", "message", "received_at")
