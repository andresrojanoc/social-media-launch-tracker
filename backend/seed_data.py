#!/usr/bin/env python
"""
Seed script to populate the database with sample data for testing.
Run from repo root: backend\\venv\\Scripts\\python.exe backend\\seed_data.py --count 10
"""
import os
import django
import random
import argparse

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
django.setup()

from api.models import Company, LaunchEvent, ContactInfo

# Predefined data for random generation
NAMES = ["Acme", "Nova", "Bright", "Zenith", "Quantum", "Apex", "Flux", "Nexus", "Nebula", "Solar"]
EXTS = ["Systems", "AI", "Corp", "Spark", "Labs", "Dynamics", "Link", "Sync", "Flow", "Growth"]
DESC_TEMPLATES = [
    "A leading provider of {industry} solutions for the modern enterprise.",
    "Innovating the {industry} space with cutting-edge technology and human-centric design.",
    "Empowering developers to build the next generation of {industry} tools.",
    "The all-in-one platform for {industry} management and scaling.",
    "Revolutionizing {industry} with automated workflows and AI-driven insights."
]
INDUSTRIES = ["SaaS", "FinTech", "HealthTech", "Analytics", "Automation", "E-commerce", "Cybersecurity"]

def seed_data(count):
    print(f"Seeding {count} sample companies...")

    # Clear existing data
    try:
        from api.models import DM_Draft
        DM_Draft.objects.all().delete()
    except Exception:
        pass
    ContactInfo.objects.all().delete()
    LaunchEvent.objects.all().delete()
    Company.objects.all().delete()

    platforms = ["X", "LinkedIn", "Crunchbase"]
    statuses = ["Good", "Poor"]

    for i in range(count):
        name = f"{random.choice(NAMES)} {random.choice(EXTS)}"
        # Add index to name if duplicates occur frequently across large seeds
        if count > 20:
             name = f"{name} {i+1}"
        
        raised = random.choice([500000, 1000000, 5000000, 10000000, None])
        industry = random.choice(INDUSTRIES)
        description = random.choice(DESC_TEMPLATES).format(industry=industry)
        slug = name.lower().replace(" ", "")
        
        c = Company.objects.create(
            name=name,
            amount_raised=raised,
            description=description,
            thumbnail_url=f"https://picsum.photos/seed/{slug}/200"
        )
        
        # Create 1-3 launch events
        num_launches = random.randint(1, 3)
        for _ in range(num_launches):
            platform = random.choice(platforms)
            likes = random.randint(0, 5000)
            status = "Good" if likes > 100 else "Poor" # Simple threshold for seed
            
            LaunchEvent.objects.create(
                company=c,
                platform=platform,
                likes_count=likes,
                engagement_status=status,
                video_url=f"https://{platform.lower()}.com/status/{random.randint(1000, 9999)}" if platform != "Crunchbase" else None
            )
            
        # Create contact info
        ContactInfo.objects.create(
            company=c,
            email=f"contact@{slug}.io",
            phone_number=f"+1-555-{random.randint(1000, 9999)}",
            linkedin_handle=slug,
            x_handle=slug
        )

    print(f"[OK] Seeded {Company.objects.count()} companies, {LaunchEvent.objects.count()} launch events, {ContactInfo.objects.count()} contact records.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the database with sample data.")
    parser.add_argument(
        "--count", "-c", 
        type=int, 
        default=5, 
        help="Number of company entries to create (default: 5)"
    )
    args = parser.parse_args()
    
    seed_data(args.count)
