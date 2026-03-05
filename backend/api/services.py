"""
Business logic for DM draft generation and engagement threshold evaluation.
"""

# Default threshold - number of likes below which a launch is deemed "poor"
DEFAULT_POOR_ENGAGEMENT_THRESHOLD = 100


def is_poor_engagement(likes_count: int, threshold: int = DEFAULT_POOR_ENGAGEMENT_THRESHOLD) -> bool:
    """Returns True if the launch engagement is below the threshold."""
    return likes_count < threshold


def generate_dm_draft(company_name: str, platform: str) -> str:
    """
    Generates a context-aware DM draft for poorly performing launches.
    This is a template-based generator. In production, this could be
    replaced with an LLM call (e.g. OpenAI API).
    """
    platform_context = {
        "X": "X (formerly Twitter)",
        "LinkedIn": "LinkedIn",
    }

    platform_display = platform_context.get(platform, platform)

    return (
        f"Hey {company_name} team! 👋\n\n"
        f"I came across your recent launch on {platform_display} — really interesting product! "
        f"I noticed the launch didn't get as much traction as it deserved.\n\n"
        f"I specialize in helping startups grow their audience and improve their launch strategies. "
        f"I'd love to share a few ideas that could make a big difference for your next campaign.\n\n"
        f"Would you be open to a quick 15-minute call this week?\n\n"
        f"Best,\n[Your Name]"
    )
