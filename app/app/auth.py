from flask import Blueprint, request
from flask_jwt_extended import create_access_token

from ..extensions import db
from ..models import User
from ..utils.responses import error_response, success_response


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name:
        return error_response(
            "Name is required",
            400
        )

    if not email:
        return error_response(
            "Email is required",
            400
        )

    if not password:
        return error_response(
            "Password is required",
            400
        )

    if len(password) < 6:
        return error_response(
            "Password must contain at least 6 characters",
            400
        )

    existing = User.query.filter_by(email=email).first()

    if existing:
        return error_response(
            "An account with this email already exists",
            409
        )

    user = User(
        name=name,
        email=email,
        avatar_initial=name[:1].upper(),
        onboarded=False,
        total_xp=0
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = create_access_token(
        identity=str(user.id)
    )

    return success_response(
        {
            "user": user.to_dict(),
            "token": token
        },
        "Account created successfully",
        201
    )


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return error_response(
            "Email and password are required",
            400
        )

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return error_response(
            "Invalid email or password",
            401
        )

    token = create_access_token(
        identity=str(user.id)
    )

    return success_response(
        {
            "user": user.to_dict(),
            "token": token
        },
        "Login successful"
    )


@auth_bp.post("/forgot-password")
def forgot_password():
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()

    if not email:
        return error_response(
            "Email is required",
            400
        )

    # Phase currently only confirms the request.
    # Actual email delivery can be added later.
    return success_response(
        {
            "sent": True
        },
        "If the email exists, password reset instructions will be sent."
    )
