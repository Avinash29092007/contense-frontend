from datetime import date

from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..models import Completion, Task, Topic, User
from ..services import calculate_streaks
from ..utils.responses import error_response, success_response


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api"
)


@dashboard_bp.get("/snapshot")
@jwt_required()
def get_snapshot():
    user_id = int(
        get_jwt_identity()
    )

    user = User.query.get(user_id)

    if not user:
        return error_response(
            "User not found",
            404
        )

    topics = Topic.query.filter_by(
        user_id=user.id
    ).order_by(
        Topic.order.asc()
    ).all()

    tasks = Task.query.filter_by(
        user_id=user.id
    ).all()

    completions = Completion.query.filter_by(
        user_id=user.id
    ).all()

    streaks = calculate_streaks(
        completions
    )

    return success_response(
        {
            "user": user.to_dict(
                current_streak=streaks["current"],
                longest_streak=streaks["longest"]
            ),
            "topics": [
                topic.to_dict()
                for topic in topics
            ],
            "tasks": [
                task.to_dict()
                for task in tasks
            ],
            "completions": [
                completion.to_dict()
                for completion in completions
            ],
            "onboarded": user.onboarded,
        }
    )


@dashboard_bp.get("/stats")
@jwt_required()
def get_stats():
    user_id = int(
        get_jwt_identity()
    )

    user = User.query.get(user_id)

    if not user:
        return error_response(
            "User not found",
            404
        )

    tasks = Task.query.filter_by(
        user_id=user.id
    ).all()

    completions = Completion.query.filter_by(
        user_id=user.id
    ).all()

    today = date.today()

    todays_completions = [
        completion
        for completion in completions
        if completion.date == today
    ]

    active_tasks = [
        task
        for task in tasks
        if task.active
    ]

    today_xp = sum(
        task.xp
        for task in active_tasks
        if any(
            c.task_id == task.id
            for c in todays_completions
        )
    )

    completion_percentage = (
        round(
            len(todays_completions)
            / len(active_tasks)
            * 100
        )
        if active_tasks
        else 0
    )

    streaks = calculate_streaks(
        completions
    )

    return success_response(
        {
            "totalXp": user.total_xp,
            "todayXp": today_xp,
            "todayCompletionPercentage": completion_percentage,
            "currentStreak": streaks["current"],
            "longestStreak": streaks["longest"],
            "totalTasks": len(tasks),
            "activeTasks": len(active_tasks),
            "totalCompletions": len(completions),
        }
    )
