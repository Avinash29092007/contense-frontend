from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import User
from ..services import calculate_streaks
from ..utils.responses import error_response, success_response


users_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users"
)


def get_current_user():
    user_id = get_jwt_identity()

    return User.query.get(int(user_id))


@users_bp.get("/me")
@jwt_required()
def get_me():
    user = get_current_user()

    if not user:
        return error_response(
            "User not found",
            404
        )

    streaks = calculate_streaks(
        user.completions
    )

    return success_response(
        user.to_dict(
            current_streak=streaks["current"],
            longest_streak=streaks["longest"]
        )
    )


@users_bp.patch("/me")
@jwt_required()
def update_me():
    user = get_current_user()

    if not user:
        return error_response(
            "User not found",
            404
        )

    data = request.get_json(silent=True) or {}

    if "name" in data:
        name = str(data["name"]).strip()

        if not name:
            return error_response(
                "Name cannot be empty",
                400
            )

        user.name = name
        user.avatar_initial = name[:1].upper()

    if "email" in data:
        email = str(data["email"]).strip().lower()

        existing = User.query.filter(
            User.email == email,
            User.id != user.id
        ).first()

        if existing:
            return error_response(
                "Email is already in use",
                409
            )

        user.email = email

    db.session.commit()

    streaks = calculate_streaks(
        user.completions
    )

    return success_response(
        user.to_dict(
            current_streak=streaks["current"],
            longest_streak=streaks["longest"]
        ),
        "Profile updated"
    )
