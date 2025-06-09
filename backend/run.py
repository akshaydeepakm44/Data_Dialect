import os
from app import create_app
from flask_mail import Mail
from flask_cors import CORS

app = create_app()

# Enable CORS for all routes
CORS(app)

# Initialize Mail
mail = Mail(app)

if __name__ == '__main__':
    app.run(host="0.0.0.0",port= 5000,debug=True)

