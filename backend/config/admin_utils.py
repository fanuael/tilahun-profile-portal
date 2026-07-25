import os


def enforce_admin_credentials() -> None:
    """Ensure the deployed admin account uses the requested credentials."""
    if os.environ.get("DJANGO_ENFORCE_ADMIN", "1") != "1":
        return

    admin_username = os.environ.get("DJANGO_ADMIN_USERNAME", "Tilahun")
    admin_password = os.environ.get("DJANGO_ADMIN_PASSWORD", "fanu@763323@#")
    admin_email = os.environ.get("DJANGO_ADMIN_EMAIL", "admin@example.com")
    old_username = os.environ.get("DJANGO_OLD_ADMIN_USERNAME", "admin")

    try:
        import django

        django.setup()

        from django.contrib.auth import get_user_model

        User = get_user_model()
        user = User.objects.filter(username=admin_username).first()

        if not user:
            user = User.objects.filter(username=old_username).first()
            if user:
                user.username = admin_username
            else:
                user = User.objects.create_superuser(
                    admin_username,
                    admin_email,
                    admin_password,
                )

        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.email = admin_email

        if not user.check_password(admin_password):
            user.set_password(admin_password)

        user.save()

        if old_username and old_username != admin_username:
            User.objects.filter(username=old_username).exclude(pk=user.pk).delete()
    except Exception:
        pass
