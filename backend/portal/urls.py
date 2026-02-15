from django.urls import path

from . import views

urlpatterns = [
    path("", views.root, name="root"),
    path("api/health", views.health, name="health"),
    path("api/content", views.content, name="content"),
    path("api/story", views.story, name="story"),
    path("api/publications", views.publications, name="publications"),
    path("api/ideas", views.ideas, name="ideas"),
    path("api/media", views.media, name="media"),
    path("api/contact", views.contact, name="contact"),
]
