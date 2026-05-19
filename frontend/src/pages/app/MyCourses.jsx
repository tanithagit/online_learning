import { useState, useEffect } from 'react'
import API from '../../services/api'

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const res = await API.get('/enrollments/my')
      setEnrollments(res.data)
    } catch (err) {
      setError('Failed to load enrollments')
    } finally {
      setLoading(false)
    }
  }

  const handleUnenroll = async (enrollmentId) => {
    try {
      await API.delete(`/enrollments/${enrollmentId}`)
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId))
    } catch (err) {
      setError('Failed to unenroll')
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Courses</h1>
      <p className="text-gray-500 mb-8">Courses you are enrolled in</p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {enrollments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-6xl mb-4">🎓</p>
          <p className="text-xl">You have not enrolled in any courses yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(enrollment => (
            <div key={enrollment.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📖
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {enrollment.course.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {enrollment.course.description || 'No description'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 text-sm font-medium">
                  ✅ Enrolled
                </span>
                <button
                  onClick={() => handleUnenroll(enrollment.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                >
                  Unenroll
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}