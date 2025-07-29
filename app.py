import os
import logging
from flask import Flask, render_template, request, jsonify, session, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
import json
from openai_service import enhance_resume_content, generate_resume_suggestions
from pdf_generator import generate_resume_pdf
import tempfile

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///resume_generator.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

with app.app_context():
    import models
    db.create_all()

@app.route('/')
def index():
    """Main page with resume builder form"""
    return render_template('index.html')

@app.route('/enhance-content', methods=['POST'])
def enhance_content():
    """Enhance resume content using AI"""
    try:
        data = request.get_json()
        content_type = data.get('type')  # 'summary', 'experience', 'skills'
        content = data.get('content', '')
        
        if not content.strip():
            return jsonify({'error': 'Content cannot be empty'}), 400
        
        enhanced_content = enhance_resume_content(content_type, content)
        return jsonify({'enhanced_content': enhanced_content})
        
    except Exception as e:
        app.logger.error(f"Error enhancing content: {str(e)}")
        return jsonify({'error': 'Failed to enhance content. Please try again.'}), 500

@app.route('/get-suggestions', methods=['POST'])
def get_suggestions():
    """Get AI-powered suggestions for resume improvement"""
    try:
        data = request.get_json()
        resume_data = data.get('resume_data', {})
        
        suggestions = generate_resume_suggestions(resume_data)
        return jsonify({'suggestions': suggestions})
        
    except Exception as e:
        app.logger.error(f"Error getting suggestions: {str(e)}")
        return jsonify({'error': 'Failed to generate suggestions. Please try again.'}), 500

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    """Generate and download PDF resume"""
    try:
        data = request.get_json()
        resume_data = data.get('resume_data', {})
        template_style = data.get('template', 'modern')
        
        if not resume_data:
            return jsonify({'error': 'Resume data is required'}), 400
        
        # Generate PDF
        pdf_buffer = generate_resume_pdf(resume_data, template_style)
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(pdf_buffer.getvalue())
            tmp_file_path = tmp_file.name
        
        # Return file for download
        return send_file(
            tmp_file_path,
            as_attachment=True,
            download_name='resume.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        app.logger.error(f"Error generating PDF: {str(e)}")
        return jsonify({'error': 'Failed to generate PDF. Please try again.'}), 500

@app.route('/save-resume', methods=['POST'])
def save_resume():
    """Save resume data to session"""
    try:
        data = request.get_json()
        session['resume_data'] = data.get('resume_data', {})
        return jsonify({'success': True})
        
    except Exception as e:
        app.logger.error(f"Error saving resume: {str(e)}")
        return jsonify({'error': 'Failed to save resume data'}), 500

@app.route('/load-resume', methods=['GET'])
def load_resume():
    """Load resume data from session"""
    try:
        resume_data = session.get('resume_data', {})
        return jsonify({'resume_data': resume_data})
        
    except Exception as e:
        app.logger.error(f"Error loading resume: {str(e)}")
        return jsonify({'error': 'Failed to load resume data'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
