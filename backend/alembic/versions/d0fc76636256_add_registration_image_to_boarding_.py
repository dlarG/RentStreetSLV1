"""add registration image to boarding houses

Revision ID: d0fc76636256
Revises: ef4674cc6a7a
Create Date: 2026-07-18 09:55:59.339306

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd0fc76636256'
down_revision: Union[str, Sequence[str], None] = 'ef4674cc6a7a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("boarding_houses", sa.Column("registration_image_url", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("boarding_houses", "registration_image_url")
