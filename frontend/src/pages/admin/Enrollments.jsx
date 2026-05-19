import { useState, useEffect } from 'react'
import API from '../../services/api'

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const res = await API.get('/admin/enrollments')
      setEnrollments(res.data)
    } catch (err) {
      setError('Failed to load enrollments')
    } finally {
      setLoading(false)
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Enrollments</h1>
      <p className="text-gray-500 mb-8">All course enrollments</p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Course</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Enrolled At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                  No enrollments found
                </td>
              </tr>
            ) : (
              enrollments.map(enrollment => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">#{enrollment.id}</td>
                  <td className="px-6 py-4 text-gray-800">
                    User #{enrollment.user_id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {enrollment.course?.title || `Course #${enrollment.course_id}`}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}