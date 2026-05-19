import { useState, useEffect } from 'react'
import { useAuth } from '../../store/AuthContext'
import API from '../../services/api'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses/')
      setCourses(res.data)
    } catch (err) {
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId)
    setMessage('')
    setError('')
    try {
      await API.post('/enrollments/', { course_id: courseId })
      setMessage('Successfully enrolled!')
    } catch (err) {
      setError(err.response?.data?.detail || 'Enrollment failed')
    } finally {
      setEnrolling(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Courses</h1>
      <p className="text-gray-500 mb-8">Explore our available courses</p>

      {message && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-6xl mb-4">📚</p>
          <p className="text-xl">No courses available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📖
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {course.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-indigo-600 font-semibold">
                  {course.price > 0 ? `$${course.price}` : 'Free'}
                </span>
                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrolling === course.id}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}