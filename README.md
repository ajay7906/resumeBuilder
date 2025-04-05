# AI Resume Builder

A modern web application that helps users create professional resumes with the assistance of AI. Built with React.js, Node.js, Express, and MongoDB.

## Features

- **User Authentication**
  - Secure login and signup system
  - JWT-based authentication
  - Protected routes and API endpoints

- **Resume Management**
  - Create and edit multiple resumes
  - Save and load resume templates
  - Export resumes to PDF format
  - Real-time preview

- **AI-Powered Assistance**
  - Smart suggestions for resume content
  - Content optimization recommendations
  - Skills and experience enhancement
  - ATS-friendly formatting

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- PDF export functionality

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- OpenAI API Integration

## Project Structure

```
ai-resume-builder/
├── client/                  # Frontend (React.js)
│   ├── public/              # Static files
│   │   ├── assets/          # Images, icons, fonts
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main pages
│   │   ├── styles/          # Global CSS/Tailwind config
│   │   ├── utils/           # Helpers (API calls, auth)
│   │   ├── App.js           # Main App router
│   │   └── index.js         # React entry point
│   └── package.json
│
├── server/                  # Backend (Node.js + Express)
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── .env                 # Environment variables
│   ├── server.js            # Express app entry
│   └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Create environment variables:
   - Create a `.env` file in the server directory
   - Add the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resume Management
- `GET /api/resumes` - Get all resumes for current user
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Features
- `POST /api/ai/suggest` - Get AI suggestions for resume content
- `POST /api/ai/optimize` - Optimize resume content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Ajay Kumar - aks969014@gmail.com

Project Link: [https://github.com/yourusername/ai-resume-builder](https://github.com/yourusername/ai-resume-builder) 
