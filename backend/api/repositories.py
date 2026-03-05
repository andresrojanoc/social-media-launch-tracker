from abc import ABC, abstractmethod
from typing import List, Optional
from django.db.models import QuerySet
from .models import Company, DM_Draft

class ICompanyRepository(ABC):
    @abstractmethod
    def get_all_with_related(self) -> QuerySet:
        pass

    @abstractmethod
    def get_by_id(self, company_id: str) -> Optional[Company]:
        pass

class IDMRepository(ABC):
    @abstractmethod
    def create_draft(self, company: Company, platform: str, text: str) -> DM_Draft:
        pass

class DjangoCompanyRepository(ICompanyRepository):
    def get_all_with_related(self) -> QuerySet:
        return Company.objects.prefetch_related(
            'launches', 'contact_info', 'dm_drafts'
        ).all()

    def get_by_id(self, company_id: str) -> Optional[Company]:
        try:
            return Company.objects.prefetch_related(
                'launches', 'contact_info', 'dm_drafts'
            ).get(pk=company_id)
        except Company.DoesNotExist:
            return None

class DjangoDMRepository(IDMRepository):
    def create_draft(self, company: Company, platform: str, text: str) -> DM_Draft:
        return DM_Draft.objects.create(
            company=company,
            target_platform=platform,
            draft_text=text
        )

# Dependency Providers
def get_company_repository() -> ICompanyRepository:
    """Returns the active implementation of ICompanyRepository."""
    return DjangoCompanyRepository()

def get_dm_repository() -> IDMRepository:
    """Returns the active implementation of IDMRepository."""
    return DjangoDMRepository()
