"""broaden renter profile beyond students

Revision ID: dcef1b52ec74
Revises: 4b1c038102eb
Create Date: 2026-07-21 13:31:36.715799

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'dcef1b52ec74'
down_revision: Union[str, Sequence[str], None] = '4b1c038102eb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    renter_type_enum = postgresql.ENUM("student", "worker", "tourist", "other", name="renter_type")
    renter_type_enum.create(op.get_bind(), checkfirst=True)

    op.add_column("renter_profiles", sa.Column("renter_type", renter_type_enum, nullable=False, server_default="student"))
    op.add_column("renter_profiles", sa.Column("occupation", sa.String(length=150), nullable=True))
    op.add_column("renter_profiles", sa.Column("employer_name", sa.String(length=150), nullable=True))
    op.add_column("renter_profiles", sa.Column("stay_duration", sa.String(length=30), nullable=True))

    op.alter_column("renter_profiles", "campus_id", nullable=True)
    op.alter_column("renter_profiles", "academic_major", nullable=True)
    op.alter_column("renter_profiles", "year_level", nullable=True)


def downgrade() -> None:
    op.drop_column("renter_profiles", "stay_duration")
    op.drop_column("renter_profiles", "employer_name")
    op.drop_column("renter_profiles", "occupation")
    op.drop_column("renter_profiles", "renter_type")
    postgresql.ENUM(name="renter_type").drop(op.get_bind(), checkfirst=True)
