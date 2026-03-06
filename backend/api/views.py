from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import Http404
from .serializers import CompanySerializer
from .services import get_company_service, get_dm_service

class CompanyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Company entities. 
    Handles HTTP concerns and delegates business logic to Service Layer.
    """
    serializer_class = CompanySerializer
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Loose coupling: Depend on Service Layer
        self.company_service = get_company_service()
        self.dm_service = get_dm_service()

    def get_queryset(self):
        """
        GET /api/companies/
        """
        return self.company_service.get_all_companies()

    def get_object(self):
        """
        Handles detail retrieval for Company.
        """
        pk = self.kwargs.get('pk')
        company = self.company_service.get_company_by_id(pk)
        if not company:
            raise Http404
        return company

    def destroy(self, request, *args, **kwargs):
        """
        DELETE /api/companies/{id}/
        """
        pk = kwargs.get('pk')
        success = self.company_service.delete_company(pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, *args, **kwargs):
        """
        POST /api/companies/
        Expects search data to create a new company entry.
        """
        try:
            company = self.company_service.create_company_entry(request.data)
            serializer = self.get_serializer(company)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='reset')
    def reset(self, request):
        """
        POST /api/companies/reset/
        Restores the dashboard to its initial state.
        """
        self.company_service.reset_dashboard()
        return Response({'message': 'Dashboard reset to initial state'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='draft_dm')
    def draft_dm(self, request, pk=None):
        """
        POST /api/companies/{id}/draft_dm/
        Generates and persists a DM draft using Service Layer.
        """
        platform = request.data.get('platform', 'X')

        # Delegate the entire use case to the Service Layer
        dm = self.dm_service.create_and_save_draft(pk, platform)
        
        if not dm:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'draft_text': dm.draft_text}, status=status.HTTP_200_OK)
