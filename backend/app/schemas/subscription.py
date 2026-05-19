from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.subscription import PlanType, SubscriptionStatus

class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    plan: PlanType
    status: SubscriptionStatus
    current_period_end: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CheckoutSessionResponse(BaseModel):
    checkout_url: str