# AI-Powered Smart Exam Platform - Backend

## 📋 Overview

AI-Powered Smart Exam Platform is a modern, full-stack examination platform that leverages Artificial Intelligence to dynamically generate questions, evaluate answers, and provide personalized feedback. Built with Java 21 and Spring Boot, this platform offers a comprehensive solution for online assessments.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Email verification
- Password reset functionality
- Role-based access control (User/Admin)

### Exam Management
- AI-powered dynamic question generation
- Support for multiple question types (MCQ, True/False, Fill in the Blank, Short Answer, Coding)
- Adaptive difficulty levels (Easy, Medium, Hard)
- Individual question timers
- Auto-submission on timer expiry

### AI Integration
- OpenAI API integration for question generation
- AI-powered answer evaluation
- Semantic similarity checking for subjective answers
- Code quality evaluation for programming questions
- Personalized AI feedback generation

### Result & Analytics
- Comprehensive result dashboard
- Performance analytics and charts
- Detailed exam history with filtering and search
- AI-generated performance feedback
- PDF report export

### Admin Features
- User management
- System monitoring
- Usage analytics
- Popular topics and difficulty analysis

## 🛠️ Technology Stack

- **Java**: 21
- **Spring Boot**: 3.2.0
- **Spring Security**: 6.2.0
- **Spring Data JPA**: 3.2.0
- **Database**: PostgreSQL (Supabase)
- **JWT**: io.jsonwebtoken
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Build Tool**: Maven 3.9+
- **Container**: Docker

## 📁 Project Structure
backend/
├── src/
│ ├── main/
│ │ ├── java/
│ │ │ └── com/aiexam/
│ │ │ ├── AiExamPlatformApplication.java
│ │ │ ├── config/ # Configuration classes
│ │ │ │ ├── SecurityConfig.java
│ │ │ │ ├── JwtAuthenticationFilter.java
│ │ │ │ ├── CorsConfig.java
│ │ │ │ ├── OpenApiConfig.java
│ │ │ │ └── WebConfig.java
│ │ │ ├── controller/ # REST Controllers
│ │ │ │ ├── AuthController.java
│ │ │ │ ├── ExamController.java
│ │ │ │ ├── ResultController.java
│ │ │ │ ├── HistoryController.java
│ │ │ │ ├── DashboardController.java
│ │ │ │ ├── UserController.java
│ │ │ │ └── AdminController.java
│ │ │ ├── service/ # Business logic
│ │ │ │ ├── AuthService.java
│ │ │ │ ├── ExamService.java
│ │ │ │ ├── ResultService.java
│ │ │ │ ├── HistoryService.java
│ │ │ │ ├── DashboardService.java
│ │ │ │ ├── UserService.java
│ │ │ │ ├── AdminService.java
│ │ │ │ ├── AiService.java
│ │ │ │ ├── TimerService.java
│ │ │ │ ├── EvaluationService.java
│ │ │ │ ├── FeedbackService.java
│ │ │ │ ├── PdfExportService.java
│ │ │ │ └── EmailService.java
│ │ │ ├── repository/ # Data access
│ │ │ │ ├── UserRepository.java
│ │ │ │ └── ExamHistoryRepository.java
│ │ │ ├── model/ # Domain models
│ │ │ │ ├── User.java
│ │ │ │ ├── ExamHistory.java
│ │ │ │ ├── ExamRequest.java
│ │ │ │ ├── Question.java
│ │ │ │ ├── Answer.java
│ │ │ │ ├── Result.java
│ │ │ │ ├── DashboardData.java
│ │ │ │ ├── Feedback.java
│ │ │ │ ├── Analytics.java
│ │ │ │ └── enums/
│ │ │ │ ├── Difficulty.java
│ │ │ │ ├── QuestionType.java
│ │ │ │ ├── PerformanceRating.java
│ │ │ │ ├── UserRole.java
│ │ │ │ └── Status.java
│ │ │ ├── dto/ # Data transfer objects
│ │ │ │ ├── request/
│ │ │ │ │ ├── LoginRequest.java
│ │ │ │ │ ├── SignupRequest.java
│ │ │ │ │ ├── ExamRequestDto.java
│ │ │ │ │ ├── AnswerSubmitDto.java
│ │ │ │ │ ├── FeedbackRequest.java
│ │ │ │ │ └── ChangePasswordRequest.java
│ │ │ │ └── response/
│ │ │ │ ├── AuthResponse.java
│ │ │ │ ├── ExamResponse.java
│ │ │ │ ├── ResultResponse.java
│ │ │ │ ├── HistoryResponse.java
│ │ │ │ ├── DashboardResponse.java
│ │ │ │ ├── UserProfileResponse.java
│ │ │ │ └── ApiResponse.java
│ │ │ ├── exception/ # Custom exceptions
│ │ │ │ ├── GlobalExceptionHandler.java
│ │ │ │ ├── ResourceNotFoundException.java
│ │ │ │ ├── InvalidRequestException.java
│ │ │ │ ├── UnauthorizedException.java
│ │ │ │ └── AiGenerationException.java
│ │ │ ├── security/ # Security components
│ │ │ │ ├── JwtTokenProvider.java
│ │ │ │ ├── CustomUserDetailsService.java
│ │ │ │ └── RefreshTokenService.java
│ │ │ ├── util/ # Utility classes
│ │ │ │ ├── TimeUtil.java
│ │ │ │ ├── ScoreCalculator.java
│ │ │ │ ├── ValidationUtil.java
│ │ │ │ └── AiPromptBuilder.java
│ │ │ └── client/ # External API clients
│ │ │ └── OpenAiClient.java
│ │ └── resources/
│ │ ├── application.properties
│ │ ├── application-dev.properties
│ │ ├── application-prod.properties
│ │ ├── logback-spring.xml
│ │ └── templates/
│ │ ├── email-verification.html
│ │ ├── forgot-password.html
│ │ └── exam-report.html
│ └── test/ # Test classes
├── pom.xml # Maven configuration
├── Dockerfile # Docker configuration
└── README.md

