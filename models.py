from app import db
from datetime import datetime

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), nullable=False)
    personal_info = db.Column(db.Text)  # JSON string
    work_experience = db.Column(db.Text)  # JSON string
    education = db.Column(db.Text)  # JSON string
    skills = db.Column(db.Text)  # JSON string
    template_style = db.Column(db.String(50), default='modern')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'personal_info': self.personal_info,
            'work_experience': self.work_experience,
            'education': self.education,
            'skills': self.skills,
            'template_style': self.template_style,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
