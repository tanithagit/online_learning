import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'

// Layouts
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

// User pages
import Courses from './pages/app/Courses'
import MyCourses from './pages/app/MyCourses'
import Profile from './pages/app/Profile'
import Billing from './pages/app/Billing'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import ManageCourses from './pages/admin/ManageCourses'
import Enrollments from './pages/admin/Enrollments'
import Subscriptions from './pages/admin/Subscriptions'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User panel routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/courses" replace />} />
            <Route path="courses" element={<Courses />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="profile" element={<Profile />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          {/* Admin panel routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="enrollments" element={<Enrollments />} />
            <Route path="subscriptions" element={<Subscriptions />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}