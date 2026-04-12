import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Rooms from './pages/admin/Rooms';
import Students from './pages/admin/Students';
import Payments from './pages/admin/Payments';
import Complaints from './pages/admin/Complaints';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentOverview from './pages/student/StudentOverview';
import StudentPayments from './pages/student/StudentPayments';
import StudentComplaints from './pages/student/StudentComplaints';

const PrivateRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin" element={
            <PrivateRoute allowedRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }>
            <Route index element={<Rooms />} />
            <Route path="students" element={<Students />} />
            <Route path="payments" element={<Payments />} />
            <Route path="complaints" element={<Complaints />} />
          </Route>
          
          <Route path="/student" element={
            <PrivateRoute allowedRole="student">
              <StudentDashboard />
            </PrivateRoute>
          }>
            <Route index element={<StudentOverview />} />
            <Route path="payments" element={<StudentPayments />} />
            <Route path="complaints" element={<StudentComplaints />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
