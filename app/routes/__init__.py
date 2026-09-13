from .auth import auth_bp
from .users import users_bp
from .topics import topics_bp
from .tasks import tasks_bp
from .completions import completions_bp
from .dashboard import dashboard_bp
from .notes import notes_bp


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(topics_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(completions_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(notes_bp)

    @app.get("/api/health")
    def health():
        return {
            "success": True,
            "message": "Contense API is running",
            "data": {
                "status": "ok"
            }
        }
