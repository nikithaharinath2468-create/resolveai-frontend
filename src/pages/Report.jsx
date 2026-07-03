import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Download, AlertTriangle, FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import { fetchAnalysis, generateComplaint } from '../services/api.js'

export default function Report() {
  const [analysis, setAnalysis] = useState(null)
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const { caseId } = useParams()

  useEffect(() => {
    fetchAnalysis(caseId).then((data) => {
      setAnalysis(data)
      setLoading(false)
    })
  }, [caseId])

  async function handleGenerate() {
    setGenerating(true)
    const result = await generateComplaint(caseId)
    setComplaint(result.text)
    setGenerating(false)
  }

  function handleDownload() {
    // MVP: download the complaint text as a .txt file.
    // Swap this for a real PDF once your backend's /pdf endpoint is ready —
    // just fetch the PDF blob and trigger the same download pattern.
    const blob = new Blob([complaint], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${caseId}-complaint.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate text-sm py-12 justify-center max-w-2xl">
        <Loader2 size={18} className="animate-spin" />
        Running AI fraud analysis…
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">AI analysis report</h1>
      <p className="text-sm text-slate mb-8">
        Case <span className="font-mono">{caseId}</span>
      </p>

      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6 mb-6">
        <h2 className="font-display font-semibold text-sm text-ink mb-4 uppercase tracking-wide">
          Extracted transaction details
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
          {Object.entries(analysis.fields).map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs text-slate-light capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
              <dd className="font-mono text-sm text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6 mb-6">
        <h2 className="font-display font-semibold text-sm text-ink mb-4 uppercase tracking-wide">
          Fraud indicators detected
        </h2>
        <ul className="space-y-2.5">
          {analysis.indicators.map((ind, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <AlertTriangle
                size={16}
                className={`shrink-0 mt-0.5 ${ind.severity === 'high' ? 'text-alert' : 'text-pending'}`}
              />
              <span className="text-sm text-ink">{ind.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6">
        <h2 className="font-display font-semibold text-sm text-ink mb-4 uppercase tracking-wide">
          Dispute complaint
        </h2>

        {!complaint ? (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-60"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {generating ? 'Drafting complaint…' : 'Generate complaint letter'}
          </button>
        ) : (
          <>
            <pre className="whitespace-pre-wrap font-mono text-xs text-ink bg-paper rounded-lg p-4 border border-ink/10 mb-4">
              {complaint}
            </pre>
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-verified text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download size={16} />
              Download report
            </button>
          </>
        )}
      </section>
    </div>
  )
}
