import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, ArrowRight } from 'lucide-react'
import { fetchTimeline } from '../services/api.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Timeline() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { caseId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTimeline(caseId).then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [caseId])

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Transaction timeline</h1>
      <p className="text-sm text-slate mb-8">
        Reconstructed from your evidence. Case <span className="font-mono">{caseId}</span>
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-slate text-sm py-12 justify-center">
          <Loader2 size={18} className="animate-spin" />
          Reconstructing timeline from evidence…
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-ink/10 space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative">
              <span
                className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-paper ${
                  event.flag === 'critical' ? 'bg-alert' : event.flag === 'suspicious' ? 'bg-pending' : 'bg-verified'
                }`}
              />
              <div className="bg-paper-raised border border-ink/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs text-slate-light">{event.time}</span>
                  <StatusBadge status={event.flag} />
                </div>
                <h3 className="font-display font-semibold text-sm text-ink mb-1">{event.label}</h3>
                <p className="text-sm text-slate font-mono">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <button
          onClick={() => navigate(`/cases/${caseId}/report`)}
          className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-ink-light transition-colors mt-8"
        >
          View AI analysis & generate report
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  )
}
