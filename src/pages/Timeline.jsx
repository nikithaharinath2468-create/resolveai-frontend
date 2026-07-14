import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, ArrowRight, Sparkles } from 'lucide-react'
import { fetchTimeline, generateTimeline } from '../services/api.js'
function formatEventTime(isoString) {
  if (!isoString) return null
  const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
  if (!match) return isoString
  const [, year, month, day, hour, minute] = match
  const date = new Date(year, month - 1, day, hour, minute)
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function Timeline() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const { caseId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadTimeline()
  }, [caseId])

  async function loadTimeline() {
    setLoading(true)
    const data = await fetchTimeline(caseId)
    setEvents(data)
    setLoading(false)
  }

  async function handleGenerate() {
    setGenerating(true)
    await generateTimeline(caseId)
    await loadTimeline()
    setGenerating(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Transaction timeline</h1>
      <p className="text-sm text-slate mb-8">
        Reconstructed from your evidence. Case <span className="font-mono">{caseId}</span>
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-slate text-sm py-12 justify-center">
          <Loader2 size={18} className="animate-spin" />
          Loading timeline…
        </div>
      ) : events.length === 0 ? (
        <div className="border-2 border-dashed border-ink/15 rounded-xl py-16 text-center">
          <p className="text-slate mb-4">No timeline yet — generate one from this case's evidence.</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 bg-ink text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-60"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {generating ? 'Generating…' : 'Generate timeline'}
          </button>
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-ink/10 space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative">
              <span
                className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-paper ${
                  event.event_time ? 'bg-verified' : 'bg-slate-light'
                }`}
              />
              <div className="bg-paper-raised border border-ink/10 rounded-xl p-4">
                <span className="font-mono text-xs text-slate-light block mb-1.5">
                  {event.event_time ? formatEventTime(event.event_time) : 'No exact time available'}
                </span>
                <p className="text-sm text-ink">{event.event_description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && events.length > 0 && (
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