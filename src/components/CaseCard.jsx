import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'

export default function CaseCard({ caseData }) {
  const navigate = useNavigate()
  const { id, title, status, amount, createdAt, completeness, fraudType } = caseData
  const FRAUD_TYPE_COLORS = {
  'phishing': 'bg-alert-bg text-alert',
  'Fake QR': 'bg-pending-bg text-pending',
  'OTP scam': 'bg-verified-bg text-verified',
}
  return (
    <button
      onClick={() => navigate(`/cases/${id}/timeline`)}
      className="w-full text-left bg-paper-raised border border-ink/10 rounded-xl p-5 hover:border-ink/30 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-xs text-slate">{id}</span>
        <ArrowUpRight size={16} className="text-slate-light group-hover:text-ink transition-colors" />
      </div>

      <h3 className="font-display font-semibold text-ink mb-1">{title}</h3>
      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${FRAUD_TYPE_COLORS[fraudType] || 'bg-slate-light/20 text-slate'}`}>
  {fraudType}
</span>
      <p className="font-mono text-lg text-ink mb-3">₹{amount.toLocaleString('en-IN')}</p>

      <div className="flex items-center justify-between mb-3">
        <StatusBadge status={status} />
        <span className="text-xs text-slate-light">{createdAt}</span>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-slate mb-1">
          <span>Evidence completeness</span>
          <span className="font-medium">{completeness}%</span>
        </div>
        <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-verified rounded-full transition-all"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>
    </button>
  )
}
