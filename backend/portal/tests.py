import json

from django.test import Client, TestCase

from .models import (
    BlogItem,
    ContactMessage,
    ExperienceItem,
    PassionContent,
    ResumeContent,
    SiteProfile,
    StoryItem,
)


class PortalApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        SiteProfile.objects.create(
            name="Tilahun Alene Terfie",
            title="Innovation and Sustainable Business Professional",
            location="Addis Ababa, Ethiopia",
            email="tilahunalenee@gmail.com",
            phone="+251 941 883 746",
            nationality="Ethiopian",
            current_focus="MBA in Sustainable International Business and Foreign Trade",
            summary="Profile summary",
        )
        ResumeContent.objects.create(title="Resume", content="Resume body")
        PassionContent.objects.create(title="Passion", content="Passion body")
        BlogItem.objects.create(
            category=BlogItem.CATEGORY_NEWS,
            title="News title",
            summary="News summary",
            sort_order=1,
            is_published=True,
        )
        story = StoryItem.objects.create(
            year="2024",
            title="Story title",
            detail="Story detail",
            sort_order=1,
        )
        experience = ExperienceItem.objects.create(
            role="Project Manager",
            organization="Ministry of Innovation and Technology",
            period="2021 - Present",
            sort_order=1,
        )
        self.story_id = story.id

    def test_content_endpoint_returns_profile_data(self):
        response = self.client.get("/api/content")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["profile"]["name"], "Tilahun Alene Terfie")
        self.assertIn("resume_text", payload)
        self.assertIn("passion_text", payload)
        self.assertEqual(payload["resume_text"], "Resume body")
        self.assertEqual(payload["passion_text"], "Passion body")
        self.assertEqual(payload["resume"]["title"], "Resume")
        self.assertEqual(payload["passion"]["title"], "Passion")
        self.assertEqual(len(payload["blogs"]["news"]), 1)
        self.assertEqual(len(payload["story"]), 1)
        self.assertEqual(payload["story"][0]["title"], "Story title")
        self.assertEqual(len(payload["experience"]), 1)
        self.assertNotIn("highlights", payload["experience"][0])

    def test_contact_endpoint_persists_message(self):
        response = self.client.post(
            "/api/contact",
            data=json.dumps(
                {
                    "name": "Portal User",
                    "email": "portal@example.com",
                    "subject": "Collaboration",
                    "message": "I would like to discuss a collaboration opportunity.",
                }
            ),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "received")
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_contact_endpoint_accepts_partial_submission(self):
        response = self.client.post(
            "/api/contact",
            data=json.dumps({"message": "Hello"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "received")
        saved = ContactMessage.objects.latest("id")
        self.assertEqual(saved.message, "Hello")
        self.assertEqual(saved.name, "")
        self.assertEqual(saved.email, "")
        self.assertEqual(saved.subject, "")

    def test_contact_endpoint_accepts_empty_submission(self):
        response = self.client.post(
            "/api/contact",
            data=json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "received")
        saved = ContactMessage.objects.latest("id")
        self.assertEqual(saved.name, "")
        self.assertEqual(saved.email, "")
        self.assertEqual(saved.subject, "")
        self.assertEqual(saved.message, "")
