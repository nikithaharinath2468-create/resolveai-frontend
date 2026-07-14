import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Download, AlertTriangle, FileText, Sparkles, Copy, Check } from 'lucide-react'
import { generateFraudAnalysis, fetchFraudIndicators, generateComplaint, downloadComplaintPdf } from '../services/api.js'

export default function Report() {
  const [indicators, setIndicators] = useState([])
  const [loadingIndicators, setLoadingIndicators] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [complaint, setComplaint] = useState(null)
  const [generatingComplaint, setGeneratingComplaint] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { caseId } = useParams()

  useEffect(() => {
    loadIndicators()
  }, [caseId])

  async function loadIndicators() {
    setLoadingIndicators(true)
    const data = await fetchFraudIndicators(caseId)
    setIndicators(data)
    setLoadingIndicators(false)
  }

  async function handleRunAnalysis() {
  setAnalyzing(true)
  await generateFraudAnalysis(caseId)
  await loadIndicators()
  setHasAnalyzed(true)
  setAnalyzing(false)
}

  async function handleGenerateComplaint() {
    setGeneratingComplaint(true)
    const result = await generateComplaint(caseId)
    setComplaint(result.text)
    setGeneratingComplaint(false)
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
   async function handleCopy() {
  try {
    await navigator.clipboard.writeText(complaint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">AI analysis report</h1>
      <p className="text-sm text-slate mb-8">
        Case <span className="font-mono">{caseId}</span>
      </p>

      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6 mb-6">
        <h2 className="font-display font-semibold text-sm text-ink mb-4 uppercase tracking-wide">
  Fraud indicators
</h2>
        {loadingIndicators ? (
          <div className="flex items-center gap-2 text-slate text-sm py-4 justify-center">
            <Loader2 size={18} className="animate-spin" />
            Loading…
          </div>
        ) : indicators.length === 0 && !hasAnalyzed ? (
  <div className="text-center py-6">
    <p className="text-sm text-slate mb-4">No fraud analysis has been run for this case yet.</p>
    <button
      onClick={handleRunAnalysis}
      disabled={analyzing}
      className="inline-flex items-center gap-2 bg-ink text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-60"
    >
      {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      {analyzing ? 'Analyzing…' : 'Run fraud analysis'}
    </button>
  </div>
) : indicators.length === 0 && hasAnalyzed ? (
  <p className="text-sm text-verified">Analysis complete — no specific fraud patterns were confidently identified from the current evidence.</p>
) : (
          <ul className="space-y-2.5">
            {indicators.map((ind) => (
              <li key={ind.id} className="flex items-start gap-2.5">
                <AlertTriangle
                  size={16}
                  className={`shrink-0 mt-0.5 ${ind.severity === 'high' ? 'text-alert' : 'text-pending'}`}
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

      <section className="bg-paper-raised border border-ink/10 rounded-xl p-6">
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

        {!complaint ? (
          <button
            onClick={handleGenerateComplaint}
            disabled={generatingComplaint}
            className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-60"
          >
            {generatingComplaint ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {generatingComplaint ? 'Drafting complaint…' : 'Generate complaint letter'}
          </button>
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
    </div>
  )
}