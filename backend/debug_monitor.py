import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.services import get_social_monitor_service
from api.models import LaunchEvent, Company

def test_monitor():
    monitor = get_social_monitor_service()
    
    # Create a dummy company and launch for testing if none exist
    company, _ = Company.objects.get_or_create(name="Test Monitor Corp")
    x_launch, _ = LaunchEvent.objects.get_or_create(
        company=company, 
        platform='X',
        defaults={'post_url': 'https://x.com/getcaptionsapp/status/1929554635544461727'}
    )
    li_launch, _ = LaunchEvent.objects.get_or_create(
        company=company, 
        platform='LinkedIn',
        defaults={'post_url': 'https://www.linkedin.com/posts/test_post_123'}
    )

    print(f"--- Testing Sync for {company.name} ---")
    
    try:
        print(f"Syncing X metrics for: {x_launch.post_url}")
        updated_x = monitor.sync_launch_engagement(x_launch.id)
        print(f"SUCCESS: X Likes = {updated_x.likes_count} (Last update: {updated_x.last_monitored_at})")
    except Exception as e:
        print(f"FAILED X: {e}")

    try:
        print(f"\nSyncing LinkedIn metrics for: {li_launch.post_url}")
        updated_li = monitor.sync_launch_engagement(li_launch.id)
        print(f"SUCCESS: LinkedIn Reactions = {updated_li.likes_count} (Last update: {updated_li.last_monitored_at})")
    except Exception as e:
        print(f"FAILED LinkedIn: {e}")

if __name__ == "__main__":
    test_monitor()
