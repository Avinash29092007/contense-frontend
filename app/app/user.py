from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    avatar_initial = db.Column(
        db.String(1),
        nullable=True
    )

    joined_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    total_xp = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    onboarded = db.Column(
        db.Boolean,
        default=False,
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

    topics = db.relationship(
        "Topic",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    tasks = db.relationship(
        "Task",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    completions = db.relationship(
        "Completion",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    daily_notes = db.relationship(
        "DailyNote",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(
            self.password_hash,
            password
        )

    def to_dict(self, current_streak=0, longest_streak=0):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "avatarInitial": self.avatar_initial or (
                self.name[:1].upper() if self.name else "U"
            ),
            "joinedAt": self.joined_at.date().isoformat(),
            "totalXp": self.total_xp,
            "currentStreak": current_streak,
            "longestStreak": longest_streak,
        }
