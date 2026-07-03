import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { loginUser, setAuthToken } from '../services/api.js'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user, token } = await loginUser(identifier, password)
      setAuthToken(token)
      login(user, token)
      navigate('/dashboard')
    } catch (err) {
      setError('Could not sign in. Check your email and password.')
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
          <h1 className="font-display font-semibold text-xl text-ink mb-1">Sign in</h1>
          <p className="text-sm text-slate mb-6">Access your fraud case dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-xs font-medium text-slate mb-1.5">
            Email or phone number
            </label>
             <input
              id="identifier"
              type="text"
             required
             value={identifier}
             onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or 9876543210"
  
                className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus:border-ink focus:ring-1 focus:ring-ink outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-slate-light text-center mt-6">
            Demo mode — any email and password will work.
          </p>
        </div>
      </div>
    </div>
  )
}
