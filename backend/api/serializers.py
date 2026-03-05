from rest_framework import serializers
from .models import Company, LaunchEvent, ContactInfo, DM_Draft

class LaunchEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaunchEvent
        fields = ['id', 'platform', 'video_url', 'likes_count', 'engagement_status', 'posted_at']

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ['email', 'phone_number', 'linkedin_handle', 'x_handle']

class CompanySerializer(serializers.ModelSerializer):
    launches = LaunchEventSerializer(many=True, read_only=True)
    contact_info = ContactInfoSerializer(read_only=True)

    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'thumbnail_url', 'amount_raised', 'launches', 'contact_info', 'created_at']
