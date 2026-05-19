import { useState, useEffect } from 'react'
import API from '../../services/api'

export default function ManageCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      if (editCourse) {
        await API.put(`/courses/${editCourse.id}`, form)
        setMessage('Course updated successfully!')
      } else {
        await API.post('/courses/', form)
        setMessage('Course created successfully!')
      }
      setShowForm(false)
      setEditCourse(null)
      setForm({ title: '', description: '', price: 0 })
      fetchCourses()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save course')
    }
  }

  const handleEdit = (course) => {
    setEditCourse(course)
    setForm({
      title: course.title,
      description: course.description || '',
      price: course.price || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await API.delete(`/courses/${courseId}`)
      setMessage('Course deleted successfully!')
      fetchCourses()
    } catch (err) {
      setError('Failed to delete course')
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Courses</h1>
          <p className="text-gray-500">Create and manage courses</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditCourse(null)
            setForm({ title: '', description: '', price: 0 })
          }}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

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

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {editCourse ? 'Edit Course' : 'Create New Course'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Course description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              {editCourse ? 'Update Course' : 'Create Course'}
            </button>
          </form>
        </div>
      )}

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Description</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                  No courses yet. Create your first course!
                </td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                    {course.description || 'No description'}
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {course.price > 0 ? `$${course.price}` : 'Free'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
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