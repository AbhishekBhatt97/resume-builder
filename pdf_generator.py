from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
import io
from datetime import datetime

def generate_resume_pdf(resume_data, template_style='modern'):
    """
    Generate a PDF resume from resume data
    
    Args:
        resume_data: Dictionary containing all resume information
        template_style: Style template to use ('modern', 'classic', 'minimal')
    
    Returns:
        BytesIO buffer containing the PDF
    """
    buffer = io.BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Define custom styles based on template
    if template_style == 'modern':
        header_style = ParagraphStyle(
            'HeaderStyle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=6,
            textColor=colors.HexColor('#2c3e50'),
            alignment=TA_CENTER
        )
        section_style = ParagraphStyle(
            'SectionStyle',
            parent=styles['Heading2'],
            fontSize=14,
            spaceBefore=20,
            spaceAfter=10,
            textColor=colors.HexColor('#34495e'),
            borderWidth=1,
            borderColor=colors.HexColor('#bdc3c7'),
            borderPadding=5
        )
    elif template_style == 'classic':
        header_style = ParagraphStyle(
            'HeaderStyle',
            parent=styles['Heading1'],
            fontSize=22,
            spaceAfter=6,
            textColor=colors.black,
            alignment=TA_CENTER
        )
        section_style = ParagraphStyle(
            'SectionStyle',
            parent=styles['Heading2'],
            fontSize=12,
            spaceBefore=15,
            spaceAfter=8,
            textColor=colors.black
        )
    else:  # minimal
        header_style = ParagraphStyle(
            'HeaderStyle',
            parent=styles['Heading1'],
            fontSize=20,
            spaceAfter=6,
            textColor=colors.HexColor('#333333'),
            alignment=TA_LEFT
        )
        section_style = ParagraphStyle(
            'SectionStyle',
            parent=styles['Heading2'],
            fontSize=12,
            spaceBefore=15,
            spaceAfter=8,
            textColor=colors.HexColor('#555555')
        )
    
    content_style = ParagraphStyle(
        'ContentStyle',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=6,
        textColor=colors.black
    )
    
    # Build document content
    story = []
    
    # Personal Information Header
    personal_info = resume_data.get('personal_info', {})
    if personal_info:
        name = personal_info.get('full_name', 'Your Name')
        story.append(Paragraph(name, header_style))
        
        contact_info = []
        if personal_info.get('email'):
            contact_info.append(personal_info['email'])
        if personal_info.get('phone'):
            contact_info.append(personal_info['phone'])
        if personal_info.get('location'):
            contact_info.append(personal_info['location'])
        if personal_info.get('linkedin'):
            contact_info.append(f"LinkedIn: {personal_info['linkedin']}")
        
        if contact_info:
            contact_text = ' | '.join(contact_info)
            contact_style = ParagraphStyle(
                'ContactStyle',
                parent=styles['Normal'],
                fontSize=10,
                alignment=TA_CENTER,
                spaceAfter=15
            )
            story.append(Paragraph(contact_text, contact_style))
    
    # Professional Summary
    if personal_info.get('summary'):
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        story.append(Paragraph(personal_info['summary'], content_style))
        story.append(Spacer(1, 10))
    
    # Work Experience
    work_experience = resume_data.get('work_experience', [])
    if work_experience:
        story.append(Paragraph("WORK EXPERIENCE", section_style))
        
        for job in work_experience:
            if job.get('job_title') and job.get('company'):
                job_header = f"<b>{job['job_title']}</b> | {job['company']}"
                if job.get('start_date') or job.get('end_date'):
                    dates = f"{job.get('start_date', '')} - {job.get('end_date', 'Present')}"
                    job_header += f" | {dates}"
                
                story.append(Paragraph(job_header, content_style))
                
                if job.get('description'):
                    # Split description into bullet points if it contains line breaks
                    descriptions = job['description'].split('\n')
                    for desc in descriptions:
                        if desc.strip():
                            story.append(Paragraph(f"• {desc.strip()}", content_style))
                
                story.append(Spacer(1, 8))
    
    # Education
    education = resume_data.get('education', [])
    if education:
        story.append(Paragraph("EDUCATION", section_style))
        
        for edu in education:
            if edu.get('degree') and edu.get('institution'):
                edu_header = f"<b>{edu['degree']}</b> | {edu['institution']}"
                if edu.get('graduation_year'):
                    edu_header += f" | {edu['graduation_year']}"
                
                story.append(Paragraph(edu_header, content_style))
                
                if edu.get('gpa'):
                    story.append(Paragraph(f"GPA: {edu['gpa']}", content_style))
                
                story.append(Spacer(1, 8))
    
    # Skills
    skills = resume_data.get('skills', [])
    if skills:
        story.append(Paragraph("SKILLS", section_style))
        
        # Group skills or display as comma-separated list
        if isinstance(skills, list):
            skills_text = ', '.join([skill.strip() for skill in skills if skill.strip()])
        else:
            skills_text = str(skills)
        
        story.append(Paragraph(skills_text, content_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer

def get_available_templates():
    """Return list of available resume templates"""
    return [
        {
            'id': 'modern',
            'name': 'Modern',
            'description': 'Clean design with color accents and modern typography'
        },
        {
            'id': 'classic',
            'name': 'Classic',
            'description': 'Traditional black and white layout, professional and timeless'
        },
        {
            'id': 'minimal',
            'name': 'Minimal',
            'description': 'Simple, clean design focusing on content over styling'
        }
    ]
