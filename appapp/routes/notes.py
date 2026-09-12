from datetime import date

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import DailyNote, User
from ..utils.responses import error_response, success_response


notes_bp = Blueprint(
    "notes",
    __name__,
    url_prefix="/api/notes"
)


def current_user():
    return User.query.get(
        int(get_jwt_identity())
    )


@notes_bp.get("")
@jwt_required()
def get_notes():
    user = current_user()

    notes = DailyNote.query.filter_by(
        user_id=user.id
    ).order_by(
        DailyNote.date.desc()
    ).all()

    return success_response(
        [
            note.to_dict()
            for note in notes
        ]
    )


@notes_bp.get("/<date_string>")
@jwt_required()
def get_note(date_string):
    user = current_user()

    try:
        note_date = date.fromisoformat(
            date_string
        )
    except ValueError:
        return error_response(
            "Invalid date",
            400
        )

    note = DailyNote.query.filter_by(
        user_id=user.id,
        date=note_date
    ).first()

    if not note:
        return success_response(
            None,
            "No note for this date"
        )

    return success_response(
        note.to_dict()
    )


@notes_bp.put("/<date_string>")
@jwt_required()
def save_note(date_string):
    user = current_user()

    try:
        note_date = date.fromisoformat(
            date_string
        )
    except ValueError:
        return error_response(
            "Invalid date",
            400
        )

    data = request.get_json(silent=True) or {}

    content = str(
        data.get("content") or ""
    )

    note = DailyNote.query.filter_by(
        user_id=user.id,
        date=note_date
    ).first()

    if note:
        note.content = content
    else:
        note = DailyNote(
            user_id=user.id,
            date=note_date,
            content=content
        )

        db.session.add(note)

    db.session.commit()

    return success_response(
        note.to_dict(),
        "Note saved"
    )


@notes_bp.delete("/<date_string>")
@jwt_required()
def delete_note(date_string):
    user = current_user()

    try:
        note_date = date.fromisoformat(
            date_string
        )
    except ValueError:
        return error_response(
            "Invalid date",
            400
        )

    note = DailyNote.query.filter_by(
        user_id=user.id,
        date=note_date
    ).first()

    if note:
        db.session.delete(note)
        db.session.commit()

    return success_response(
        {
            "ok": True
        },
        "Note deleted"
    )
