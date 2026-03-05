"""
Application Service Layer for the Launch Tracking Dashboard.
Encapsulates business logic and coordinates between repositories.
"""
from typing import List, Optional
from django.conf import settings
from .repositories import (
    ICompanyRepository, IDMRepository, ILaunchEventRepository,
    get_company_repository, get_dm_repository, get_launch_repository
)
from .models import Company, DM_Draft, LaunchEvent

# Default threshold - number of likes below which a launch is deemed "poor"
DEFAULT_POOR_ENGAGEMENT_THRESHOLD = 100

class SocialMediaMonitor:
    def __init__(self, launch_repo: ILaunchEventRepository = None, use_mocks: bool = True):
        self.launch_repo = launch_repo or get_launch_repository()
        self.use_mocks = use_mocks
        self.x_token = getattr(settings, 'X_API_BEARER_TOKEN', None)
        self.linkedin_token = getattr(settings, 'LINKEDIN_ACCESS_TOKEN', None)

    def _extract_x_id(self, url: str) -> Optional[str]:
        """Extracts Tweet ID from URL: https://x.com/user/status/12345"""
        try:
            return url.strip('/').split('/')[-1].split('?')[0]
        except Exception:
            return None

    def fetch_x_metrics(self, url: str) -> int:
        """ Fetches likes from X API v2. """
        tweet_id = self._extract_x_id(url)
        if not tweet_id:
            raise ValueError("Invalid X (Twitter) URL")

        if self.use_mocks:
            import random
            return random.randint(50, 2000)

        import requests
        headers = {"Authorization": f"Bearer {self.x_token}"}
        endpoint = f"https://api.twitter.com/2/tweets/{tweet_id}?tweet.fields=public_metrics"
        
        try:
            response = requests.get(endpoint, headers=headers)
            if response.status_code == 429:
                raise Exception("X API Rate Limit exceeded (429)")
            if response.status_code == 401:
                raise Exception("X API Authentication failed (401)")
            
            response.raise_for_status()
            data = response.json()
            return data['data']['public_metrics']['like_count']
        except requests.exceptions.RequestException as e:
            raise Exception(f"X API Connection Error: {str(e)}")

    def fetch_linkedin_metrics(self, url: str) -> int:
        """ Fetches reactions from LinkedIn Share API. """
        if self.use_mocks:
            import random
            return random.randint(20, 1500)

        # Implementation would typically involve parsing the URL for the URN 
        # and calling the postStats endpoint
        import requests
        headers = {"Authorization": f"Bearer {self.linkedin_token}"}
        # Mocking the actual request logic for LinkedIn as it requires complex URN parsing
        # and potentially Organizational Access API which varies by post type
        endpoint = "https://api.linkedin.com/v2/postStats/(post:urn%3Ali%3Ashare%3A12345)"
        
        try:
            response = requests.get(endpoint, headers=headers)
            if response.status_code == 429:
                raise Exception("LinkedIn API Rate Limit exceeded (429)")
            response.raise_for_status()
            data = response.json()
            # LinkedIn returns 'reationCount' or similar in the stats summary
            return data.get('totalReactionCount', 0)
        except requests.exceptions.RequestException as e:
            raise Exception(f"LinkedIn API Connection Error: {str(e)}")

    def sync_launch_engagement(self, launch_id: str) -> LaunchEvent:
        """ Orchestrates the metric sync for a given launch. """
        launch = self.launch_repo.get_by_id(launch_id)
        if not launch or not launch.post_url:
            return launch

        try:
            if launch.platform == 'X':
                likes = self.fetch_x_metrics(launch.post_url)
            elif launch.platform == 'LinkedIn':
                likes = self.fetch_linkedin_metrics(launch.post_url)
            else:
                return launch

            return self.launch_repo.update_metrics(launch_id, likes)
        except Exception as e:
            # In a real app, we might log this to Sentry or a Monitoring model
            print(f"Error syncing {launch.platform} metrics: {str(e)}")
            raise e

class DMService:
    def __init__(self, company_repo: ICompanyRepository = None, dm_repo: IDMRepository = None):
        self.company_repo = company_repo or get_company_repository()
        self.dm_repo = dm_repo or get_dm_repository()

    def is_poor_engagement(self, likes_count: int, threshold: int = DEFAULT_POOR_ENGAGEMENT_THRESHOLD) -> bool:
        """Returns True if the launch engagement is below the threshold."""
        return likes_count < threshold

    def generate_draft_text(self, company_name: str, platform: str) -> str:
        """
        Generates a context-aware DM draft.
        """
        platform_context = {
            "X": "X (formerly Twitter)",
            "LinkedIn": "LinkedIn",
        }
        platform_display = platform_context.get(platform, platform)

        return (
            f"Hey {company_name} team! 👋\n\n"
            f"I came across your recent launch on {platform_display} — really interesting product! "
            f"I noticed the launch didn't get as much traction as it deserved.\n\n"
            f"I specialize in helping startups grow their audience and improve their launch strategies. "
            f"I'd love to share a few ideas that could make a big difference for your next campaign.\n\n"
            f"Would you be open to a quick 15-minute call this week?\n\n"
            f"Best,\n[Your Name]"
        )

    def create_and_save_draft(self, company_id: str, platform: str) -> Optional[DM_Draft]:
        """
        Coordinates fetching the company, generating the draft, and saving it.
        """
        company = self.company_repo.get_by_id(company_id)
        if not company:
            return None
        
        draft_text = self.generate_draft_text(company.name, platform)
        return self.dm_repo.create_draft(company, platform, draft_text)

class CompanyService:
    def __init__(self, repository: ICompanyRepository = None):
        self.repository = repository or get_company_repository()

    def get_all_companies(self):
        return self.repository.get_all_with_related()

    def get_company_by_id(self, company_id: str):
        return self.repository.get_by_id(company_id)

# Providers
def get_dm_service() -> DMService:
    return DMService()

def get_company_service() -> CompanyService:
    return CompanyService()

def get_social_monitor_service() -> SocialMediaMonitor:
    return SocialMediaMonitor()
