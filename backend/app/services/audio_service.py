import os
import json
import base64
import random
import string
from datetime import datetime
from flask import current_app
from app.models import AudioUser
from app import db
from nlp_processor import process_audio_file

def ensure_upload_folder():
    """Ensure the upload folder exists."""
    upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")  # Default to 'uploads' if not set
    if not os.path.exists(upload_folder):
        try:
            os.makedirs(upload_folder)
            current_app.logger.info(f"Created upload folder: {upload_folder}")
        except Exception as e:
            current_app.logger.error(f"Error creating upload folder: {e}")
            raise

def generate_random_filename(length=6):
    """Generate a random filename with the given length."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def save_audio_file(audio_file):
    """Saves the uploaded audio file and returns its filename."""
    try:
        ensure_upload_folder()
        
        upload_folder = current_app.config.get("UPLOAD_FOLDER", "static/uploads")
        unique_filename = f"{generate_random_filename()}.wav"
        audio_path = os.path.abspath(os.path.join(upload_folder, unique_filename))
        
        # Save file
        audio_file.save(audio_path)
        current_app.logger.info(f"File saved: {audio_path}")

        return unique_filename

    except Exception as e:
        current_app.logger.error(f"Error saving file: {e}")
        return None  # Or raise an exception if needed
    
def process_audio(audio_file, user_input, submitted_by):
    """Processes audio, transcribes it, and stores results in the database."""
    audio_filename = save_audio_file(audio_file)

    try:
        current_app.logger.info(f"Starting audio processing for {audio_filename}...")

        audio_path = os.path.join(current_app.config.get("UPLOAD_FOLDER", "static/uploads"), audio_filename)
        result = process_audio_file(audio_path)  # Might be failing here
        transcribed_text = result.get("transcribed_text", "")
        predicted_district = json.dumps(result.get("predicted_district", []))

        new_audio = AudioUser(
            user_input=user_input,
            audio_file=audio_filename,
            transcribed_text=transcribed_text,
            predicted_district=predicted_district,
            submitted_by=submitted_by,
            submission_status="Processed",
        )

        db.session.add(new_audio)
        db.session.commit()
        return new_audio

    except Exception as e:
        current_app.logger.error(f"Error processing audio: {e}")

        if os.path.exists(audio_path):
            os.remove(audio_path)  # Clean up failed uploads

        return None  # Or return a response with error details

def get_audio_history():
    """Fetches all audio records from the database."""
    records = AudioUser.query.all()

    history = []
    for record in records:
        try:
            # Check if the file exists
            if os.path.exists(record.audio_file):
                with open(record.audio_file, "rb") as f:
                    audio_data = base64.b64encode(f.read()).decode("utf-8")
            else:
                audio_data = None  # Or provide a placeholder/error message
        except Exception as e:
            current_app.logger.error(f"Error reading audio file {record.audio_file}: {e}")
            audio_data = None

        history.append({
            "id": record.id,
            "user_input": record.user_input,
            "audio_file": audio_data,
            "transcribed_text": record.transcribed_text,
            "predicted_district": json.loads(record.predicted_district) if record.predicted_district else [],
            "submitted_by": record.submitted_by,
            "submission_status": record.submission_status,
            "submitted_on": record.submitted_on.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return history

def cleanup_orphaned_records():
    """Removes database records for files that no longer exist."""
    records = AudioUser.query.all()
    for record in records:
        if not os.path.exists(record.audio_file):
            current_app.logger.warning(f"Deleting orphaned record for missing file: {record.audio_file}")
            db.session.delete(record)
    db.session.commit()
