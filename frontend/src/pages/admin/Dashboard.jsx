import { useState, useEffect } from 'react'
import API from '../../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    subscriptions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [users, courses, enrollments, subscriptions] = await Promise.all([
        API.get('/admin/users'),
        API.get('/courses/'),
        API.get('/admin/enrollments'),
        API.get('/admin/subscriptions'),
      ])
      setStats({
        users: users.data.length,
        courses: courses.data.length,
        enrollments: enrollments.data.length,
        subscriptions: subscriptions.data.length
      })
    } catch (err) {
      console.error('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    { label: 'Total Users', value: stats.users, icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Courses', value: stats.courses, icon: '📚', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Enrollments', value: stats.enrollments, icon: '🎓', color: 'bg-green-50 text-green-600' },
    { label: 'Subscriptions', value: stats.subscriptions, icon: '💳', color: 'bg-purple-50 text-purple-600' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome to the admin panel</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}