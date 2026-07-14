import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UploadCloud, FileImage,FileText, X, Loader2 } from 'lucide-react'
import { uploadEvidence } from '../services/api.js'

export default function UploadEvidence() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)
  const { caseId } = useParams()
  const navigate = useNavigate()

  function addFiles(fileList) {
    const newFiles = Array.from(fileList).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      id: `${f.name}-${f.lastModified}`,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  function removeFile(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    addFiles(e.dataTransfer.files)
  }

  async function handleAnalyze() {
  setUploading(true)
  setProgress(0)

  // Bump progress up every 150ms, capped at 90% — the last 10% only
  // completes once the real upload actually finishes.
  const interval = setInterval(() => {
    setProgress((prev) => (prev >= 90 ? prev : prev + 10))
  }, 600)

  await uploadEvidence(caseId, files.map((f) => f.file))

  clearInterval(interval)
  setProgress(100)

  setTimeout(() => {
    navigate(`/cases/${caseId}/timeline`)
  }, 300)
}

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Upload evidence</h1>
      <p className="text-sm text-slate mb-8">
  Upload screenshots of SMS alerts, chat messages, and transaction confirmations —
  our AI will automatically extract the amount, UTR, and account details. Case{' '}
  <span className="font-mono">{caseId}</span>
  <span className="block text-xs text-pending mt-1">PDF support is coming in a later update.</span>
</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl py-12 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-ink bg-ink/5' : 'border-ink/20 hover:border-ink/40'
        }`}
      >
        <UploadCloud size={28} className="mx-auto text-slate mb-3" />
        <p className="text-sm text-ink font-medium mb-1">Drag & drop screenshots here</p>
<p className="text-xs text-slate-light">or click to browse — PNG, JPG up to 10MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-6">
          {files.map(({ id, preview, file }) => (
            <div key={id} className="relative group border border-ink/10 rounded-lg overflow-hidden bg-paper-raised">
              {file.type === 'application/pdf' ? (
  <div className="w-full h-28 flex flex-col items-center justify-center gap-1.5 bg-ink/5">
    <FileText size={28} className="text-alert" />
    <span className="text-[10px] text-slate-light uppercase tracking-wide">PDF</span>
  </div>
) : (
  <img src={preview} alt={file.name} className="w-full h-28 object-cover" />
)}
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(id) }}
                className="absolute top-1.5 right-1.5 bg-ink/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${file.name}`}
              >
                <X size={12} />
              </button>
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                {file.type === 'application/pdf' ? (
  <FileText size={12} className="text-alert shrink-0" />
) : (
  <FileImage size={12} className="text-slate-light shrink-0" />
)}
                <span className="text-xs text-slate truncate">{file.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {uploading && (
  <div className="mb-3">
    <div className="flex items-center justify-between text-xs text-slate mb-1">
      <span>Processing evidence…</span>
      <span className="font-medium">{progress}%</span>
    </div>
    <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-verified rounded-full transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
)}
      <button
        onClick={handleAnalyze}
        disabled={files.length === 0 || uploading}
        className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-lg py-2.5 text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-40 mt-6"
      >
        {uploading && <Loader2 size={16} className="animate-spin" />}
        {uploading ? 'Running OCR & AI analysis…' : `Analyze ${files.length || ''} evidence file${files.length === 1 ? '' : 's'}`}
      </button>
    </div>
  )
}
