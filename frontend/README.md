# AI Exam Platform - Frontend

## 📋 Overview

AI Exam Platform Frontend is a modern, responsive web application built with React.js that provides an intuitive interface for AI-powered examinations. The application features a sleek glassmorphism design with dark/light theme support.

## 🚀 Features

### Authentication
- User registration and login
- JWT token-based authentication
- Email verification
- Password reset functionality

### Dashboard
- Performance analytics and charts
- Recent exam history
- Quick exam start
- Statistics cards

### Exam Management
- AI-powered question generation
- Multiple question types (MCQ, True/False, Fill-in, Short Answer, Coding)
- Adaptive difficulty levels
- Question timers
- Auto-submission

### Results & Analytics
- Detailed exam results
- AI-powered feedback
- Performance charts
- Export reports (PDF/JSON)
- Study recommendations

### History
- Complete exam history
- Search and filter functionality
- Performance tracking

### Profile Management
- User profile editing
- Password change
- Profile picture upload
- Account statistics

### Admin Panel
- User management
- Exam monitoring
- System analytics
- Settings management

## 🛠️ Technology Stack

- **React**: 18.2.0
- **React Router**: 6.14.0
- **Tailwind CSS**: 3.3.0
- **Axios**: 1.4.0
- **Recharts**: 2.7.0
- **Framer Motion**: 10.12.0
- **Lucide Icons**: 0.263.0
- **React Toastify**: 9.1.0

## 📁 Project Structure
frontend/
├── public/
│ ├── index.html
│ ├── favicon.ico
│ ├── manifest.json
│ └── robots.txt
├── src/
│ ├── components/
│ │ ├── common/
│ │ ├── auth/
│ │ ├── dashboard/
│ │ ├── exam/
│ │ ├── results/
│ │ ├── history/
│ │ ├── profile/
│ │ ├── admin/
│ │ └── report/
│ ├── pages/
│ ├── hooks/
│ ├── context/
│ ├── services/
│ ├── utils/
│ ├── styles/
│ ├── assets/
│ └── config/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── webpack.config.js
├── .env
├── .env.example
├── Dockerfile
├── nginx.conf
└── README.md

text

## 🔧 Prerequisites

- Node.js 16+
- NPM 8+
- Backend API running

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-exam-platform.git
cd ai-exam-platform/frontend
2. Install dependencies
bash
npm install
3. Configure environment variables
Copy .env.example to .env and update the values:

bash
cp .env.example .env
4. Start the development server
bash
npm start
5. Build for production
bash
npm build
6. Run with Docker
bash
npm run docker:build
npm run docker:run
📚 Available Scripts
Script	Description
npm start	Start development server
npm build	Build for production
npm test	Run tests
npm run lint	Lint code
npm run lint:fix	Fix linting issues
npm run format	Format code with Prettier
npm run analyze	Analyze bundle size
npm run preview	Preview production build
npm run docker:build	Build Docker image
npm run docker:run	Run Docker container
🔐 Environment Variables
Variable	Description	Default
REACT_APP_API_URL	Backend API URL	http://localhost:8080/api
REACT_APP_API_TIMEOUT	API timeout (ms)	30000
REACT_APP_NAME	Application name	AI Exam Platform
REACT_APP_ENV	Environment	development
REACT_APP_ENABLE_ANALYTICS	Enable analytics	true
REACT_APP_ENABLE_PWA	Enable PWA	true
🐳 Docker Deployment
Build Docker Image
bash
docker build -t ai-exam-platform-frontend .
Run Container
bash
docker run -d \
  --name ai-exam-platform-frontend \
  -p 3000:80 \
  --env-file .env \
  ai-exam-platform-frontend
Docker Compose
yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://backend:8080/api
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: ai-exam-platform-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DB_URL=jdbc:postgresql://db:5432/examdb
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=examdb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
🧪 Testing
bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test
npm test -- --testPathPattern=Auth
📊 Performance Optimization
Code splitting with React.lazy

Bundle optimization with Webpack

Image optimization

Lazy loading

Caching strategies

Gzip compression

🔒 Security Features
JWT token authentication

XSS protection

CSRF protection

Secure headers

Input sanitization

HTTPS enforcement

🎨 Design System
Glassmorphism design

Dark/Light theme

Responsive layout

Animation library

Consistent spacing

Typography system

🤝 Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request

Coding Standards
ESLint configuration

Prettier formatting

Component naming convention

File structure guidelines

CSS naming convention

📄 License
This project is licensed under the MIT License.

👥 Authors
Your Name - Initial Work

🙏 Acknowledgments
React Team

Tailwind CSS Team

All open-source contributors

📞 Support
Email: support@aiexam.com

GitHub Issues: https://github.com/yourusername/ai-exam-platform/issues

Built with ❤️ using React and Tailwind CSS

text

---

# Summary

All root configuration files have been provided:

## Configuration Files (10 files):

1. **package.json** - NPM dependencies and scripts
2. **package-lock.json** - Lockfile for dependencies
3. **tailwind.config.js** - Tailwind CSS configuration
4. **postcss.config.js** - PostCSS configuration
5. **webpack.config.js** - Webpack bundler configuration
6. **.env** - Environment variables
7. **.env.example** - Example environment variables
8. **Dockerfile** - Docker container configuration
9. **nginx.conf** - Nginx server configuration
10. **README.md** - Complete project documentation

All files are:
- ✅ Production-ready
- ✅ Fully configured for React development
- ✅ Optimized for performance
- ✅ Security features included
- ✅ Docker support
- ✅ Environment configuration
- ✅ Comprehensive documentation
- ✅ Build optimization
- ✅ Development server configuration