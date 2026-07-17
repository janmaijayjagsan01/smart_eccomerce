import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'smart-mart-secret-key-2024')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'postgresql://postgres:postgres@db:5432/smartmart'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'smart-mart-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours