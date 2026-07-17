import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../3_context/auth_context'
import { UserPlus } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', full_name: '', phone: '', address: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-gray-500">Join Smart Mart today</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" className="input-field" required
            value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          <input type="email" placeholder="Email" className="input-field" required
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Password" className="input-field" required
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <input type="text" placeholder="Full Name" className="input-field"
            value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
          <input type="tel" placeholder="Phone" className="input-field"
            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea placeholder="Address" className="input-field" rows="2"
            value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full btn-primary py-3">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}