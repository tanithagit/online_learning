import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">LearnHub</h1>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          Learn Without Limits
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Access hundreds of courses from expert instructors.
          Start free or upgrade to Pro for unlimited access.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700">
            Start Learning Free
          </Link>
          <Link to="/login" className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl text-lg font-semibold hover:bg-indigo-50">
            Sign In
          </Link>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Simple Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h4 className="text-2xl font-bold text-gray-800 mb-2">Free</h4>
            <p className="text-4xl font-bold text-indigo-600 mb-6">$0<span className="text-lg text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> Access to all courses
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> Up to 2 enrollments
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <span className="text-red-400">✗</span> Unlimited enrollments
              </li>
            </ul>
            <Link to="/register" className="block text-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50">
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-indigo-600 rounded-2xl shadow-lg p-8 text-white">
            <h4 className="text-2xl font-bold mb-2">Pro</h4>
            <p className="text-4xl font-bold mb-6">$9.99<span className="text-lg text-indigo-200">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span> Access to all courses
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span> Unlimited enrollments
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span> Priority support
              </li>
            </ul>
            <Link to="/register" className="block text-center px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50">
              Get Started Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}