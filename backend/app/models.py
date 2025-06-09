from datetime import datetime
from app import db

class User(db.Model):
    __tablename__ = 'user'  # Ensure this matches the table you want
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    otp = db.Column(db.Integer, nullable=True)
    otp_expiry = db.Column(db.TIMESTAMP, nullable=True)
    date_created = db.Column(db.TIMESTAMP, default=datetime.utcnow)  # Updated type
    last_login = db.Column(db.TIMESTAMP, nullable=True)  # Updated type
    streak_count = db.Column(db.Integer, default=0)
    points = db.Column(db.Integer, default=0)  # New column for points
    first_name = db.Column(db.String(80), nullable=True)  # New column for first name
    last_name = db.Column(db.String(80), nullable=True)  # New column for last name
    organization = db.Column(db.String(120), nullable=True)  # New column for organization
    profession = db.Column(db.String(120), nullable=True)  # New column for profession
    linkedin = db.Column(db.String(120), nullable=True)  # New column for LinkedIn
    phone = db.Column(db.String(20), nullable=True)  # New column for phone number

    def __repr__(self):
        return f"<User {self.username}>"

class UserInput(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_input = db.Column(db.Text, nullable=False)
    city_town = db.Column(db.String(255), nullable=True)
    predicted_district = db.Column(db.String(255), nullable=True)
    
class VideoUser(db.Model):
    __tablename__ = 'video_user'  # Correct table name
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category = db.Column(db.Text, nullable=False)
    video_file = db.Column(db.String(255), nullable=False)  # Path to stored video (relative path)
    transcribed_text = db.Column(db.Text, nullable=True)
    predicted_district = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_on = db.Column(db.DateTime, onupdate=datetime.utcnow)
    submitted_on = db.Column(db.DateTime, default=datetime.utcnow)
    confidence_score = db.Column(db.Float, nullable=True)
    submitted_by = db.Column(db.String(80), nullable=False)
    submission_status = db.Column(db.String(50), nullable=False, default="Pending")

    def __repr__(self):
        return f"<VideoUser id={self.id}, submitted_by={self.submitted_by}, status={self.submission_status}>"
    
    
class AudioUser(db.Model):
    __tablename__ = 'audio_user'  # Ensure this matches your actual table name
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_input = db.Column(db.Text, nullable=False)  # The original text input (if any)
    audio_file = db.Column(db.String(255), nullable=False)  # Path to stored audio file (relative path)
    transcribed_text = db.Column(db.Text, nullable=True)  # Transcription of the audio
    predicted_district = db.Column(db.String(255), nullable=True)  # NLP model predictions
    category = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Record creation timestamp
    updated_on = db.Column(db.DateTime, onupdate=datetime.utcnow)  # Last updated timestamp
    submitted_on = db.Column(db.DateTime, default=datetime.utcnow)  # Submission timestamp
    submitted_by = db.Column(db.String(80), nullable=False)  # User who submitted the audio
    submission_status = db.Column(db.String(50), nullable=False, default="Pending")

    def __repr__(self):
        return f"<AudioUser id={self.id}, submitted_by={self.submitted_by}, status={self.submission_status}>"
    
    
class Text(db.Model):
    __tablename__ = 'text'  # Ensure this matches your actual table name
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_input = db.Column(db.Text, nullable=False)  # The text input from the user
    city_town = db.Column(db.String(100), nullable=False)  # City/Town information
    predicted_district = db.Column(db.String(100), nullable=True)  # Predicted district
    category = db.Column(db.String(255), nullable=True)
    submitted_on = db.Column(db.DateTime, default=datetime.utcnow)  # Submission timestamp
    submitted_by = db.Column(db.String(80), nullable=False)  # User who submitted
    submission_status = db.Column(db.String(50), nullable=False, default="Pending")

    def __repr__(self):
        return f"<Text id={self.id}, submitted_by={self.submitted_by}, status={self.submission_status}>"