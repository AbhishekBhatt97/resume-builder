from flask import Flask, request, jsonify
from openai_service import generate_resume_content, generate_cover_letter
from pdf_generator import create_resume_pdf, create_cover_letter_pdf

app = Flask(__name__)


@app.route('/generate', methods=['POST'])
def generate_documents():
    data = request.get_json()

    name = data.get("name")
    job_title = data.get("job_title")
    experience = data.get("experience")
    skills = data.get("skills")
    goals = data.get("goals")

    resume_text = generate_resume_content(name, job_title, experience, skills,
                                          goals)
    cover_letter_text = generate_cover_letter(name, job_title, experience,
                                              skills, goals)

    resume_pdf_path = create_resume_pdf(resume_text, name)
    cover_letter_pdf_path = create_cover_letter_pdf(cover_letter_text, name)

    return jsonify({
        "resume_path": resume_pdf_path,
        "cover_letter_path": cover_letter_pdf_path
    })


if __name__ == '__main__':
    app.run(debug=True)
