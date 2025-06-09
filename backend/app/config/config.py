import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:data@localhost:5432/nlp')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "datadialect3@gmail.com"
    MAIL_PASSWORD = "krrx faji mcst eckw"
    MAIL_DEFAULT_SENDER = "datadialect3@gmail.com"
