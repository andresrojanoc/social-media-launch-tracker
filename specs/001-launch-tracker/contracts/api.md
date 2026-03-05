# API Contracts

## Endpoints

### `GET /api/companies/`
Returns a list of companies with their latest launch metrics and total raised amount.

**Response**:
```json
{
  "companies": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "amount_raised": 5000000.00,
      "contact_info": {
        "email": "hello@acme.com",
        "phone_number": "+123456789",
        "linkedin_handle": "acmecorp",
        "x_handle": "acmecorp"
      },
      "launches": [
        {
          "platform": "X",
          "likes_count": 50,
          "engagement_status": "Poor",
          "draft_dm": "Hey Acme Corp..."
        }
      ]
    }
  ]
}
```

### `POST /api/companies/{id}/draft_dm/`
Triggers the generation of a draft DM for a specific company's poorly performing launch.

**Request**:
```json
{
  "platform": "X"
}
```

**Response**:
```json
{
  "draft_text": "Hi founders, saw the launch on X. Seems like you could use some help with distribution. Let's chat."
}
```
