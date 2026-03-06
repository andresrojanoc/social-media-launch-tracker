from abc import ABC, abstractmethod
from typing import List, Optional
from django.db.models import QuerySet
from .models import Company, DM_Draft, LaunchEvent

class ICompanyRepository(ABC):
    @abstractmethod
    def get_all_with_related(self) -> QuerySet:
        pass

    @abstractmethod
    def get_by_id(self, company_id: str) -> Optional[Company]:
        pass

    @abstractmethod
    def delete_company(self, company_id: str) -> bool:
        pass

    @abstractmethod
    def create_company(self, name: str, description: str = None, amount_raised: float = None, logo_url: str = None) -> Company:
        pass

class IDMRepository(ABC):
    @abstractmethod
    def create_draft(self, company: Company, platform: str, text: str) -> DM_Draft:
        pass

class ILaunchEventRepository(ABC):
    @abstractmethod
    def get_by_id(self, launch_id: str) -> Optional[LaunchEvent]:
        pass

    @abstractmethod
    def update_metrics(self, launch_id: str, likes: int) -> LaunchEvent:
        pass

    @abstractmethod
    def create_launch(self, company: Company, platform: str, post_url: str, likes_count: int) -> LaunchEvent:
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

    def delete_company(self, company_id: str) -> bool:
        try:
            company = Company.objects.get(pk=company_id)
            company.delete()
            return True
        except Company.DoesNotExist:
            return False

    def create_company(self, name: str, description: str = None, amount_raised: float = None, logo_url: str = None) -> Company:
        return Company.objects.create(
            name=name,
            description=description,
            amount_raised=amount_raised,
            thumbnail_url=logo_url
        )

class DjangoDMRepository(IDMRepository):
    def create_draft(self, company: Company, platform: str, text: str) -> DM_Draft:
        return DM_Draft.objects.create(
            company=company,
            target_platform=platform,
            draft_text=text
        )

class DjangoLaunchEventRepository(ILaunchEventRepository):
    def get_by_id(self, launch_id: str) -> Optional[LaunchEvent]:
        try:
            return LaunchEvent.objects.get(pk=launch_id)
        except LaunchEvent.DoesNotExist:
            return None

    def update_metrics(self, launch_id: str, likes: int) -> LaunchEvent:
        from django.utils import timezone
        launch = LaunchEvent.objects.get(pk=launch_id)
        launch.likes_count = likes
        launch.last_monitored_at = timezone.now()
        launch.save()
        return launch

    def create_launch(self, company: Company, platform: str, post_url: str, likes_count: int) -> LaunchEvent:
        return LaunchEvent.objects.create(
            company=company,
            platform=platform,
            post_url=post_url,
            likes_count=likes_count
        )

# Dependency Providers
def get_company_repository() -> ICompanyRepository:
    """Returns the active implementation of ICompanyRepository."""
    return DjangoCompanyRepository()

def get_dm_repository() -> IDMRepository:
    """Returns the active implementation of IDMRepository."""
    return DjangoDMRepository()

def get_launch_repository() -> ILaunchEventRepository:
    """Returns the active implementation of ILaunchEventRepository."""
    return DjangoLaunchEventRepository()
