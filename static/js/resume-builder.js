class ResumeBuilder {
    constructor() {
        this.resumeData = {
            personal_info: {},
            work_experience: [],
            education: [],
            skills: []
        };
        
        this.init();
        this.loadSavedData();
    }
    
    init() {
        this.bindEvents();
        this.addInitialExperience();
        this.addInitialEducation();
    }
    
    bindEvents() {
        // Personal info events
        document.getElementById('fullName').addEventListener('input', () => this.updatePreview());
        document.getElementById('email').addEventListener('input', () => this.updatePreview());
        document.getElementById('phone').addEventListener('input', () => this.updatePreview());
        document.getElementById('location').addEventListener('input', () => this.updatePreview());
        document.getElementById('linkedin').addEventListener('input', () => this.updatePreview());
        document.getElementById('summary').addEventListener('input', () => this.updatePreview());
        document.getElementById('skills').addEventListener('input', () => this.updatePreview());
        
        // Template selection
        document.querySelectorAll('input[name="template"]').forEach(radio => {
            radio.addEventListener('change', () => this.updatePreview());
        });
        
        // Enhancement buttons
        document.getElementById('enhanceSummary').addEventListener('click', () => this.enhanceContent('summary'));
        document.getElementById('enhanceSkills').addEventListener('click', () => this.enhanceContent('skills'));
        
        // Action buttons
        document.getElementById('addExperience').addEventListener('click', () => this.addExperience());
        document.getElementById('addEducation').addEventListener('click', () => this.addEducation());
        document.getElementById('getSuggestions').addEventListener('click', () => this.getSuggestions());
        document.getElementById('generatePDF').addEventListener('click', () => this.generatePDF());
        
        // Auto-save
        setInterval(() => this.saveData(), 30000); // Save every 30 seconds
    }
    
    addInitialExperience() {
        this.addExperience();
    }
    
    addInitialEducation() {
        this.addEducation();
    }
    
    addExperience() {
        const container = document.getElementById('workExperienceContainer');
        const index = container.children.length;
        
        const experienceHTML = `
            <div class="card mb-3 experience-entry" data-index="${index}">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Job Title *</label>
                            <input type="text" class="form-control job-title" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Company *</label>
                            <input type="text" class="form-control company" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Start Date</label>
                            <input type="text" class="form-control start-date" placeholder="MM/YYYY">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">End Date</label>
                            <input type="text" class="form-control end-date" placeholder="MM/YYYY or Present">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Job Description</label>
                        <div class="input-group">
                            <textarea class="form-control job-description" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
                            <button type="button" class="btn btn-outline-info enhance-experience">
                                <i class="fas fa-magic"></i>
                            </button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-outline-danger btn-sm remove-experience">
                        <i class="fas fa-trash me-1"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', experienceHTML);
        
        // Bind events for new experience entry
        const newEntry = container.lastElementChild;
        this.bindExperienceEvents(newEntry);
    }
    
    bindExperienceEvents(entry) {
        const inputs = entry.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });
        
        const enhanceBtn = entry.querySelector('.enhance-experience');
        enhanceBtn.addEventListener('click', () => {
            const description = entry.querySelector('.job-description').value;
            if (description.trim()) {
                this.enhanceContent('experience', entry.querySelector('.job-description'));
            } else {
                this.showAlert('Please enter a job description to enhance.', 'warning');
            }
        });
        
        const removeBtn = entry.querySelector('.remove-experience');
        removeBtn.addEventListener('click', () => {
            entry.remove();
            this.updatePreview();
        });
    }
    
    addEducation() {
        const container = document.getElementById('educationContainer');
        const index = container.children.length;
        
        const educationHTML = `
            <div class="card mb-3 education-entry" data-index="${index}">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Degree *</label>
                            <input type="text" class="form-control degree" placeholder="e.g., Bachelor of Science" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Institution *</label>
                            <input type="text" class="form-control institution" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Graduation Year</label>
                            <input type="text" class="form-control graduation-year" placeholder="YYYY">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">GPA (Optional)</label>
                            <input type="text" class="form-control gpa" placeholder="3.5/4.0">
                        </div>
                    </div>
                    <button type="button" class="btn btn-outline-danger btn-sm remove-education">
                        <i class="fas fa-trash me-1"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', educationHTML);
        
        // Bind events for new education entry
        const newEntry = container.lastElementChild;
        this.bindEducationEvents(newEntry);
    }
    
    bindEducationEvents(entry) {
        const inputs = entry.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });
        
        const removeBtn = entry.querySelector('.remove-education');
        removeBtn.addEventListener('click', () => {
            entry.remove();
            this.updatePreview();
        });
    }
    
    collectFormData() {
        // Personal info
        this.resumeData.personal_info = {
            full_name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            linkedin: document.getElementById('linkedin').value,
            summary: document.getElementById('summary').value
        };
        
        // Work experience
        this.resumeData.work_experience = [];
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const experience = {
                job_title: entry.querySelector('.job-title').value,
                company: entry.querySelector('.company').value,
                start_date: entry.querySelector('.start-date').value,
                end_date: entry.querySelector('.end-date').value,
                description: entry.querySelector('.job-description').value
            };
            
            if (experience.job_title || experience.company) {
                this.resumeData.work_experience.push(experience);
            }
        });
        
        // Education
        this.resumeData.education = [];
        document.querySelectorAll('.education-entry').forEach(entry => {
            const education = {
                degree: entry.querySelector('.degree').value,
                institution: entry.querySelector('.institution').value,
                graduation_year: entry.querySelector('.graduation-year').value,
                gpa: entry.querySelector('.gpa').value
            };
            
            if (education.degree || education.institution) {
                this.resumeData.education.push(education);
            }
        });
        
        // Skills
        const skillsText = document.getElementById('skills').value;
        this.resumeData.skills = skillsText ? skillsText.split(',').map(skill => skill.trim()).filter(skill => skill) : [];
        
        return this.resumeData;
    }
    
    updatePreview() {
        const data = this.collectFormData();
        const template = document.querySelector('input[name="template"]:checked').value;
        
        const preview = document.getElementById('resumePreview');
        
        let html = '';
        
        // Header
        if (data.personal_info.full_name) {
            html += `<div class="resume-header text-center mb-4">`;
            html += `<h2 class="mb-2">${data.personal_info.full_name}</h2>`;
            
            const contactInfo = [];
            if (data.personal_info.email) contactInfo.push(data.personal_info.email);
            if (data.personal_info.phone) contactInfo.push(data.personal_info.phone);
            if (data.personal_info.location) contactInfo.push(data.personal_info.location);
            if (data.personal_info.linkedin) contactInfo.push(`LinkedIn: ${data.personal_info.linkedin}`);
            
            if (contactInfo.length > 0) {
                html += `<p class="text-muted small">${contactInfo.join(' | ')}</p>`;
            }
            html += `</div>`;
        }
        
        // Summary
        if (data.personal_info.summary) {
            html += `<div class="resume-section mb-4">`;
            html += `<h5 class="section-title border-bottom pb-1 mb-2">PROFESSIONAL SUMMARY</h5>`;
            html += `<p class="small">${data.personal_info.summary}</p>`;
            html += `</div>`;
        }
        
        // Work Experience
        if (data.work_experience.length > 0) {
            html += `<div class="resume-section mb-4">`;
            html += `<h5 class="section-title border-bottom pb-1 mb-2">WORK EXPERIENCE</h5>`;
            
            data.work_experience.forEach(job => {
                if (job.job_title || job.company) {
                    html += `<div class="job-entry mb-3">`;
                    html += `<div class="d-flex justify-content-between align-items-start">`;
                    html += `<div>`;
                    if (job.job_title) html += `<strong>${job.job_title}</strong>`;
                    if (job.company) html += ` | ${job.company}`;
                    html += `</div>`;
                    if (job.start_date || job.end_date) {
                        html += `<small class="text-muted">${job.start_date} - ${job.end_date || 'Present'}</small>`;
                    }
                    html += `</div>`;
                    if (job.description) {
                        const descriptions = job.description.split('\n');
                        descriptions.forEach(desc => {
                            if (desc.trim()) {
                                html += `<p class="small mb-1">• ${desc.trim()}</p>`;
                            }
                        });
                    }
                    html += `</div>`;
                }
            });
            
            html += `</div>`;
        }
        
        // Education
        if (data.education.length > 0) {
            html += `<div class="resume-section mb-4">`;
            html += `<h5 class="section-title border-bottom pb-1 mb-2">EDUCATION</h5>`;
            
            data.education.forEach(edu => {
                if (edu.degree || edu.institution) {
                    html += `<div class="education-entry mb-2">`;
                    html += `<div class="d-flex justify-content-between">`;
                    html += `<div>`;
                    if (edu.degree) html += `<strong>${edu.degree}</strong>`;
                    if (edu.institution) html += ` | ${edu.institution}`;
                    html += `</div>`;
                    if (edu.graduation_year) {
                        html += `<small class="text-muted">${edu.graduation_year}</small>`;
                    }
                    html += `</div>`;
                    if (edu.gpa) {
                        html += `<p class="small mb-0">GPA: ${edu.gpa}</p>`;
                    }
                    html += `</div>`;
                }
            });
            
            html += `</div>`;
        }
        
        // Skills
        if (data.skills.length > 0) {
            html += `<div class="resume-section mb-4">`;
            html += `<h5 class="section-title border-bottom pb-1 mb-2">SKILLS</h5>`;
            html += `<p class="small">${data.skills.join(', ')}</p>`;
            html += `</div>`;
        }
        
        if (html === '') {
            html = `
                <div class="text-center text-muted">
                    <i class="fas fa-file-alt fa-3x mb-3"></i>
                    <p>Start filling out the form to see a live preview of your resume</p>
                </div>
            `;
        }
        
        preview.innerHTML = html;
    }
    
    async enhanceContent(type, targetElement = null) {
        let content = '';
        let element = targetElement;
        
        if (type === 'summary') {
            element = document.getElementById('summary');
            content = element.value;
        } else if (type === 'skills') {
            element = document.getElementById('skills');
            content = element.value;
        } else if (type === 'experience') {
            content = element.value;
        }
        
        if (!content.trim()) {
            this.showAlert('Please enter some content to enhance.', 'warning');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const response = await fetch('/enhance-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: type,
                    content: content
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                element.value = data.enhanced_content;
                this.updatePreview();
                this.showAlert('Content enhanced successfully!', 'success');
            } else {
                throw new Error(data.error || 'Failed to enhance content');
            }
        } catch (error) {
            console.error('Error enhancing content:', error);
            this.showAlert(error.message, 'danger');
        } finally {
            this.showLoading(false);
        }
    }
    
    async getSuggestions() {
        const data = this.collectFormData();
        
        if (!data.personal_info.full_name || !data.personal_info.email) {
            this.showAlert('Please fill in at least your name and email to get suggestions.', 'warning');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const response = await fetch('/get-suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resume_data: data
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.displaySuggestions(result.suggestions);
            } else {
                throw new Error(result.error || 'Failed to get suggestions');
            }
        } catch (error) {
            console.error('Error getting suggestions:', error);
            this.showAlert(error.message, 'danger');
        } finally {
            this.showLoading(false);
        }
    }
    
    displaySuggestions(suggestions) {
        const panel = document.getElementById('suggestionsPanel');
        const content = document.getElementById('suggestionsContent');
        
        if (!suggestions || suggestions.length === 0) {
            content.innerHTML = '<p class="text-muted">No suggestions available at this time.</p>';
        } else {
            let html = '';
            suggestions.forEach(suggestion => {
                const badgeClass = suggestion.priority === 'high' ? 'bg-danger' : 
                                 suggestion.priority === 'medium' ? 'bg-warning' : 'bg-info';
                
                html += `
                    <div class="alert alert-light border">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <strong class="text-capitalize">${suggestion.category}</strong>
                                <p class="mb-0 mt-1">${suggestion.suggestion}</p>
                            </div>
                            <span class="badge ${badgeClass} ms-2">${suggestion.priority}</span>
                        </div>
                    </div>
                `;
            });
            content.innerHTML = html;
        }
        
        panel.style.display = 'block';
    }
    
    async generatePDF() {
        const data = this.collectFormData();
        const template = document.querySelector('input[name="template"]:checked').value;
        
        if (!data.personal_info.full_name || !data.personal_info.email) {
            this.showAlert('Please fill in at least your name and email to generate a PDF.', 'warning');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const response = await fetch('/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resume_data: data,
                    template: template
                })
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${data.personal_info.full_name.replace(/\s+/g, '_')}_Resume.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showAlert('PDF generated successfully!', 'success');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showAlert(error.message, 'danger');
        } finally {
            this.showLoading(false);
        }
    }
    
    async saveData() {
        const data = this.collectFormData();
        
        try {
            await fetch('/save-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resume_data: data
                })
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
    
    async loadSavedData() {
        try {
            const response = await fetch('/load-resume');
            const data = await response.json();
            
            if (response.ok && data.resume_data) {
                this.populateForm(data.resume_data);
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
    
    populateForm(data) {
        // Personal info
        if (data.personal_info) {
            const personal = data.personal_info;
            if (personal.full_name) document.getElementById('fullName').value = personal.full_name;
            if (personal.email) document.getElementById('email').value = personal.email;
            if (personal.phone) document.getElementById('phone').value = personal.phone;
            if (personal.location) document.getElementById('location').value = personal.location;
            if (personal.linkedin) document.getElementById('linkedin').value = personal.linkedin;
            if (personal.summary) document.getElementById('summary').value = personal.summary;
        }
        
        // Work experience
        if (data.work_experience && data.work_experience.length > 0) {
            // Clear existing entries
            document.getElementById('workExperienceContainer').innerHTML = '';
            
            data.work_experience.forEach(job => {
                this.addExperience();
                const lastEntry = document.querySelector('.experience-entry:last-child');
                if (job.job_title) lastEntry.querySelector('.job-title').value = job.job_title;
                if (job.company) lastEntry.querySelector('.company').value = job.company;
                if (job.start_date) lastEntry.querySelector('.start-date').value = job.start_date;
                if (job.end_date) lastEntry.querySelector('.end-date').value = job.end_date;
                if (job.description) lastEntry.querySelector('.job-description').value = job.description;
            });
        }
        
        // Education
        if (data.education && data.education.length > 0) {
            // Clear existing entries
            document.getElementById('educationContainer').innerHTML = '';
            
            data.education.forEach(edu => {
                this.addEducation();
                const lastEntry = document.querySelector('.education-entry:last-child');
                if (edu.degree) lastEntry.querySelector('.degree').value = edu.degree;
                if (edu.institution) lastEntry.querySelector('.institution').value = edu.institution;
                if (edu.graduation_year) lastEntry.querySelector('.graduation-year').value = edu.graduation_year;
                if (edu.gpa) lastEntry.querySelector('.gpa').value = edu.gpa;
            });
        }
        
        // Skills
        if (data.skills && data.skills.length > 0) {
            document.getElementById('skills').value = data.skills.join(', ');
        }
        
        this.updatePreview();
    }
    
    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();
        
        const alertHTML = `
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertContainer.insertAdjacentHTML('beforeend', alertHTML);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
    
    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        spinner.classList.toggle('d-none', !show);
    }
}

// Initialize the resume builder when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ResumeBuilder();
});
