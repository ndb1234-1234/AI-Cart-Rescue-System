"""
Manual test script for the WhatsApp alert integration.

Run this directly to verify your Twilio credentials and WhatsApp sandbox/
number configuration are working correctly, independent of the Flask app
or the ML model.

Usage:
    cd backend
    python test_whatsapp.py
"""

import os
import sys
import logging

from dotenv import load_dotenv

# Load environment variables from backend/.env before importing the
# service, so TWILIO_* variables are available when whatsapp_service
# initializes its Twilio client at import time.
load_dotenv()

from services.whatsapp_service import send_whatsapp_alert  # noqa: E402

# Basic console logging so we can see INFO/ERROR logs from the service
# while running this script standalone.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

logger = logging.getLogger(__name__)


def main():
    """Sends a sample high-risk WhatsApp alert and reports the result."""
    sample_probability = 85.0  # Simulated 85% cart abandonment probability

    print("=" * 60)
    print("AI Cart Rescue System — WhatsApp Alert Test")
    print("=" * 60)
    print(f"Sending test alert with probability: {sample_probability}%\n")

    message_sid = send_whatsapp_alert(sample_probability)

    print("-" * 60)
    if message_sid:
        print("✅ SUCCESS: WhatsApp alert sent successfully!")
        print(f"   Twilio Message SID: {message_sid}")
        print("-" * 60)
        sys.exit(0)
    else:
        print("❌ FAILED: WhatsApp alert could not be sent.")
        print("   Check the logs above for the specific error, and verify:")
        print("     - TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are correct")
        print("     - TWILIO_WHATSAPP_FROM is your Twilio WhatsApp sender number")
        print("     - TWILIO_WHATSAPP_TO has joined the Twilio Sandbox (if using")
        print("       the sandbox) by sending the join code from WhatsApp")
        print("-" * 60)
        sys.exit(1)


if __name__ == "__main__":
    main()
