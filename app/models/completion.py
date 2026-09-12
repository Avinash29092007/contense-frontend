from datetime import datetime, timezone

from ..extensions import db


class Completion(db.Model):
    __tablename__ = "completions"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    task_id = db.Column(
        db.Integer,
        db.ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    date = db.Column(
        db.Date,
        nullable=False,
        index=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    __table_args__ = (
        db.UniqueConstraint(
            "user_id",
            "task_id",
            "date",
            name="uq_completion_user_task_date"
        ),
    )

    user = db.relationship(
        "User",
        back_populates="completions"
    )

    task = db.relationship(
        "Task",
        back_populates="completions"
    )

    def to_dict(self):
        return {
            "taskId": str(self.task_id),
            "date": self.date.isoformat(),
        }
