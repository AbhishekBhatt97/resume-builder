import json
import os
from openai import OpenAI

# the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
# do not change this unless explicitly requested by the user
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def enhance_resume_content(content_type, content):
    """
    Enhance resume content using AI
    
    Args:
        content_type: Type of content ('summary', 'experience', 'skills', 'education')
        content: The original content to enhance
    
    Returns:
        Enhanced content string
    """
    prompts = {
        'summary': "Enhance this professional summary to be more compelling and impactful. Make it concise, achievement-focused, and tailored for modern job applications:",
        'experience': "Improve this work experience description by making it more specific, quantifiable, and achievement-oriented. Use strong action verbs and highlight measurable results:",
        'skills': "Organize and enhance this skills list to be more professional and relevant. Group related skills and use industry-standard terminology:",
        'education': "Enhance this education information to be more professional and highlight relevant achievements, coursework, or honors:"
    }
    
    prompt = prompts.get(content_type, "Improve this resume content to be more professional and impactful:")
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional resume writer with expertise in creating compelling, ATS-friendly resumes. Focus on clarity, impact, and professional language."
                },
                {
                    "role": "user",
                    "content": f"{prompt}\n\n{content}"
                }
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        return content.strip() if content else ""
        
    except Exception as e:
        raise Exception(f"Failed to enhance content: {str(e)}")

def generate_resume_suggestions(resume_data):
    """
    Generate AI-powered suggestions for improving the resume
    
    Args:
        resume_data: Dictionary containing all resume information
    
    Returns:
        List of suggestions
    """
    try:
        # Prepare resume summary for analysis
        resume_summary = f"""
        Personal Info: {resume_data.get('personal_info', {})}
        Work Experience: {resume_data.get('work_experience', [])}
        Education: {resume_data.get('education', [])}
        Skills: {resume_data.get('skills', [])}
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional career counselor and resume expert. Analyze the resume data and provide specific, actionable suggestions for improvement. Focus on content, structure, and impact. Respond with JSON in this format: {'suggestions': [{'category': 'category_name', 'suggestion': 'specific suggestion', 'priority': 'high/medium/low'}]}"
                },
                {
                    "role": "user",
                    "content": f"Analyze this resume and provide improvement suggestions:\n\n{resume_summary}"
                }
            ],
            response_format={"type": "json_object"},
            max_tokens=800,
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        if content:
            result = json.loads(content)
            return result.get('suggestions', [])
        return []
        
    except Exception as e:
        raise Exception(f"Failed to generate suggestions: {str(e)}")

def generate_professional_summary(resume_data):
    """
    Generate a professional summary based on resume data
    
    Args:
        resume_data: Dictionary containing resume information
    
    Returns:
        Generated professional summary
    """
    try:
        work_experience = resume_data.get('work_experience', [])
        skills = resume_data.get('skills', [])
        education = resume_data.get('education', [])
        
        context = f"""
        Work Experience: {work_experience}
        Skills: {skills}
        Education: {education}
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional resume writer. Create a compelling 2-3 sentence professional summary that highlights the candidate's key strengths, experience, and value proposition."
                },
                {
                    "role": "user",
                    "content": f"Based on this resume information, create a professional summary:\n\n{context}"
                }
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        return content.strip() if content else ""
        
    except Exception as e:
        raise Exception(f"Failed to generate professional summary: {str(e)}")
