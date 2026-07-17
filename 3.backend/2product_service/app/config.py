import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'smart-mart-secret-key-2024')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'postgresql://postgres:postgres@db:5432/smartmart'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False