text

## 🔧 Prerequisites

- JDK 21 or later
- Maven 3.9+
- PostgreSQL 14+
- Docker (optional)
- OpenAI API Key

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-exam-platform.git
cd ai-exam-platform/backend
2. Configure environment variables
Create a .env file in the backend directory:

env
DB_URL=jdbc:postgresql://localhost:5432/examdb
DB_USERNAME=postgres
DB_PASSWORD=password
JWT_SECRET=your-256-bit-secret-key-for-jwt-authentication
OPENAI_API_KEY=your-openai-api-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
3. Build and run
bash
# Using Maven
mvn clean install
mvn spring-boot:run

# Using Docker
docker build -t ai-exam-platform .
docker run -p 8080:8080 --env-file .env ai-exam-platform
4. Access the application
API Base URL: http://localhost:8080/api

Swagger UI: http://localhost:8080/api/swagger-ui.html

OpenAPI Docs: http://localhost:8080/api/v3/api-docs

📚 API Documentation
Authentication Endpoints
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login user
POST	/api/auth/refresh-token	Refresh JWT token
POST	/api/auth/verify-email	Verify email
POST	/api/auth/forgot-password	Request password reset
POST	/api/auth/reset-password	Reset password
POST	/api/auth/logout	Logout user
Exam Endpoints
Method	Endpoint	Description
POST	/api/exams/generate	Generate exam questions
POST	/api/exams/submit	Submit exam answers
POST	/api/exams/submit-single	Submit single answer
POST	/api/exams/auto-submit/{examId}	Auto-submit exam
GET	/api/exams/timer-settings	Get timer settings
GET	/api/exams/status/{examId}	Get exam status
POST	/api/exams/retry-generation	Retry AI generation
Result Endpoints
Method	Endpoint	Description
GET	/api/results/{id}	Get exam result
GET	/api/results/feedback/{resultId}	Get AI feedback
GET	/api/results/analytics/{resultId}	Get result analytics
GET	/api/results/performance-rating	Get performance rating
GET	/api/results/summary/{resultId}	Get result summary
POST	/api/results/export-pdf/{resultId}	Export PDF report
History Endpoints
Method	Endpoint	Description
GET	/api/history	Get exam history
GET	/api/history/{id}	Get specific history
GET	/api/history/topics	Get unique topics
GET	/api/history/difficulties	Get unique difficulties
GET	/api/history/stats	Get history statistics
GET	/api/history/search	Search history
GET	/api/history/filter-options	Get filter options
DELETE	/api/history/{id}	Delete history record
Dashboard Endpoints
Method	Endpoint	Description
GET	/api/dashboard	Get dashboard data
GET	/api/dashboard/weekly-performance	Get weekly performance
GET	/api/dashboard/difficulty-analysis	Get difficulty analysis
GET	/api/dashboard/question-type-analysis	Get question type analysis
GET	/api/dashboard/recent-exams	Get recent exams
GET	/api/dashboard/overall-stats	Get overall stats
GET	/api/dashboard/strength-weakness	Get strength/weakness
GET	/api/dashboard/subject-wise-performance	Get subject performance
User Endpoints
Method	Endpoint	Description
GET	/api/users/profile	Get user profile
PUT	/api/users/profile	Update user profile
POST	/api/users/change-password	Change password
POST	/api/users/upload-profile-picture	Upload profile picture
GET	/api/users/stats	Get user stats
GET	/api/users/best-topic	Get best topic
GET	/api/users/weak-topic	Get weak topic
DELETE	/api/users/account	Delete account
Admin Endpoints
Method	Endpoint	Description
GET	/api/admin/dashboard	Admin dashboard
GET	/api/admin/stats	Get admin stats
GET	/api/admin/users	Get all users
GET	/api/admin/exams	Get all exams
GET	/api/admin/analytics	Get analytics
GET	/api/admin/popular-topics	Get popular topics
GET	/api/admin/popular-difficulties	Get popular difficulties
GET	/api/admin/popular-question-types	Get popular question types
GET	/api/admin/ai-usage-stats	Get AI usage stats
GET	/api/admin/daily-active-users	Get daily active users
PUT	/api/admin/users/{userId}/role	Update user role
DELETE	/api/admin/users/{userId}	Delete user
DELETE	/api/admin/exams/{examId}	Delete exam
GET	/api/admin/system-health	Get system health
GET	/api/admin/performance-metrics	Get performance metrics
🗄️ Database Schema
Users Table
sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    role VARCHAR(20) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);
Exam History Table
sql
CREATE TABLE exam_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    question_type VARCHAR(20) NOT NULL,
    number_of_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    wrong_answers INTEGER NOT NULL,
    skipped_answers INTEGER NOT NULL,
    score INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    time_taken INTEGER NOT NULL,
    performance_rating VARCHAR(50),
    ai_feedback TEXT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
