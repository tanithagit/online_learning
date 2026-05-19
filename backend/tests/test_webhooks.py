import json
import stripe
from unittest.mock import patch, MagicMock

def test_webhook_missing_signature(client):
    response = client.post("/billing/webhook", content=b"test payload")
    assert response.status_code == 400

def test_webhook_invalid_signature(client):
    with patch('stripe.Webhook.construct_event') as mock:
        mock.side_effect = stripe.error.SignatureVerificationError(
            "Invalid signature", "sig_header"
        )
        response = client.post(
            "/billing/webhook",
            content=b"test payload",
            headers={"stripe-signature": "invalid_sig"}
        )
        assert response.status_code == 400

def test_webhook_checkout_completed(client, test_user):
    event_data = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "metadata": {"user_id": str(test_user["user"]["id"])},
                "subscription": "sub_test123",
                "customer": "cus_test123"
            }
        }
    }
    with patch('stripe.Webhook.construct_event') as mock:
        mock.return_value = event_data
        response = client.post(
            "/billing/webhook",
            content=json.dumps(event_data).encode(),
            headers={"stripe-signature": "test_sig"}
        )
        assert response.status_code == 200

def test_webhook_subscription_deleted(client, test_user):
    event_data = {
        "type": "customer.subscription.deleted",
        "data": {
            "object": {
                "id": "sub_test123",
                "status": "canceled"
            }
        }
    }
    with patch('stripe.Webhook.construct_event') as mock:
        mock.return_value = event_data
        response = client.post(
            "/billing/webhook",
            content=json.dumps(event_data).encode(),
            headers={"stripe-signature": "test_sig"}
        )
        assert response.status_code == 200