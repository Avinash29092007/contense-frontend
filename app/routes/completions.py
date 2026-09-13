from datetime import date

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import Completion, Task, User
from ..utils.responses import error_response, success_response


completions_bp = Blueprint(
    "completions",
    __name__,
    url_prefix="/api/completions"
)


def current_user():
    return User.query.get(
        int(get_jwt_identity())
    )


@completions_bp.get("")
@jwt_required()
def get_completions():
    user = current_user()

    completions = Completion.query.filter_by(
        user_id=user.id
    ).order_by(
        Completion.date.asc()
    ).all()

    return success_response(
        [
            completion.to_dict()
            for completion in completions
        ]
    )


@completions_bp.post("/toggle")
@jwt_required()
def toggle_completion():
    user = current_user()

    data = request.get_json(silent=True) or {}

    task_id = data.get("taskId")
    date_string = data.get("date")

    if not task_id:
        return error_response(
            "taskId is required",
            400
        )

    try:
        completion_date = (
            date.fromisoformat(date_string)
            if date_string
            else date.today()
        )
    except ValueError:
        return error_response(
            "Invalid date. Use YYYY-MM-DD",
            400
        )

    task = Task.query.filter_by(
        id=int(task_id),
        user_id=user.id
    ).first()

    if not task:
        return error_response(
            "Task not found",
            404
        )

    completion = Completion.query.filter_by(
        user_id=user.id,
        task_id=task.id,
        date=completion_date
    ).first()

    if completion:
        db.session.delete(completion)

        user.total_xp = max(
            0,
            user.total_xp - task.xp
        )

        completed = False
    else:
        completion = Completion(
            user_id=user.id,
            task_id=task.id,
            date=completion_date
        )

        db.session.add(completion)

        user.total_xp += task.xp

        completed = True

    db.session.commit()

    all_completions = Completion.query.filter_by(
        user_id=user.id
    ).all()

    return success_response(
        {
            "completed": completed,
            "completions": [
                item.to_dict()
                for item in all_completions
            ],
            "user": user.to_dict()
        },
        "Completion updated"
    )
