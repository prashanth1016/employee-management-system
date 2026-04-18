// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

// Public pages
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import Tasks from './pages/admin/Tasks';
import Requests from './pages/admin/Requests';
import Documents from './pages/admin/Documents';
import LeaveRequests from './pages/admin/LeaveRequests';
import Attendance from './pages/admin/Attendance';

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyTasks from './pages/employee/MyTasks';
import UploadDocument from './pages/employee/UploadDocument';
import MyDocuments from './pages/employee/MyDocuments';
import SendRequest from './pages/employee/SendRequest';
import LeaveRequest from './pages/employee/LeaveRequest';
import Profile from './pages/employee/Profile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={
          <PrivateRoute allowedRoles={['admin', 'employee']}>
            <ChangePassword />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/employees" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Employees />
          </PrivateRoute>
        } />
        <Route path="/admin/tasks" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Tasks />
          </PrivateRoute>
        } />
        <Route path="/admin/requests" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Requests />
          </PrivateRoute>
        } />
        <Route path="/admin/documents" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Documents />
          </PrivateRoute>
        } />
        <Route path="/admin/leave-requests" element={
          <PrivateRoute allowedRoles={['admin']}>
            <LeaveRequests />
          </PrivateRoute>
        } />
        <Route path="/admin/attendance" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Attendance />
          </PrivateRoute>
        } />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={
          <PrivateRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </PrivateRoute>
        } />
        <Route path="/employee/tasks" element={
          <PrivateRoute allowedRoles={['employee']}>
            <MyTasks />
          </PrivateRoute>
        } />
        <Route path="/employee/upload" element={
          <PrivateRoute allowedRoles={['employee']}>
            <UploadDocument />
          </PrivateRoute>
        } />
        <Route path="/employee/documents" element={
          <PrivateRoute allowedRoles={['employee']}>
            <MyDocuments />
          </PrivateRoute>
        } />
        <Route path="/employee/send-request" element={
          <PrivateRoute allowedRoles={['employee']}>
            <SendRequest />
          </PrivateRoute>
        } />
        <Route path="/employee/leave-request" element={
          <PrivateRoute allowedRoles={['employee']}>
            <LeaveRequest />
          </PrivateRoute>
        } />
        <Route path="/employee/profile" element={
          <PrivateRoute allowedRoles={['employee']}>
            <Profile />
          </PrivateRoute>
        } />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;