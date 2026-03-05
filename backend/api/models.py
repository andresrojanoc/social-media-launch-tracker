from django.db import models
import uuid

class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    thumbnail_url = models.URLField(max_length=500, null=True, blank=True)
    amount_raised = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class LaunchEvent(models.Model):
    PLATFORM_CHOICES = (
        ('X', 'X'),
        ('LinkedIn', 'LinkedIn'),
        ('Crunchbase', 'Crunchbase'),
    )
    ENGAGEMENT_CHOICES = (
        ('Good', 'Good'),
        ('Poor', 'Poor'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, related_name='launches', on_delete=models.CASCADE)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    video_url = models.URLField(max_length=500, null=True, blank=True)
    likes_count = models.IntegerField(default=0)
    engagement_status = models.CharField(max_length=10, choices=ENGAGEMENT_CHOICES, default='Good')
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company.name} launch on {self.platform}"

class ContactInfo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.OneToOneField(Company, related_name='contact_info', on_delete=models.CASCADE)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=30, null=True, blank=True)
    linkedin_handle = models.CharField(max_length=100, null=True, blank=True)
    x_handle = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Contact for {self.company.name}"

class DM_Draft(models.Model):
    TARGET_PLATFORM_CHOICES = (
        ('X', 'X'),
        ('LinkedIn', 'LinkedIn'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, related_name='dm_drafts', on_delete=models.CASCADE)
    target_platform = models.CharField(max_length=10, choices=TARGET_PLATFORM_CHOICES)
    draft_text = models.TextField()
    generated_at = models.DateTimeField(auto_now_add=True)
    is_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"DM Draft for {self.company.name} on {self.target_platform}"
