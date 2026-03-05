#!/usr/bin/env python
"""
Seed script to populate the database with sample data for testing.
Run from repo root: backend\venv\Scripts\python.exe backend\seed_data.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
django.setup()

from api.models import Company, LaunchEvent, ContactInfo

print("Seeding sample data...")

# Clear existing data
DM_Draft = None
try:
    from api.models import DM_Draft
    DM_Draft.objects.all().delete()
except Exception:
    pass
ContactInfo.objects.all().delete()
LaunchEvent.objects.all().delete()
Company.objects.all().delete()

# Company 1 - Poor launch
c1 = Company.objects.create(
    name="Acme Corp",
    amount_raised=500000,
    description="B2B SaaS tool that automates sales workflows for SMBs.",
    thumbnail_url="https://picsum.photos/seed/acme/200"
)
LaunchEvent.objects.create(company=c1, platform="X", likes_count=42, engagement_status="Poor", video_url="https://x.com/example/status/123")
LaunchEvent.objects.create(company=c1, platform="LinkedIn", likes_count=15, engagement_status="Poor")
ContactInfo.objects.create(company=c1, email="hello@acmecorp.com", phone_number="+1-555-0101", linkedin_handle="acmecorp", x_handle="acmecorp")

# Company 2 - Good launch
c2 = Company.objects.create(
    name="Bright AI",
    amount_raised=5000000,
    description="AI-powered analytics platform helping enterprises make faster decisions.",
    thumbnail_url="https://picsum.photos/seed/brightai/200"
)
LaunchEvent.objects.create(company=c2, platform="X", likes_count=3200, engagement_status="Good", video_url="https://x.com/example/status/456")
LaunchEvent.objects.create(company=c2, platform="LinkedIn", likes_count=890, engagement_status="Good")
ContactInfo.objects.create(company=c2, email="team@brightai.io", linkedin_handle="brightai", x_handle="brightai_hq")

# Company 3 - Mixed
c3 = Company.objects.create(
    name="NovaSpark",
    amount_raised=None,
    description="Early-stage startup building a no-code automation tool for marketers.",
    thumbnail_url="https://picsum.photos/seed/novaspark/200"
)
LaunchEvent.objects.create(company=c3, platform="X", likes_count=75, engagement_status="Poor")
LaunchEvent.objects.create(company=c3, platform="Crunchbase", likes_count=0, engagement_status="Poor")
ContactInfo.objects.create(company=c3, linkedin_handle="novaspark_co")

print(f"[OK] Seeded {Company.objects.count()} companies, {LaunchEvent.objects.count()} launch events, {ContactInfo.objects.count()} contact records.")
