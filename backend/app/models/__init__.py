# backend/app/models/__init__.py
from app.core.database import Base

from app.models.users import User, Campus, RenterProfile, LandlordProfile
from app.models.properties import (
    BoardingHouse, Room, BedSlot, Amenity, BoardingHouseAmenity, PropertyImage
)
from app.models.trust import (
    TrustScoreEvent, TrustScore, Dispute, DisputeEvidence, TrustScoreAccessLog
)
from app.models.bookings import RentalApplication, Tenancy, Payment
from app.models.subscriptions import SubscriptionPlan, LandlordSubscription, SubscriptionPayment
from app.models.ml import PricePrediction, ListingInteraction, Favorite, EnrollmentCycle
from app.models.misc import Review, Notification