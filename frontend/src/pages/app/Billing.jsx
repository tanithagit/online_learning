import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import API from '../../services/api'

export default function Billing() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('success')) {
      setMessage('🎉 Successfully upgraded to Pro!')
    }
    if (params.get('canceled')) {
      setError('Payment was canceled.')
    }
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await API.get('/billing/subscription')
      setSubscription(res.data)
    } catch (err) {
      setError('Failed to load subscription')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      const res = await API.post('/billing/create-checkout-session')
      window.location.href = res.data.checkout_url
    } catch (err) {
      setError('Failed to create checkout session')
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return
    try {
      await API.post('/billing/cancel')
      setMessage('Subscription canceled successfully')
      fetchSubscription()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to cancel subscription')
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Billing</h1>
      <p className="text-gray-500 mb-8">Manage your subscription</p>

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

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
        {/* Current Plan */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Current Plan</h2>
            <p className="text-gray-500 text-sm">Your active subscription</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
            subscription?.plan === 'pro'
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {subscription?.plan === 'pro' ? '⭐ Pro Plan' : '🆓 Free Plan'}
          </span>
        </div>

        {/* Plan Details */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-500">Plan</span>
            <span className="font-medium capitalize">{subscription?.plan || 'free'}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-500">Status</span>
            <span className={`font-medium capitalize ${
              subscription?.status === 'active' ? 'text-green-600' : 'text-red-600'
            }`}>
              {subscription?.status || 'active'}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-500">Enrollments</span>
            <span className="font-medium">
              {subscription?.plan === 'pro' ? 'Unlimited' : '2 max'}
            </span>
          </div>
          {subscription?.current_period_end && (
            <div className="flex justify-between py-3">
              <span className="text-gray-500">Next Billing</span>
              <span className="font-medium">
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {subscription?.plan === 'free' ? (
          <button
            onClick={handleUpgrade}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            ⭐ Upgrade to Pro — $9.99/month
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100"
          >
            Cancel Subscription
          </button>
        )}
      </div>
    </div>
  )
}