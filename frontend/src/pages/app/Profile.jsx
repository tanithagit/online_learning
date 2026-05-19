import { useAuth } from '../../store/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.email}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user?.role === 'admin'
                ? 'bg-purple-100 text-purple-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 Student'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-gray-800 capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-500">Account Status</span>
            <span className="text-green-600 font-medium">✅ Active</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500">Member Since</span>
            <span className="font-medium text-gray-800">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}