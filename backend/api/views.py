from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Company, DM_Draft
from .serializers import CompanySerializer
from .services import generate_dm_draft, is_poor_engagement


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Company.objects.prefetch_related(
        'launches', 'contact_info', 'dm_drafts'
    ).all()
    serializer_class = CompanySerializer

    @action(detail=True, methods=['post'], url_path='draft_dm')
    def draft_dm(self, request, pk=None):
        """
        POST /api/companies/{id}/draft_dm/
        Generates a DM draft for a company with a poorly performing launch.
        """
        company = get_object_or_404(Company, pk=pk)
        platform = request.data.get('platform', 'X')

        # Check at least one poor launch exists for this company
        poor_launches = company.launches.filter(engagement_status='Poor')
        if not poor_launches.exists():
            return Response(
                {'detail': 'No poor-performing launches found for this company.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate the draft text
        draft_text = generate_dm_draft(company.name, platform)

        # Persist the draft
        dm = DM_Draft.objects.create(
            company=company,
            target_platform=platform,
            draft_text=draft_text
        )

        return Response({'draft_text': dm.draft_text}, status=status.HTTP_200_OK)
