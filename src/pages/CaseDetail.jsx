import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertTriangle, Copy, Check, Download, FileImage, Pencil } from 'lucide-react'
import {
  fetchCaseById,
  fetchEvidenceForCase,
  fetchTimeline,
  fetchFraudIndicators,
  generateComplaint,
  downloadComplaintPdf,
} from '../services/api.js'

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function CaseDetail() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [caseData, setCaseData] = useState(null)
  const [loadingCase, setLoadingCase] = useState(true)

  const [evidence, setEvidence] = useState([])
  const [loadingEvidence, setLoadingEvidence] = useState(true)

  const [timelineEvents, setTimelineEvents] = useState([])
  const [loadingTimeline, setLoadingTimeline] = useState(true)

  const [indicators, setIndicators] = useState([])
  const [loadingIndicators, setLoadingIndicators] = useState(true)

  const [complaint, setComplaint] = useState(null)
  const [loadingComplaint, setLoadingComplaint] = useState(true)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    loadAll()
  }, [caseId])

  async function loadAll() {
    setLoadingCase(true)
    fetchCaseById(caseId)
      .then(setCaseData)
      .finally(() => setLoadingCase(false))

    setLoadingEvidence(true)
    fetchEvidenceForCase(caseId)
      .then(setEvidence)
      .finally(() => setLoadingEvidence(false))

    setLoadingTimeline(true)
    fetchTimeline(caseId)
      .then(setTimelineEvents)
      .finally(() => setLoadingTimeline(false))

    setLoadingIndicators(true)
    fetchFraudIndicators(caseId)
      .then(setIndicators)
      .finally(() => setLoadingIndicators(false))

    setLoadingComplaint(true)
    generateComplaint(caseId)
      .then((result) => setComplaint(result.text))
      .catch(() => setComplaint(null))
      .finally(() => setLoadingComplaint(false))
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(complaint)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      await downloadComplaintPdf(caseId)
    } catch (err) {
      console.error('PDF download failed:', err)
    }
    setDownloading(false)
  }

  if (loadingCase) {
    return (
      <div className="flex items-center gap-2 text-slate text-sm py-12 justify-center">
        <Loader2 size={18} className="animate-spin" />
        Loading case…
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      {/* 1. Case title */}
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">{caseData?.title}</h1>
      <p className="text-sm text-slate-light mb-6 font-mono">
        {caseData?.case_number} · {formatDate(caseData?.created_at)}
      </p>

      {/* 2. Case description */}
      {caseData?.description && (
        <section className="bg-paper-raised border border-ink/10 rounded-xl p-6 mb-6">
          <h2 className="font-display font-semibold text-sm text-ink mb-2 uppercase tracking-wide">
            Description
          </h2>
          <p className="text-sm text-slate">{caseData.description}</p>
        </section>
      )}

      {/* 3. Evidence list */}
      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6 mb-6">
        <h2 className="font-display font-semibold text-sm text-ink mb-4 uppercase tracking-wide">
          Evidence
        </h2>
        {loadingEvidence ? (
          <div className="flex items-center gap-2 text-slate text-sm py-2">
            <Loader2 size={16} className="animate-spin" />
            Loading…
          </div>
        ) : evidence.length === 0 ? (
          <p className="text-sm text-slate">No evidence uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {evidence.map((ev) => (
              <li key={ev.id} className="flex items-center gap-2.5 text-sm">
                <FileImage size={14} className="text-slate-light shrink-0" />
                <span className="text-ink truncate">{ev.original_filename}</span>
                <span className="text-xs text-slate-light shrink-0 ml-auto">{ev.ocr_status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 4. Timeline */}
      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6 mb-6">
        <h2 className="font-display font-semibold text-sm text-ink mb-4 uppercase tracking-wide">
          Timeline
        </h2>
        {loadingTimeline ? (
          <div className="flex items-center gap-2 text-slate text-sm py-2">
            <Loader2 size={16} className="animate-spin" />
            Loading…
          </div>
        ) : timelineEvents.length === 0 ? (
          <p className="text-sm text-slate">No timeline generated yet.</p>
        ) : (
          <ul className="space-y-3">
            {timelineEvents.map((event) => (
              <li key={event.id} className="text-sm">
                <span className="font-mono text-xs text-slate-light block mb-0.5">
                  {event.event_time ? formatDate(event.event_time) : 'No exact time available'}
                </span>
                <span className="text-ink">{event.event_description}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 5. Fraud indicators */}
      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6 mb-6">
        <h2 className="font-display font-semibold text-sm text-ink mb-4 uppercase tracking-wide">
          Fraud indicators
        </h2>
        {loadingIndicators ? (
          <div className="flex items-center gap-2 text-slate text-sm py-2">
            <Loader2 size={16} className="animate-spin" />
            Loading…
          </div>
        ) : indicators.length === 0 ? (
          <p className="text-sm text-slate">No fraud analysis has been run for this case yet.</p>
        ) : (
          <ul className="space-y-2.5">
            {indicators.map((ind) => (
              <li key={ind.id} className="flex items-start gap-2.5">
                <AlertTriangle
                  size={16}
                  className={`shrink-0 mt-0.5 ${
                    ind.severity === 'high'
                      ? 'text-alert'
                      : ind.severity === 'medium'
                      ? 'text-pending'
                      : 'text-slate-light'
                  }`}
                />
                <div>
                  <p className="text-sm text-ink font-medium capitalize">{ind.indicator_type.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-slate">{ind.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 6. Complaint text + Copy + Download */}
      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-sm text-ink uppercase tracking-wide">
            Dispute complaint
          </h2>
          {complaint && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-slate hover:text-ink transition-colors"
            >
              {copied ? <Check size={14} className="text-verified" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>

        {loadingComplaint ? (
          <div className="flex items-center gap-2 text-slate text-sm py-2">
            <Loader2 size={16} className="animate-spin" />
            Loading…
          </div>
        ) : !complaint ? (
          <p className="text-sm text-slate">Complaint hasn't been generated yet for this case.</p>
        ) : (
          <>
            <pre className="whitespace-pre-wrap font-mono text-xs text-ink bg-paper rounded-lg p-4 border border-ink/10 mb-4">
              {complaint}
            </pre>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 bg-verified text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {downloading ? 'Preparing PDF…' : 'Download report'}
            </button>
          </>
        )}
      </section>

      {/* Update Case button (Fix 5 will wire this up properly) */}
      <button
        onClick={() => navigate(`/cases/${caseId}/edit`)}
        className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-ink-light transition-colors"
      >
        <Pencil size={16} />
        Update case
      </button>
    </div>
  )
}