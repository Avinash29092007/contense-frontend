from ..extensions import db


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    topic_id = db.Column(
        db.Integer,
        db.ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    name = db.Column(
        db.String(200),
        nullable=False
    )

    xp = db.Column(
        db.Integer,
        default=10,
        nullable=False
    )

    frequency = db.Column(
        db.String(50),
        default="Daily",
        nullable=False
    )

    description = db.Column(
        db.Text,
        default="",
        nullable=False
    )

    active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="tasks"
    )

    topic = db.relationship(
        "Topic",
        back_populates="tasks"
    )

    completions = db.relationship(
        "Completion",
        back_populates="task",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "topicId": str(self.topic_id),
            "name": self.name,
            "xp": self.xp,
            "frequency": self.frequency,
            "description": self.description or "",
            "active": self.active,
        }
