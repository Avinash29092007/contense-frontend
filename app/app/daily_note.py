from datetime import datetime, timezone

from ..extensions import db


class DailyNote(db.Model):
    __tablename__ = "daily_notes"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    date = db.Column(
        db.Date,
        nullable=False,
        index=True
    )

    content = db.Column(
        db.Text,
        default="",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    __table_args__ = (
        db.UniqueConstraint(
            "user_id",
            "date",
            name="uq_daily_note_user_date"
        ),
    )

    user = db.relationship(
        "User",
        back_populates="daily_notes"
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "date": self.date.isoformat(),
            "content": self.content,
        }
