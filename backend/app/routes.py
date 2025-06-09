import json
import uuid
from venv import logger
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from app import db
from app.models import UserInput
from werkzeug.security import check_password_hash, generate_password_hash
from flask_mail import Mail, Message
import random
import jwt
from jwt import encode, decode
from datetime import date, datetime, timedelta
import os
from app.models import User, Text, AudioUser, VideoUser
from app.services.text_service import detect_city, find_district
import logging
from app.services.audio_service import process_audio, save_audio_file, get_audio_history
from app.services.video_service import process_video_submission, VideoProcessingError
from app.services.streak_service import has_submitted_on_date
from datetime import datetime, timezone
import string
import urllib.parse

main = Blueprint('main', __name__)

mail = Mail()
SECRET_KEY = os.environ.get('SECRET_KEY', 'your_default_secret_key')

# Route to register a new user
@main.route('/register/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        new_user = User(
            username=data['username'],
            email=data['email'],
            password=hashed_password,
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201
        pass
    except Exception as e:
        import traceback
        traceback.print_exc()  # This prints the full stack trace
        return jsonify({"error": str(e)}), 500


@main.route('/user/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid password"}), 401

    user.last_login = datetime.now(timezone.utc)
    db.session.commit()

    token = jwt.encode({
        'sub': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=1)
    }, SECRET_KEY, algorithm='HS256')


    return jsonify({
        "message": "Login successful",
        "user_id": user.id,  # ✅ Include user_id in response
        "username": user.username,
        "token": token
    }), 200



@main.route('/user/details', methods=['GET'])
def get_user_details():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "date_created": user.date_created,
        "last_login": user.last_login,
        "streak_count": user.streak_count,
        "points": user.points,  # Include points in response
        "first_name": user.first_name,  # Include first name in response
        "last_name": user.last_name,  # Include last name in response
        "organization": user.organization,  # Include organization in response
        "profession": user.profession,  # Include profession in response
        "linkedin": user.linkedin,  # Include LinkedIn in response
        "phone": user.phone  # Include phone in response
    }

    return jsonify({"success": True, "user": user_data}), 200

