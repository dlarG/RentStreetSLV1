"""add renter id upload, registration ip, admin trust adjustment event

Revision ID: ef4674cc6a7a
Revises: 26b305738b4a
Create Date: 2026-07-17 13:39:33.837215

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ef4674cc6a7a'
down_revision: Union[str, Sequence[str], None] = '26b305738b4a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("renter_profiles", sa.Column("valid_id_url", sa.String(), nullable=True))
    op.add_column("users", sa.Column("registration_ip", sa.String(length=45), nullable=True))

    # New enum value — must run outside the wrapping transaction on Postgres
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE trust_event_type ADD VALUE IF NOT EXISTS 'admin_adjustment'")


def downgrade() -> None:
    # Postgres can't drop a single enum value cleanly — leaving it is harmless.
    op.drop_column("users", "registration_ip")
    op.drop_column("renter_profiles", "valid_id_url")
