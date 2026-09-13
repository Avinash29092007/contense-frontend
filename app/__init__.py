from flask import Flask, jsonify

from .config import Config
from .extensions import cors, db, jwt, migrate


def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["CORS_ORIGINS"]
            }
        },
        supports_credentials=True
    )

    # Import models
    from . import models

    # Register routes
    from .routes import register_routes

    register_routes(app)

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "message": "Resource not found",
            "data": None
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "success": False,
            "message": "Method not allowed",
            "data": None
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "message": "Internal server error",
            "data": None
        }), 500

    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify({
            "success": False,
            "message": "Authentication token is required",
            "data": None
        }), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({
            "success": False,
            "message": "Invalid authentication token",
            "data": None
        }), 401

    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):
        return jsonify({
            "success": False,
            "message": "Authentication token has expired",
            "data": None
        }), 401

    return app
