from flask_restx import Api, Resource, fields
import jwt
from .models import db, Users

rest_api = Api(version="1.0", title="User API")
signup_model = rest_api.model(
    "SignUpModel",
    {
        "username": fields.String(required=True, min_length=2, max_length=32),
        "email": fields.String(required=True, min_length=4, max_length=64),
        "password": fields.String(required=True, min_length=4, max_length=16),
    },
)
