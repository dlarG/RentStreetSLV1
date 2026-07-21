"""restructure favorites to property-level

Revision ID: 560e70b0de4b
Revises: dcef1b52ec74
Create Date: 2026-07-21 17:10:11.230430

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '560e70b0de4b'
down_revision: Union[str, Sequence[str], None] = 'dcef1b52ec74'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("favorites_pkey", "favorites", type_="primary")
    op.drop_column("favorites", "room_id")
    op.add_column("favorites", sa.Column("boarding_house_id", postgresql.UUID(as_uuid=True), nullable=False))
    op.create_foreign_key(
        "fk_favorites_boarding_house", "favorites", "boarding_houses",
        ["boarding_house_id"], ["id"], ondelete="CASCADE",
    )
    op.create_primary_key("favorites_pkey", "favorites", ["renter_id", "boarding_house_id"])


def downgrade() -> None:
    op.drop_constraint("favorites_pkey", "favorites", type_="primary")
    op.drop_constraint("fk_favorites_boarding_house", "favorites", type_="foreignkey")
    op.drop_column("favorites", "boarding_house_id")
    op.add_column("favorites", sa.Column("room_id", postgresql.UUID(as_uuid=True), nullable=False))
    op.create_primary_key("favorites_pkey", "favorites", ["renter_id", "room_id"])
