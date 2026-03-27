# TalentBridge Pro

A MERN stack job portal web application with role-based authentication for candidates and recruiters.

## Features

### For Candidates
- 🔐 Secure authentication and profile management
- 🔍 Browse and search job opportunities
- 📝 Apply for jobs with custom cover letters
- 📊 Track application status
- 📅 View scheduled interviews
- 🤖 AI-powered resume builder (Coming Soon)
- 💡 Mock interview practice with AI (Coming Soon)

### For Recruiters
- 🔐 Secure authentication with company profile
- 📋 Post and manage job listings
- 👥 View and manage applications
- ✅ Shortlist candidates
- 📅 Schedule interviews
- 📝 Add interview feedback
- 📊 View recruitment statistics

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **React Icons** - Icons

## Project Structure

```
talentbridge-pro/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── interviewController.js
│   │   ├── resumeController.js (AI - placeholder)
│   │   └── mockInterviewController.js (AI - placeholder)
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── Interview.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── mockInterviewRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── candidate/
    │   │   │   └── CandidateDashboard.jsx
    │   │   └── recruiter/
    │   │       └── RecruiterDashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/talentbridge-pro
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (Recruiter)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs
- `PUT /api/jobs/:id` - Update job (Recruiter)
- `DELETE /api/jobs/:id` - Delete job (Recruiter)

### Applications
- `POST /api/applications` - Apply for job (Candidate)
- `GET /api/applications/my-applications` - Get candidate applications
- `GET /api/applications/job/:jobId` - Get job applications (Recruiter)
- `PUT /api/applications/:id/status` - Update application status (Recruiter)
- `DELETE /api/applications/:id` - Withdraw application (Candidate)

### Interviews
- `POST /api/interviews` - Schedule interview (Recruiter)
- `GET /api/interviews/my-interviews` - Get candidate interviews
- `GET /api/interviews/recruiter-interviews` - Get recruiter interviews
- `PUT /api/interviews/:id` - Update interview (Recruiter)
- `POST /api/interviews/:id/feedback` - Add feedback (Recruiter)

## User Roles

### Candidate
- Register/Login
- Browse jobs
- Apply for jobs
- Track applications
- View interview schedules
- Access AI tools (coming soon)

### Recruiter
- Register/Login with company details
- Post jobs
- View applications
- Shortlist candidates
- Schedule interviews
- Add interview feedback

## Default Test Users

After setting up, you can create test users through the register page or use the API.

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Uses Vite for hot module replacement
```

## Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - JWT expiration time
- `CLIENT_URL` - Frontend URL for CORS
- `OPENAI_API_KEY` - (Optional) For AI features

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Future Enhancements (AI Integration)

- **Resume Builder**: AI-powered resume suggestions and formatting
- **Mock Interviews**: AI-generated interview questions and feedback
- **Smart Job Matching**: AI-based job recommendations
- **Candidate Screening**: Automated initial screening

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@talentbridgepro.com or create an issue in the repository.

---

**TalentBridge Pro** - Connecting Talent with Opportunities 🌉
