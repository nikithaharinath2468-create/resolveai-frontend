import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { registerUser } from '../services/api.js'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerUser({ fullName, email, password, phone })
      navigate('/login', { state: { successMessage: 'Account created — please sign in.' } })
    } catch (err) {
      const backendMessage = err?.response?.data?.detail
      setError(backendMessage || 'Could not create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <ShieldCheck size={26} className="text-pending" />
          <span className="font-display font-semibold text-xl text-white tracking-tight">ResolveAI</span>
        </div>

        <div className="bg-paper-raised rounded-2xl p-8 shadow-xl">
          <h1 className="font-display font-semibold text-xl text-ink mb-1">Create an account</h1>
          <p className="text-sm text-slate mb-6">Start filing and tracking your fraud cases.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-slate mb-1.5">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus:border-ink focus:ring-1 focus:ring-ink outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus:border-ink focus:ring-1 focus:ring-ink outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate mb-1.5">
                Password <span className="text-slate-light">(min. 8 characters)</span>
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus:border-ink focus:ring-1 focus:ring-ink outline-none"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-slate mb-1.5">
                Phone <span className="text-slate-light">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus:border-ink focus:ring-1 focus:ring-ink outline-none"
              />
            </div>

            {error && <p className="text-sm text-alert">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="text-sm text-slate text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}