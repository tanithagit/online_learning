import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/admin/dashboard', label: '📊 Dashboard' },
    { path: '/admin/courses', label: '📚 Courses' },
    { path: '/admin/users', label: '👥 Users' },
    { path: '/admin/enrollments', label: '🎓 Enrollments' },
    { path: '/admin/subscriptions', label: '💳 Subscriptions' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-white">
            LearnHub Admin
          </Link>
          <div className="flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-sm ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-indigo-800 text-white rounded-lg text-sm font-medium hover:bg-indigo-900"
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