const STATUS_MAP = {
  pending_evidence: { label: 'Pending Evidence', bg: 'bg-pending-bg', text: 'text-pending' },
  analysis_complete: { label: 'Analysis Complete', bg: 'bg-verified-bg', text: 'text-verified' },
  complaint_generated: { label: 'Complaint Ready', bg: 'bg-verified-bg', text: 'text-verified' },
  critical: { label: 'Critical', bg: 'bg-alert-bg', text: 'text-alert' },
  suspicious: { label: 'Suspicious', bg: 'bg-pending-bg', text: 'text-pending' },
  neutral: { label: 'Confirmed', bg: 'bg-verified-bg', text: 'text-verified' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] ?? { label: status, bg: 'bg-slate-light/20', text: 'text-slate' }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-current/20 ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  )
}
