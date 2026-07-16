import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { fetchCases } from '../services/api.js'
import CaseCard from '../components/CaseCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCases().then((data) => {
      setCases(data)
      setLoading(false)
    })
  }, [])

  const activeCases = cases.filter((c) => c.status !== 'complaint_generated').length
  const totalAmount = cases.reduce((sum, c) => {
  const amt = Number(c.amount)
  return isNaN(amt) ? sum : sum + amt
}, 0)

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink">Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="text-sm text-slate mt-1">Here's the current state of your fraud cases.</p>
        </div>
        <button
          onClick={() => navigate('/cases/new')}
          className="flex items-center gap-2 bg-ink text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-ink-light transition-colors"
        >
          <Plus size={16} />
          New Case
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Open cases" value={activeCases} />
        <StatCard label="Total disputed amount" value={`₹${totalAmount.toLocaleString('en-IN')}`} />
        <StatCard label="Cases this month" value={cases.length} />
      </div>

      <h2 className="font-display font-semibold text-ink mb-4">Your cases</h2>

      {loading ? (
        <div className="flex items-center gap-2 text-slate text-sm py-12 justify-center">
          <Loader2 size={18} className="animate-spin" />
          Loading cases…
        </div>
      ) : cases.length === 0 ? (
        <EmptyState onCreate={() => navigate('/cases/new')} />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {cases.map((c) => (
            <CaseCard key={c.id} caseData={c} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-paper-raised border border-ink/10 rounded-xl p-5">
      <p className="text-xs text-slate mb-1">{label}</p>
      <p className="font-display font-semibold text-2xl text-ink">{value}</p>
    </div>
  )
}

function EmptyState({ onCreate }) {
  return (
    <div className="border-2 border-dashed border-ink/15 rounded-xl py-16 text-center">
      <p className="text-slate mb-4">No cases yet. Start by creating one from your evidence.</p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 bg-ink text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-ink-light transition-colors"
      >
        <Plus size={16} />
        Create your first case
      </button>
    </div>
  )
}
