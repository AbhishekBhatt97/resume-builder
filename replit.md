# AI Resume Generator

## Overview

This is a Flask-based web application that generates professional resumes using AI assistance. The application allows users to input their personal information, work experience, education, and skills, then uses OpenAI's GPT-4o model to enhance content and generate polished resumes in PDF format.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask web framework with SQLAlchemy ORM
- **Database**: SQLite (development) with PostgreSQL support for production via DATABASE_URL environment variable
- **Session Management**: Flask sessions with configurable secret key
- **Proxy Support**: ProxyFix middleware for deployment behind reverse proxies

### Frontend Architecture
- **Template Engine**: Jinja2 templates with Bootstrap 5 dark theme
- **UI Framework**: Bootstrap 5 with custom CSS styling
- **JavaScript**: Vanilla JavaScript with class-based architecture (ResumeBuilder)
- **Icons**: Font Awesome integration
- **Responsive Design**: Mobile-first approach with responsive grid layout

### AI Integration
- **Service**: OpenAI GPT-4o model for content enhancement
- **API Client**: Official OpenAI Python client
- **Content Types**: Supports enhancement of summaries, experience descriptions, skills, and education

### PDF Generation
- **Library**: ReportLab for PDF creation
- **Templates**: Multiple style options (modern, classic, minimal)
- **Format**: Professional resume layouts with proper typography and spacing

## Key Components

### Models (models.py)
- **Resume Model**: Stores user resume data with JSON fields for flexible content storage
- **Session-based**: Links resumes to user sessions for temporary storage
- **Timestamps**: Automatic creation and update tracking

### Services
1. **OpenAI Service (openai_service.py)**
   - Content enhancement for different resume sections
   - Configurable prompts for each content type
   - Error handling and API response processing

2. **PDF Generator (pdf_generator.py)**
   - Multi-template support for different resume styles
   - Professional formatting with proper spacing and typography
   - In-memory PDF generation for download

### Frontend Components
1. **Resume Builder (resume-builder.js)**
   - Class-based JavaScript architecture
   - Real-time preview updates
   - Auto-save functionality
   - Dynamic form field management

2. **Template System**
   - Base template with consistent navigation and styling
   - Modular design for easy extension
   - Dark theme implementation

## Data Flow

1. **User Input**: Users fill out resume forms in the web interface
2. **Real-time Preview**: JavaScript updates preview as users type
3. **AI Enhancement**: Optional AI-powered content improvement using OpenAI API
4. **Data Persistence**: Resume data stored in database linked to user session
5. **PDF Generation**: On-demand PDF creation with selected template style
6. **Download**: Generated PDF served as downloadable file

## External Dependencies

### Required Services
- **OpenAI API**: Requires OPENAI_API_KEY environment variable for content enhancement
- **Database**: SQLite for development, PostgreSQL for production

### Python Packages
- Flask and Flask-SQLAlchemy for web framework and ORM
- OpenAI client for AI integration
- ReportLab for PDF generation
- Werkzeug for WSGI utilities

### Frontend Dependencies
- Bootstrap 5 (CDN) for UI framework
- Font Awesome (CDN) for icons
- Custom CSS for resume-specific styling

## Deployment Strategy

### Environment Configuration
- **Development**: SQLite database, debug logging enabled
- **Production**: PostgreSQL via DATABASE_URL, configurable session secrets
- **Proxy Support**: Built-in support for deployment behind reverse proxies

### Required Environment Variables
- `OPENAI_API_KEY`: OpenAI API key for content enhancement
- `DATABASE_URL`: Database connection string (optional, defaults to SQLite)
- `SESSION_SECRET`: Flask session secret key (optional, has development default)

### Database Initialization
- Automatic table creation on application startup
- Schema migrations handled through SQLAlchemy model updates

### Static Assets
- CSS and JavaScript served from static directory
- CDN dependencies for external libraries
- Optimized for both development and production environments

The application is designed to be easily deployable on platforms like Replit, Heroku, or similar cloud platforms with minimal configuration requirements.