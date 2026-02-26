import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header';
import CourseDetail from './pages/CourseDetail';
import CourseDetailPage from './pages/CourseDetailPage';
import Courses from './pages/Courses';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import SectionManagement from './pages/SectionManagement';
import CourseMange from './pages/CourseMange';
import './styles/Auth.css';
import './styles/Profile.css';
import './styles/CreateCourse.css';
import './styles/EditCourse.css';
import './styles/InstructorDashboard.css';
import './styles/StudentDashboard.css';
import './styles/Courses.css';
import './styles/CourseDetail.css';
import './styles/SectionManagement.css';

const theme = createTheme();

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" />;
}

// Home Route - Shows login if not authenticated, otherwise shows dashboard
function HomeRoute() {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!token) {
    return <Login />;
  }
  
  // Redirect to appropriate dashboard based on role
  if (user?.role === "instructor") {
    return <InstructorDashboard />;
  } else {
    return <StudentDashboard />;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = window.location.pathname;

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  // Hide header on login and register pages
  const hideHeader = location === '/login' || location === '/register';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!hideHeader && <Header user={user} setUser={setUser} />}
      <Routes>
        {/* Home page shows login if not authenticated, dashboard if authenticated */}
        <Route path="/" element={<HomeRoute />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<CourseDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/instructor-dashboard" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/create-course" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path="/course/:courseId/edit" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
        <Route path="/course/:courseId/manage" element={<ProtectedRoute><CourseMange /></ProtectedRoute>} />
        <Route path="/course/:courseId/sections" element={<ProtectedRoute><SectionManagement /></ProtectedRoute>} />

        {/* Old routes (kept for backward compatibility) */}
        <Route path="/courses/:id" element={<CourseDetail />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
