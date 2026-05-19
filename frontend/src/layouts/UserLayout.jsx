import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function UserLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/app/courses', label: '📚 Courses' },
    { path: '/app/my-courses', label: '🎓 My Courses' },
    { path: '/app/billing', label: '💳 Billing' },
    { path: '/app/profile', label: '👤 Profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/app/courses" className="text-2xl font-bold text-indigo-600">
            LearnHub
          </Link>
          <div className="flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-sm ${
                  location.pathname === link.path
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}