🔐 Environment Variables
Variable	Description	Default
DB_URL	Database URL	jdbc:postgresql://localhost:5432/examdb
DB_USERNAME	Database username	postgres
DB_PASSWORD	Database password	password
JWT_SECRET	JWT secret key	Required
JWT_EXPIRATION	JWT expiration time (ms)	86400000
REFRESH_TOKEN_EXPIRATION	Refresh token expiration (ms)	604800000
OPENAI_API_KEY	OpenAI API key	Required
OPENAI_API_MODEL	OpenAI model	gpt-3.5-turbo-16k
MAIL_HOST	SMTP host	smtp.gmail.com
MAIL_PORT	SMTP port	587
MAIL_USERNAME	SMTP username	Required
MAIL_PASSWORD	SMTP password	Required
APP_URL	Frontend URL	http://localhost:3000
RATE_LIMIT_REQUESTS_PER_MINUTE	Rate limit per minute	100
🧪 Testing
bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Run with coverage report
mvn clean test jacoco:report
📦 Docker Deployment
Build Docker Image
bash
docker build -t ai-exam-platform .
Run Container
bash
docker run -d \
  --name ai-exam-platform \
  -p 8080:8080 \
  --env-file .env \
  ai-exam-platform
Docker Compose
yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_URL=jdbc:postgresql://db:5432/examdb
      - DB_USERNAME=postgres
      - DB_PASSWORD=password
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=examdb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
🔒 Security Considerations
JWT tokens with short expiration times (24 hours)

Refresh token rotation for enhanced security

Password hashing using BCrypt (10 rounds)

Email verification required before login

Rate limiting on all API endpoints

CORS configuration for production environments

SQL injection prevention through JPA

XSS protection via input sanitization

Password complexity requirements (8+ chars, special chars, numbers)

HTTPS enforcement in production

Session management with secure cookies

📊 Performance Optimization
Connection pooling with HikariCP

JPA batch processing for bulk operations

Redis caching (optional)

Query optimization with indexes

Gzip compression for responses

Asynchronous email processing

Pagination for large datasets

Lazy loading for entity relationships

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Coding Standards
Follow Java naming conventions

Write unit tests for new features

Document public APIs with JavaDoc

Use Lombok annotations where appropriate

Follow REST API best practices

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Authors
Your Name - Initial Work - YourGitHub

🙏 Acknowledgments
OpenAI for providing the AI API

Spring Boot team for the excellent framework

All open-source libraries used in this project

The open-source community for their contributions

📞 Support
For support, email support@aiexam.com or create an issue in the repository.

🎯 Roadmap
Phase 1 (Completed)
✅ Basic authentication and authorization

✅ AI question generation

✅ Exam taking and evaluation

✅ Result and analytics

Phase 2 (In Progress)
🚧 Advanced AI integration

🚧 Mobile app development

🚧 Video proctoring

Phase 3 (Planned)
📅 Multi-language support

📅 Integration with LMS platforms

📅 Advanced analytics dashboard

📅 AI-powered study recommendations

📈 Monitoring and Logging
The application provides comprehensive monitoring and logging:

Log Levels
DEV: DEBUG level logging

PROD: INFO level logging with ERROR tracking

Monitoring Endpoints
Health check: /api/actuator/health

Metrics: /api/actuator/metrics

Info: /api/actuator/info

Log Files
application.log - General application logs

error.log - Error logs only

audit.log - Security audit logs

api.log - API access logs

🔄 CI/CD Pipeline
yaml
# Example GitHub Actions workflow
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      - name: Build with Maven
        run: mvn clean install
      - name: Run tests
        run: mvn test
      - name: Build Docker image
        run: docker build -t ai-exam-platform .
Built with ❤️ using Java 21 and Spring Boot