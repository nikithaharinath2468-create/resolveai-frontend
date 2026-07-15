import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Trash2 } from 'lucide-react'
import { fetchCases, deleteCase } from '../services/api.js'
import StatusBadge from '../components/StatusBadge.jsx'

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function CaseHistory() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchCases().then((data) => {
      setCases(data)
      setLoading(false)
    })
  }, [])
  async function handleDelete(e, caseId) {
  e.stopPropagation()
  const confirmed = window.confirm('Are you sure you want to delete this case?')
  if (!confirmed) return

  setDeletingId(caseId)
  await deleteCase(caseId)
  setCases((prev) => prev.filter((c) => c.id !== caseId))
  setDeletingId(null)
}
   const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-4xl">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Case history</h1>
      <p className="text-sm text-slate mb-8">All fraud cases you've filed.</p>
      <input
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search by case title or ID…"
  className="w-full max-w-sm rounded-lg border border-ink/15 px-3 py-2.5 text-sm mb-6 focus:border-ink focus:ring-1 focus:ring-ink outline-none"
/>

      {loading ? (
        <div className="flex items-center gap-2 text-slate text-sm py-12 justify-center">
          <Loader2 size={18} className="animate-spin" />
          Loading case history…
        </div>
      ) : (
        <div className="bg-paper-raised border border-ink/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs text-slate-light uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Case ID</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Filed on</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/cases/${c.id}/timeline`)}
                  className="border-b border-ink/5 last:border-0 cursor-pointer hover:bg-paper transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-slate">{c.id}</td>
                  <td className="px-5 py-3.5 text-ink font-medium">{c.title}</td>
                  <td className="px-5 py-3.5 font-mono text-ink">
  {c.amount != null ? `₹${c.amount.toLocaleString('en-IN')}` : 'Amount not yet extracted'}
</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-light">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-3.5">
  <button
    onClick={(e) => handleDelete(e, c.id)}
    disabled={deletingId === c.id}
    className="text-slate-light hover:text-alert transition-colors disabled:opacity-40"
    aria-label={`Delete case ${c.id}`}
  >
    {deletingId === c.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
  <p className="text-sm text-slate text-center py-8">No cases match "{searchTerm}".</p>
)}
        </div>
      )}
    </div>
  )
}
