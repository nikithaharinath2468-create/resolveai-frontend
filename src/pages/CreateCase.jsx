import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { createCase } from '../services/api.js'

export default function CreateCase() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
  e.preventDefault()
  setLoading(true)
  const newCase = await createCase({ title, description })
  setLoading(false)
  navigate(`/cases/${newCase.id}/upload`)
}
  

  return (
    <div className="max-w-xl">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Create a fraud case</h1>
      <p className="text-sm text-slate mb-8">
  Give your case a short title. On the next step, you'll upload screenshots —
  our AI will automatically extract the amount, UTR, and account details from them.
  <span className="block text-xs text-pending mt-1">PDF support is coming in a later update.</span>
</p>

      <form onSubmit={handleSubmit} className="bg-paper-raised border border-ink/10 rounded-xl p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-xs font-medium text-slate mb-1.5">
            Case title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Unauthorised UPI debit — GPay"
            className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus:border-ink focus:ring-1 focus:ring-ink outline-none"
          />
        </div>

        

        <div>
          <label htmlFor="description" className="block text-xs font-medium text-slate mb-1.5">
            What happened? <span className="text-slate-light">(optional, helps our AI)</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe how the fraud happened…"
            className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus:border-ink focus:ring-1 focus:ring-ink outline-none resize-none"
          />
        </div>
        {error && <p className="text-sm text-alert">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Creating case…' : 'Create case and continue'}
        </button>
      </form>
    </div>
  )
}
