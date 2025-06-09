
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from app.models import User, VideoUser, AudioUser, Text
from app import db



from datetime import datetime, timedelta

def has_submitted_on_date(username, date):
    """Check if user submitted data on a specific date."""
    day_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
    day_end = day_start + timedelta(days=1)

    return (
        db.session.query(VideoUser.id)
        .filter(VideoUser.submitted_by == username, VideoUser.submitted_on >= day_start, VideoUser.submitted_on < day_end)
        .first()
        or
        db.session.query(AudioUser.id)
        .filter(AudioUser.submitted_by == username, AudioUser.submitted_on >= day_start, AudioUser.submitted_on < day_end)
        .first()
        or
        db.session.query(Text.id)
        .filter(Text.submitted_by == username, Text.submitted_on >= day_start, Text.submitted_on < day_end)
        .first()
    )