# Route to send OTP for password reset
@main.route('/users/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Email not registered"}), 400

    otp = random.randint(100000, 999999)
    otp_expiry = datetime.utcnow() + timedelta(minutes=10)  # Set OTP expiry to 10 minutes

    user.otp = otp
    user.otp_expiry = otp_expiry
    db.session.commit()

    try:
        msg = Message('Your OTP for password reset', recipients=[email])
        msg.body = f'Your OTP is: {otp}. It expires in 10 minutes.'
        mail.send(msg)
        return jsonify({"message": "OTP sent to your email!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to verify OTP
@main.route('/users/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Email not registered"}), 400

    if user.otp != int(otp):
        return jsonify({"error": "Invalid OTP"}), 400

    if user.otp_expiry and user.otp_expiry < datetime.utcnow():
        return jsonify({"error": "OTP expired. Request a new one."}), 400

    # OTP is valid, clear it from the database
    user.otp = None
    user.otp_expiry = None
    db.session.commit()

    return jsonify({"message": "OTP verified! You can reset your password now."}), 200

# Route to reset the password
@main.route('/users/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Email not registered"}), 400

    hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password reset successful!"}), 200




# API to get count of users
@main.route('/count/users', methods=['GET'])
def count_users():
    user_count = db.session.query(User).count()
    return jsonify({'table': 'user', 'count': user_count})

# API to get count of text data entries
@main.route('/count/text', methods=['GET'])
def count_text():
    text_count = db.session.query(Text).count()
    return jsonify({'table': 'text_user', 'count': text_count})

# API to get count of audio data entries
@main.route('/count/audio', methods=['GET'])
def count_audio():
    audio_count = db.session.query(AudioUser).count()
    return jsonify({'table': 'audio_user', 'count': audio_count})

# API to get count of video data entries
@main.route('/count/video', methods=['GET'])
def count_video():
    video_count = db.session.query(VideoUser).count()
    return jsonify({'table': 'video_user', 'count': video_count})


# API to get total count of entries in Text, AudioUser, and VideoUser tables
@main.route('/count/total', methods=['GET'])
def count_total_entries():
    try:
        text_count = db.session.query(Text).count()
        audio_count = db.session.query(AudioUser).count()
        video_count = db.session.query(VideoUser).count()

        total_count = text_count + audio_count + video_count

        return jsonify({
            'text_count': text_count,
            'audio_count': audio_count,
            'video_count': video_count,
            'total_count': total_count
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@main.route('/count/users-today', methods=['GET'])
def count_users_logged_in_today():
    today_start = datetime.combine(date.today(), datetime.min.time())  # Start of today
    today_end = datetime.combine(date.today(), datetime.max.time())  # End of today

    user_count = db.session.query(User).filter(
        User.last_login >= today_start,
        User.last_login <= today_end
    ).count()

    return jsonify({'table': 'user', 'logged_in_today': user_count})

@main.route('/user/<string:username>', methods=['GET'])
def get_user(username):
    user = User.query.filter_by(username=username).first()
    if user:
        # Fetch data from Text, AudioUser, and VideoUser tables where submitted_by matches the username
        text_data = Text.query.filter_by(submitted_by=username).all()
        audio_data = AudioUser.query.filter_by(submitted_by=username).all()
        video_data = VideoUser.query.filter_by(submitted_by=username).all()

        # Convert query results to JSON format
        text_results = [{"id": t.id, "user_input": t.user_input, "category": t.category} for t in text_data]
        audio_results = [{"id": a.id, "user_input": a.user_input, "audio_file": a.audio_file} for a in audio_data]
        video_results = [{"id": v.id, "category": v.category, "video_file": v.video_file} for v in video_data]

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_created': user.date_created,
            'last_login': user.last_login,
            'streak_count': user.streak_count,
            'text_data': text_results,
            'audio_data': audio_results,
            'video_data': video_results
        }), 200
    return jsonify({'error': 'User not found'}), 404



@main.route('/streak', methods=['POST',"GET"])
def update_streak():
    """Update user's streak based on daily submissions."""
    data = request.get_json()
    user_id = data.get("user_id")  # Extract user_id from request body

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    username = user.username
    today = datetime.utcnow()
    yesterday = today - timedelta(days=1)

    submitted_today = has_submitted_on_date(username, today)
    submitted_yesterday = has_submitted_on_date(username, yesterday)

    if submitted_today:
        return jsonify({"message": "Streak remains the same, user already submitted today."})

    if submitted_yesterday:
        user.streak += 1  # Increase streak if yesterday was also submitted
    else:
        user.streak = 1  # Reset streak if there's a gap

    db.session.commit()
    return jsonify({"message": f"Streak updated to {user.streak}"})


@main.route('/user/submissions/count', methods=['GET'])
def get_submission_count():
    try:
        user_id = request.args.get('user_id', type=int)  # Ensure user_id is an integer
        
        if user_id is None:
            return jsonify({"error": "user_id is required"}), 400

        # Fetch the username for the given user_id
        user = User.query.filter_by(id=user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Query the Text table using the username
        text_count = Text.query.filter_by(submitted_by=user.username).count()

        return jsonify({"submission_count": text_count})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API for text data
@main.route('/process', methods=['POST'])
def process_input():
    data = request.get_json()
    user_input = data.get('user_input', '')
    category = data.get('category', '')
    submitted_by = data.get('name', 'Unknown')
    city_town = detect_city(user_input)
    predicted_district = find_district(city_town) if city_town else None

    new_entry = Text(
        user_input=user_input,
        city_town=city_town or "Unknown",
        predicted_district=predicted_district,
        submitted_by=submitted_by,
        submission_status="Pending",
        category=category
    )

    db.session.add(new_entry)
    db.session.commit()  # Commit the new entry first

    

    response = {
        "city_town": city_town,
        "predicted_district": predicted_district,
        "message": "Data successfully submitted for approval",
        "category": category,
        "submitted_by": submitted_by
    }
    return jsonify(response)

@main.route("/process-audio", methods=["POST"])
def upload_audio():
    if "audio" not in request.files or "submitted_by" not in request.form:
        return jsonify({"error": "Missing required fields (audio, submitted_by)"}), 400

    audio_file = request.files["audio"]
    submitted_by = request.form["submitted_by"]
    user_input = request.form.get("user_input", "")

    try:
        audio_record = process_audio(audio_file, user_input, submitted_by)
        audio_record.submission_status = "Pending"
        db.session.add(audio_record)
        db.session.commit()  # Commit the new entry first

      

        return jsonify({
            "message": "Audio successfully submitted for approval",
            "transcribed_text": audio_record.transcribed_text,
            "predicted_district": audio_record.predicted_district
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/pending-submissions', methods=['GET'])
def get_pending_submissions():
    try:
        # Fetch pending data from all three models
        pending_texts = Text.query.filter_by(submission_status="Pending").all()
        pending_audios = AudioUser.query.filter_by(submission_status="Pending").all()
        pending_videos = VideoUser.query.filter_by(submission_status="Pending").all()

        # Prepare the response data
        response = {
            "pending_texts": [
                {
                    "id": text.id,
                    "user_input": text.user_input,
                    "city_town": text.city_town,
                    "predicted_district": text.predicted_district,
                    "category": text.category,
                    "submitted_by": text.submitted_by,
                    "submitted_on": text.submitted_on
                }
                for text in pending_texts
            ],
            "pending_audios": [
                {
                    "id": audio.id,
                    "user_input": audio.user_input,
                    "audio_file": audio.audio_file,
                    "transcribed_text": audio.transcribed_text,
                    "predicted_district": audio.predicted_district,
                    "category": audio.category,
                    "submitted_by": audio.submitted_by,
                    "submitted_on": audio.submitted_on
                }
                for audio in pending_audios
            ],
            "pending_videos": [
                {
                    "id": video.id,
                    "category": video.category,
                    "video_file": video.video_file,
                    "transcribed_text": video.transcribed_text,
                    "predicted_district": video.predicted_district,
                    "submitted_by": video.submitted_by,
                    "submitted_on": video.submitted_on
                }
                for video in pending_videos
            ]
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#API for video model


UPLOAD_FOLDER = os.path.join(os.getcwd(), "static/uploads")
ALLOWED_EXTENSIONS = {"mp4", "mov", "avi", "mkv"}
def allowed_file(filename: str) -> bool:
    """Checks if file extension is allowed"""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_random_filename(length=6):
    """Generate a random filename with the given length."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@main.route("/upload", methods=["POST"])
def upload_video():
    try:
        if "video" not in request.files:
            return jsonify({"error": "No video file provided"}), 400

        video = request.files["video"]
        if video.filename == "" or not allowed_file(video.filename):
            return jsonify({"error": "Invalid or no selected file"}), 400

        # Generate unique filename
        filename = f"{generate_random_filename()}_{secure_filename(video.filename)}"
        video_path = os.path.join(UPLOAD_FOLDER, filename)

        # Save video in binary mode
        video.save(video_path)  # Save the video file as it is

        # Process the video submission
        user_input = request.form.get("user_input", "")
        submitted_by = request.form.get("submitted_by", "anonymous")
        result = process_video_submission(user_input, video_path, submitted_by)
        

        return jsonify({
            "message": "Video uploaded and processed successfully",
            "video_path": filename,  # Return the relative path
            "submission_status": "Processed",
            "prediction_district": result["prediction_district"],
            "confidence": result["confidence"],
            "transcribed_text": result["transcribed_text"]
        })

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@main.route('/static/uploads/<path:filename>', methods=['GET'])
def serve_video_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

#api for fecthing the data from the database

@main.route('/api/districts/<string:district_name>', methods=['GET'])
def get_data_by_district(district_name):
    try:
        # Fetch data based on predicted district
        text_data = Text.query.filter_by(predicted_district=district_name).all()
        audio_data = AudioUser.query.filter(AudioUser.predicted_district.contains(district_name)).all()
        video_data = VideoUser.query.filter_by(predicted_district=district_name).all()

        # Convert query results to JSON format
        text_results = [
            {
                "content": t.user_input,
                "category": t.category
            }
            for t in text_data
        ]

        audio_results = [
            {
                "file_path": a.audio_file,
                "category": a.user_input
            }
            for a in audio_data
        ]

        video_results = [
            {
                "file_path": v.video_file,
                "category": v.category
            }
            for v in video_data
        ]

        return jsonify({
            "district": district_name,
            "text": text_results,
            "audio": audio_results,
            "video": video_results
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error fetching data for district {district_name}: {e}")
        return jsonify({"error": str(e)}), 500

@main.route('/data/<string:type>', methods=['GET'])
def get_data(type):
    try:
        if type == 'text':
            data = Text.query.all()
        elif type == 'audio':
            data = AudioUser.query.all()
        elif type == 'video':
            data = VideoUser.query.all()
        else:
            return jsonify({"error": "Invalid data type"}), 400

        results = [
            {
                "id": item.id,
                "content": getattr(item, 'user_input', None) or getattr(item, 'file_path', None),
                 "file_path": f"/static/uploads/{item.video_file}" if type == 'video' else f"/static/uploads/{item.audio_file}" if type == 'audio' else None,
                "category": item.category if type == 'video' else None
            }
            for item in data
        ]

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/data/<string:type>/<int:id>', methods=['DELETE'])
def delete_data(type, id):
    try:
        if type == 'text':
            item = Text.query.get(id)
        elif type == 'audio':
            item = AudioUser.query.get(id)
        elif type == 'video':
            item = VideoUser.query.get(id)
        else:
            return jsonify({"error": "Invalid data type"}), 400

        if not item:
            return jsonify({"error": "Item not found"}), 404

        db.session.delete(item)
        db.session.commit()

        return jsonify({"message": "Item deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/data/<string:type>/<int:id>/approve', methods=['PUT'])
def approve_data(type, id):
    try:
        status = request.json.get('status')
        if status not in ['approved', 'rejected']:
            return jsonify({"error": "Invalid status"}), 400

        if type == 'text':
            item = Text.query.get(id)
        elif type == 'audio':
            item = AudioUser.query.get(id)
        elif type == 'video':
            item = VideoUser.query.get(id)
        else:
            return jsonify({"error": "Invalid data type"}), 400

        if not item:
            return jsonify({"error": "Item not found"}), 404

        item.submission_status = "Processed" if status == "approved" else "Pending"
        db.session.commit()

        return jsonify({"message": "Item submission status updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to check if username or email already exists
@main.route('/check-user', methods=['POST'])
def check_user():
    data = request.get_json()
    username = data.get('username').replace(' ', '')
    email = data.get('email')

    username_exists = User.query.filter_by(username=username).first() is not None
    email_exists = User.query.filter_by(email=email).first() is not None

    return jsonify({
        "exists": username_exists or email_exists,
        "usernameExists": username_exists,
        "emailExists": email_exists
    }), 200

@main.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    users = User.query.order_by(User.points.desc(), User.streak_count.desc()).all()
    leaderboard = [
        {
            "username": user.username,
            "streak_count": user.streak_count,
            "points": user.points
        }
        for user in users
    ]
    return jsonify({"leaderboard": leaderboard}), 200

@main.route('/user/update-points', methods=['POST'])
def update_points():
    data = request.get_json()
    username = data.get('username')
    points = data.get('points')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.points = points
    db.session.commit()

    return jsonify({"message": "Points updated successfully"}), 200

@main.route('/user/update-profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    user_id = data.get('user_id')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    organization = data.get('organization')  # Changed from college to organization
    profession = data.get('profession')
    linkedin = data.get('linkedin')
    phone = data.get('phone')

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.first_name = first_name
    user.last_name = last_name
    user.organization = organization  # Changed from college to organization
    user.profession = profession
    user.linkedin = linkedin
    user.phone = phone

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200