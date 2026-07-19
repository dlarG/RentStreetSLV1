"""add status reasons to boarding houses

Revision ID: 4b1c038102eb
Revises: d0fc76636256
Create Date: 2026-07-19 08:11:02.628971

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '4b1c038102eb'
down_revision: Union[str, Sequence[str], None] = 'd0fc76636256'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("boarding_houses", sa.Column("rejection_reason", sa.String(), nullable=True))
    op.add_column("boarding_houses", sa.Column("suspension_reason", sa.String(), nullable=True))
    op.add_column("boarding_houses", sa.Column("status_updated_by", postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column("boarding_houses", sa.Column("status_updated_at", sa.TIMESTAMP(timezone=True), nullable=True))
    op.create_foreign_key("fk_boarding_houses_status_updated_by", "boarding_houses", "users", ["status_updated_by"], ["id"])


def downgrade() -> None:
    op.drop_constraint("fk_boarding_houses_status_updated_by", "boarding_houses", type_="foreignkey")
    op.drop_column("boarding_houses", "status_updated_by")
    op.drop_column("boarding_houses", "status_updated_at")
    op.drop_column("boarding_houses", "suspension_reason")
    op.drop_column("boarding_houses", "rejection_reason")
