import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import ModuleInitialization from './components/ModuleInitialization';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Candidate Routes */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/jobs"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <ModuleInitialization title="Browse Jobs" description="Connecting you to the next generation of career-defining opportunities." />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <ModuleInitialization title="Application Tracking" description="Analyze and optimize your job submission lifecycle in real-time." />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/interviews"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <ModuleInitialization title="Interview Terminal" description="Prepare for and execute high-stakes talent syncs with industry leaders." />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <ModuleInitialization title="Job Management" description="Maintain total control over your elite engineering recruitment directives." />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/new"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <ModuleInitialization title="Directive Launchpad" description="Craft and deploy high-visibility job requirements to our elite talent pool." />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/applications"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <ModuleInitialization title="Talent Pipeline" description="Review and filter high-caliber candidate submissions with ease." />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/interviews"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <ModuleInitialization title="Interview Scheduler" description="Sync your calendar and manage technical interview cycles at scale." />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
