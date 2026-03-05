# Data Model: Launch Tracking Dashboard

## Entities

### Company
Represents the unified record of a company.
- `id` (UUID)
- `name` (String)
- `amount_raised` (Decimal, nullable)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### LaunchEvent
Represents a launch video or announcement on a specific platform.
- `id` (UUID)
- `company_id` (ForeignKey to Company)
- `platform` (Enum: X, LinkedIn, Crunchbase)
- `video_url` (String, nullable)
- `likes_count` (Integer)
- `engagement_status` (Enum: Good, Poor)
- `posted_at` (DateTime)

### ContactInfo
Enriched contact methods for a company.
- `id` (UUID)
- `company_id` (OneToOneField to Company)
- `email` (String, nullable)
- `phone_number` (String, nullable)
- `linkedin_handle` (String, nullable)
- `x_handle` (String, nullable)

### DM_Draft
Draft message for poorly performing launches.
- `id` (UUID)
- `company_id` (ForeignKey to Company)
- `target_platform` (Enum: X, LinkedIn)
- `draft_text` (Text)
- `generated_at` (DateTime)
- `is_sent` (Boolean, default False)
