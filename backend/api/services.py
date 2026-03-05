"""
Application Service Layer for the Launch Tracking Dashboard.
Encapsulates business logic and coordinates between repositories.
"""
from typing import List, Optional
from .repositories import ICompanyRepository, IDMRepository, get_company_repository, get_dm_repository
from .models import Company, DM_Draft

# Default threshold - number of likes below which a launch is deemed "poor"
DEFAULT_POOR_ENGAGEMENT_THRESHOLD = 100

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
