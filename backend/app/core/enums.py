# backend/app/core/enums.py
from sqlalchemy.dialects.postgresql import ENUM as PGEnum

user_role_enum = PGEnum('renter', 'landlord', 'admin', name='user_role', create_type=False)
gender_policy_enum = PGEnum('male_only', 'female_only', 'mixed', name='gender_policy', create_type=False)
property_status_enum = PGEnum('active', 'inactive', 'pending_review', 'suspended', name='property_status', create_type=False)
room_type_enum = PGEnum('private', 'shared', name='room_type', create_type=False)
room_status_enum = PGEnum('available', 'full', 'maintenance', 'delisted', name='room_status', create_type=False)
bed_slot_status_enum = PGEnum('vacant', 'occupied', 'reserved', name='bed_slot_status', create_type=False)
amenity_category_enum = PGEnum('utility', 'safety', 'lifestyle', 'connectivity', name='amenity_category', create_type=False)
trust_event_type_enum = PGEnum(
    'payment_on_time', 'payment_late', 'checkout_compliant', 'checkout_violation',
    'dispute_filed', 'dispute_resolved_favor_tenant', 'dispute_resolved_favor_landlord',
    'admin_adjustment',
    name='trust_event_type', create_type=False
)
dispute_status_enum = PGEnum('open', 'under_review', 'resolved_favor_tenant', 'resolved_favor_landlord', name='dispute_status', create_type=False)

# --- newly added ---
application_status_enum = PGEnum('submitted', 'viewed', 'accepted', 'rejected', 'withdrawn', name='application_status', create_type=False)
tenancy_status_enum = PGEnum('pending', 'active', 'completed', 'terminated', name='tenancy_status', create_type=False)
payment_status_enum = PGEnum('unpaid', 'paid', 'late', 'disputed', name='payment_status', create_type=False)
payment_method_enum = PGEnum('gcash', 'maya', 'cash', 'bank_transfer', name='payment_method', create_type=False)
subscription_status_enum = PGEnum('trialing', 'active', 'past_due', 'canceled', name='subscription_status', create_type=False)
interaction_type_enum = PGEnum('view', 'favorite', 'apply', 'contact', name='interaction_type', create_type=False)
approval_status_enum = PGEnum('pending', 'accepted', 'rejected', name='approval_status', create_type=False)
renter_type_enum = PGEnum('student', 'worker', 'tourist', 'other', name='renter_type', create_type=False)