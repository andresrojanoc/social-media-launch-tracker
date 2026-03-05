from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Standardizes error responses from the API.
    Format:
    {
        "status": "error",
        "message": "Human readable summary",
        "details": { ...raw errors... },
        "code": "error_type"
    }
    """
    # Call DRF's default exception handler first to get the standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        # Get the standard DRF data (usually a dict or list)
        data = response.data
        
        custom_data = {
            "status": "error",
            "code": getattr(exc, 'default_code', 'error'),
            "details": data
        }

        # Attempt to synthesize a friendly message
        if isinstance(data, dict):
            if 'detail' in data:
                custom_data["message"] = data['detail']
            elif 'non_field_errors' in data:
                custom_data["message"] = data['non_field_errors'][0]
            else:
                # Join multiple field errors if available
                first_key = next(iter(data))
                custom_data["message"] = f"Error in {first_key}: {data[first_key][0]}"
        elif isinstance(data, list):
            custom_data["message"] = data[0]
        else:
            custom_data["message"] = "An error occurred while processing your request."

        response.data = custom_data

    return response
