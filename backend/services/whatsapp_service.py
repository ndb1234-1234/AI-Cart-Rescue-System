"""
WhatsApp alerting service for the AI Cart Rescue System.

Uses the Twilio WhatsApp API to notify a configured phone number whenever
the XGBoost model predicts a high probability of cart abandonment.

============================================================================
 REQUIRED ENVIRONMENT VARIABLES (set in backend/.env)
============================================================================
    TWILIO_ACCOUNT_SID       Your Twilio Account SID
    TWILIO_AUTH_TOKEN        Your Twilio Auth Token
    TWILIO_WHATSAPP_FROM     Twilio WhatsApp sender, e.g. whatsapp:+14155238886
    TWILIO_WHATSAPP_TO       Destination WhatsApp number, e.g. whatsapp:+919390550294
============================================================================
"""

import os
import logging

import json

from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
# Uses the standard logging module so log output integrates cleanly with
# Flask's own logger and any log aggregation you set up in production.
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Load Twilio credentials from environment variables
# ---------------------------------------------------------------------------
# These are populated by python-dotenv (via load_dotenv() in app.py) during
# local development, or by the hosting platform's environment variable
# settings (Render, Railway, etc.) in production. No secrets are hardcoded.
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_FROM = os.environ.get("TWILIO_WHATSAPP_FROM")
TWILIO_WHATSAPP_TO = os.environ.get("TWILIO_WHATSAPP_TO")

# Optional: SID of an approved WhatsApp Content Template (starts with "HX...").
# Since April 1, 2025, Twilio requires business-initiated WhatsApp messages
# sent outside the 24-hour customer session window to use an approved
# template instead of free-form Body text (see error 21654 / 63016).
#
# If this is set, send_whatsapp_alert() sends the approved template with
# the probability as a template variable — this works reliably at any time,
# regardless of the session window, and is what you should use in production.
#
# If this is NOT set, the function falls back to a free-form Body message,
# which only succeeds within 24 hours of the recipient's last inbound
# WhatsApp message (e.g. right after they send "join <code>" in the sandbox).
# Fine for quick local testing, not reliable for production alerts.
TWILIO_CONTENT_SID = os.environ.get("TWILIO_CONTENT_SID")

# ---------------------------------------------------------------------------
# Initialize the Twilio client once at import time
# ---------------------------------------------------------------------------
# If credentials are missing, we don't crash the whole Flask app on startup
# (that would take down /predict and every other route too). Instead we log
# a clear warning and let send_whatsapp_alert() fail gracefully per-call.
_client = None
_client_init_error = None

if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        _client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        logger.info("Twilio client initialized successfully.")
    except Exception as e:  # noqa: BLE001
        _client_init_error = f"Failed to initialize Twilio client: {e}"
        logger.error(_client_init_error)
else:
    _client_init_error = (
        "Twilio credentials are missing. Set TWILIO_ACCOUNT_SID and "
        "TWILIO_AUTH_TOKEN in backend/.env to enable WhatsApp alerts."
    )
    logger.warning(_client_init_error)


def _build_alert_message(probability: float) -> str:
    """
    Builds the WhatsApp alert message body.

    Args:
        probability: Cart abandonment probability as a percentage (0-100).

    Returns:
        A formatted, human-readable alert message string.
    """
    return (
        "🛒 *AI Cart Rescue Alert*\n\n"
        f"Cart Abandonment Probability: *{probability:.1f}%*\n\n"
        "This session is at high risk of ending in an abandoned cart.\n"
        "Recommended action: send the customer a discount coupon or "
        "reminder notification to encourage checkout completion."
    )


def send_whatsapp_alert(probability: float):
    """
    Sends a WhatsApp alert via Twilio when cart abandonment risk is high.

    Args:
        probability: Cart abandonment probability as a percentage (0-100).
                     e.g. pass 85 for an 85% abandonment probability.

    Returns:
        str: The Twilio Message SID of the sent message, on success.
        None: If the alert could not be sent (missing config or Twilio
              API error). The error is logged; this function never raises,
              so a WhatsApp failure never breaks the /predict endpoint.
    """
    # -----------------------------------------------------------------
    # Guard clause: client not initialized (missing credentials)
    # -----------------------------------------------------------------
    if _client is None:
        logger.error(
            "Cannot send WhatsApp alert — Twilio client not initialized. %s",
            _client_init_error or "",
        )
        return None

    # -----------------------------------------------------------------
    # Guard clause: destination/source numbers not configured
    # -----------------------------------------------------------------
    if not TWILIO_WHATSAPP_FROM or not TWILIO_WHATSAPP_TO:
        logger.error(
            "Cannot send WhatsApp alert — TWILIO_WHATSAPP_FROM and/or "
            "TWILIO_WHATSAPP_TO are not set in the environment."
        )
        return None

    # -----------------------------------------------------------------
    # Send the message via the Twilio REST API
    # -----------------------------------------------------------------
    # Preferred path: an approved Content Template. Required for
    # business-initiated alerts sent outside the 24-hour session window
    # (i.e. almost always, for an automated system like this one).
    #
    # Fallback path: free-form Body text. Only works within 24 hours of
    # the recipient's last inbound WhatsApp message — fine for sandbox
    # testing right after joining, not reliable for production.
    try:
        if TWILIO_CONTENT_SID:
            message = _client.messages.create(
                from_=TWILIO_WHATSAPP_FROM,
                to=TWILIO_WHATSAPP_TO,
                content_sid=TWILIO_CONTENT_SID,
                content_variables=json.dumps({"1": f"{probability:.1f}"}),
            )
        else:
            message_body = _build_alert_message(probability)
            message = _client.messages.create(
                from_=TWILIO_WHATSAPP_FROM,
                to=TWILIO_WHATSAPP_TO,
                body=message_body,
            )
        logger.info(
            "WhatsApp alert sent successfully. SID=%s probability=%.1f%%",
            message.sid,
            probability,
        )
        return message.sid

    except TwilioRestException as e:
        # Twilio-specific errors (invalid number, unverified sandbox
        # recipient, insufficient balance, rate limiting, etc.)
        logger.error(
            "Twilio API error while sending WhatsApp alert (code=%s): %s",
            getattr(e, "code", "unknown"),
            e,
        )
        return None

    except Exception as e:  # noqa: BLE001
        # Catch-all for network errors or unexpected failures so this
        # function never raises and never takes down the /predict route.
        logger.exception("Unexpected error while sending WhatsApp alert: %s", e)
        return None
