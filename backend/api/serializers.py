from rest_framework import serializers
from .models import Company, LaunchEvent, ContactInfo, DM_Draft

class LaunchEventSerializer(serializers.ModelSerializer):
    engagement_status = serializers.SerializerMethodField()

    class Meta:
        model = LaunchEvent
        fields = [
            'id', 'platform', 'post_url', 'video_url', 
            'likes_count', 'engagement_status', 'last_monitored_at', 'posted_at'
        ]

    def get_engagement_status(self, obj):
        # Dynamic calculation based on likes
        from .services import DEFAULT_POOR_ENGAGEMENT_THRESHOLD
        return "Poor" if obj.likes_count < DEFAULT_POOR_ENGAGEMENT_THRESHOLD else "Good"

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
