"""add approval workflow to users

Revision ID: bf5af67fac32
Revises: 187f2640608f
Create Date: 2026-07-16 10:52:26.087151

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'bf5af67fac32'
down_revision: Union[str, Sequence[str], None] = '187f2640608f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    approval_status_enum = postgresql.ENUM("pending", "accepted", "rejected", name="approval_status")
    approval_status_enum.create(op.get_bind(), checkfirst=True)

    op.add_column("users", sa.Column("approval_status", approval_status_enum, nullable=False, server_default="pending"))
    op.add_column("users", sa.Column("accepted_at", sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column("users", sa.Column("rejected_at", sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column("users", sa.Column("validated_by", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key("fk_users_validated_by", "users", "users", ["validated_by"], ["id"])

    # Your existing seeded users didn't go through registration — treat them as pre-approved
    op.execute("UPDATE users SET approval_status = 'accepted', accepted_at = now()")


def downgrade() -> None:
    op.drop_constraint("fk_users_validated_by", "users", type_="foreignkey")
    op.drop_column("users", "validated_by")
    op.drop_column("users", "rejected_at")
    op.drop_column("users", "accepted_at")
    op.drop_column("users", "approval_status")
    postgresql.ENUM(name="approval_status").drop(op.get_bind(), checkfirst=True)
