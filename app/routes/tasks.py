from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import Task, Topic, User
from ..utils.responses import error_response, success_response


tasks_bp = Blueprint(
    "tasks",
    __name__,
    url_prefix="/api/tasks"
)


def current_user():
    return User.query.get(
        int(get_jwt_identity())
    )


@tasks_bp.get("")
@jwt_required()
def get_tasks():
    user = current_user()

    tasks = Task.query.filter_by(
        user_id=user.id
    ).order_by(
        Task.id.asc()
    ).all()

    return success_response(
        [task.to_dict() for task in tasks]
    )


@tasks_bp.post("")
@jwt_required()
def create_task():
    user = current_user()

    data = request.get_json(silent=True) or {}

    topic_id = data.get("topicId")
    name = str(data.get("name") or "").strip()

    if not topic_id:
        return error_response(
            "topicId is required",
            400
        )

    if not name:
        return error_response(
            "Task name is required",
            400
        )

    topic = Topic.query.filter_by(
        id=int(topic_id),
        user_id=user.id
    ).first()

    if not topic:
        return error_response(
            "Topic not found",
            404
        )

    try:
        xp = int(data.get("xp", 10))
    except (TypeError, ValueError):
        xp = 10

    xp = max(0, xp)

    task = Task(
        user_id=user.id,
        topic_id=topic.id,
        name=name,
        xp=xp,
        frequency=data.get("frequency") or "Daily",
        description=data.get("description") or "",
        active=bool(
            data.get("active", True)
        )
    )

    db.session.add(task)
    db.session.commit()

    return success_response(
        task.to_dict(),
        "Task created",
        201
    )


@tasks_bp.patch("/<int:task_id>")
@jwt_required()
def update_task(task_id):
    user = current_user()

    task = Task.query.filter_by(
        id=task_id,
        user_id=user.id
    ).first()

    if not task:
        return error_response(
            "Task not found",
            404
        )

    data = request.get_json(silent=True) or {}

    if "topicId" in data:
        topic = Topic.query.filter_by(
            id=int(data["topicId"]),
            user_id=user.id
        ).first()

        if not topic:
            return error_response(
                "Topic not found",
                404
            )

        task.topic_id = topic.id

    if "name" in data:
        name = str(data["name"]).strip()

        if not name:
            return error_response(
                "Task name cannot be empty",
                400
            )

        task.name = name

    if "xp" in data:
        try:
            task.xp = max(0, int(data["xp"]))
        except (TypeError, ValueError):
            return error_response(
                "XP must be a number",
                400
            )

    if "frequency" in data:
        task.frequency = str(
            data["frequency"]
        )

    if "description" in data:
        task.description = str(
            data["description"] or ""
        )

    if "active" in data:
        task.active = bool(
            data["active"]
        )

    db.session.commit()

    return success_response(
        task.to_dict(),
        "Task updated"
    )


@tasks_bp.delete("/<int:task_id>")
@jwt_required()
def delete_task(task_id):
    user = current_user()

    task = Task.query.filter_by(
        id=task_id,
        user_id=user.id
    ).first()

    if not task:
        return error_response(
            "Task not found",
            404
        )

    db.session.delete(task)
    db.session.commit()

    return success_response(
        {
            "ok": True
        },
        "Task deleted"
    )
