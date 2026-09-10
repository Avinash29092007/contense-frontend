from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import Topic, User
from ..utils.responses import error_response, success_response


topics_bp = Blueprint(
    "topics",
    __name__,
    url_prefix="/api/topics"
)


def current_user():
    return User.query.get(
        int(get_jwt_identity())
    )


@topics_bp.get("")
@jwt_required()
def get_topics():
    user = current_user()

    topics = Topic.query.filter_by(
        user_id=user.id
    ).order_by(
        Topic.order.asc()
    ).all()

    return success_response(
        [topic.to_dict() for topic in topics]
    )


@topics_bp.post("")
@jwt_required()
def create_topic():
    user = current_user()

    data = request.get_json(silent=True) or {}

    name = str(data.get("name") or "").strip()

    if not name:
        return error_response(
            "Topic name is required",
            400
        )

    max_order = db.session.query(
        db.func.max(Topic.order)
    ).filter_by(
        user_id=user.id
    ).scalar()

    topic = Topic(
        user_id=user.id,
        name=name,
        color=data.get("color") or "accent",
        order=(max_order + 1) if max_order is not None else 0
    )

    db.session.add(topic)
    db.session.commit()

    return success_response(
        topic.to_dict(),
        "Topic created",
        201
    )


@topics_bp.patch("/<int:topic_id>")
@jwt_required()
def update_topic(topic_id):
    user = current_user()

    topic = Topic.query.filter_by(
        id=topic_id,
        user_id=user.id
    ).first()

    if not topic:
        return error_response(
            "Topic not found",
            404
        )

    data = request.get_json(silent=True) or {}

    if "name" in data:
        name = str(data["name"]).strip()

        if not name:
            return error_response(
                "Topic name cannot be empty",
                400
            )

        topic.name = name

    if "color" in data:
        topic.color = str(data["color"])

    if "order" in data:
        topic.order = int(data["order"])

    db.session.commit()

    return success_response(
        topic.to_dict(),
        "Topic updated"
    )


@topics_bp.put("/reorder")
@jwt_required()
def reorder_topics():
    user = current_user()

    data = request.get_json(silent=True) or {}

    ordered_ids = data.get("orderedIds") or []

    topics = Topic.query.filter_by(
        user_id=user.id
    ).all()

    topic_map = {
        str(topic.id): topic
        for topic in topics
    }

    for index, topic_id in enumerate(ordered_ids):
        topic = topic_map.get(str(topic_id))

        if topic:
            topic.order = index

    db.session.commit()

    topics = Topic.query.filter_by(
        user_id=user.id
    ).order_by(
        Topic.order.asc()
    ).all()

    return success_response(
        [topic.to_dict() for topic in topics],
        "Topics reordered"
    )


@topics_bp.delete("/<int:topic_id>")
@jwt_required()
def delete_topic(topic_id):
    user = current_user()

    topic = Topic.query.filter_by(
        id=topic_id,
        user_id=user.id
    ).first()

    if not topic:
        return error_response(
            "Topic not found",
            404
        )

    db.session.delete(topic)
    db.session.commit()

    return success_response(
        {
            "ok": True
        },
        "Topic deleted"
    )
