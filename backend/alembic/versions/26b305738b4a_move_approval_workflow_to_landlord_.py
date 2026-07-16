"""move approval workflow to landlord_profiles, add document uploads

Revision ID: 26b305738b4a
Revises: bf5af67fac32
Create Date: 2026-07-16 13:38:56.832392

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '26b305738b4a'
down_revision: Union[str, Sequence[str], None] = 'bf5af67fac32'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    approval_status_type = postgresql.ENUM(
        "pending", "accepted", "rejected", name="approval_status", create_type=False
    )

    op.add_column("landlord_profiles", sa.Column("approval_status", approval_status_type, nullable=False, server_default="pending"))
    op.add_column("landlord_profiles", sa.Column("accepted_at", sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column("landlord_profiles", sa.Column("rejected_at", sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column("landlord_profiles", sa.Column("rejection_reason", sa.String(), nullable=True))
    op.add_column("landlord_profiles", sa.Column("validated_by", postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column("landlord_profiles", sa.Column("business_permit_url", sa.String(), nullable=True))
    op.create_foreign_key("fk_landlord_profiles_validated_by", "landlord_profiles", "users", ["validated_by"], ["id"])

    # Carry over any existing values before the old columns disappear
    op.execute("""
        UPDATE landlord_profiles lp
        SET approval_status = u.approval_status,
            accepted_at = u.accepted_at,
            rejected_at = u.rejected_at,
            validated_by = u.validated_by
        FROM users u
        WHERE lp.user_id = u.id
    """)

    op.drop_constraint("fk_users_validated_by", "users", type_="foreignkey")
    op.drop_column("users", "validated_by")
    op.drop_column("users", "rejected_at")
    op.drop_column("users", "accepted_at")
    op.drop_column("users", "approval_status")

    # Superseded by approval_status / accepted_at
    op.drop_column("landlord_profiles", "is_verified_landlord")
    op.drop_column("landlord_profiles", "verified_at")


def downgrade() -> None:
    approval_status_type = postgresql.ENUM(
        "pending", "accepted", "rejected", name="approval_status", create_type=False
    )
    op.add_column("landlord_profiles", sa.Column("is_verified_landlord", sa.Boolean(), nullable=False, server_default="false"))
    op.add_column("landlord_profiles", sa.Column("verified_at", sa.TIMESTAMP(timezone=True), nullable=True))

    op.add_column("users", sa.Column("approval_status", approval_status_type, nullable=False, server_default="pending"))
    op.add_column("users", sa.Column("accepted_at", sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column("users", sa.Column("rejected_at", sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column("users", sa.Column("validated_by", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key("fk_users_validated_by", "users", "users", ["validated_by"], ["id"])

    op.drop_constraint("fk_landlord_profiles_validated_by", "landlord_profiles", type_="foreignkey")
    op.drop_column("landlord_profiles", "validated_by")
    op.drop_column("landlord_profiles", "rejection_reason")
    op.drop_column("landlord_profiles", "rejected_at")
    op.drop_column("landlord_profiles", "accepted_at")
    op.drop_column("landlord_profiles", "approval_status")
    op.drop_column("landlord_profiles", "business_permit_url")
