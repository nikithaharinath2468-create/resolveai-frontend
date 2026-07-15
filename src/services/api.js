import axios from 'axios'

// ---------------------------------------------------------------------------
// SWITCH THIS ONE FLAG when your backend teammate's API is ready.
// While it's true, every function below returns mock data instantly.
// ---------------------------------------------------------------------------
export const USE_MOCK_DATA = false

export const api = axios.create({
  baseURL: 'https://resolveai-backend-1.onrender.com',
})

// Attach JWT automatically to every request once you're using real auth
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// ---------------------------------------------------------------------------
// MOCK DATA — matches the shape your backend will eventually return
// ---------------------------------------------------------------------------
const MOCK_CASES = [
  {
    id: 'RA-2026-0142',
    title: 'Unauthorised UPI debit — GPay',
    status: 'analysis_complete',
    amount: 24500,
    createdAt: '2026-06-28',
    completeness: 86,
    fraudType: 'phishing',
  },
  {
    id: 'RA-2026-0138',
    title: 'Fake merchant QR scan',
    status: 'pending_evidence',
    amount: 8999,
    createdAt: '2026-06-25',
    completeness: 40,
    fraudType: 'Fake QR',
  },
  {
    id: 'RA-2026-0129',
    title: 'Phishing link — PhonePe',
    status: 'complaint_generated',
    amount: 51200,
    createdAt: '2026-06-18',
    completeness: 100,
    fraudType: 'OTP scam',
  },
]

const MOCK_TIMELINE = [
  { id: 't1', time: '2026-06-28 14:02', label: 'SMS received', detail: 'OTP request from "+91-XXXXX45231", unsolicited', flag: 'suspicious' },
  { id: 't2', time: '2026-06-28 14:04', label: 'UPI debit executed', detail: 'UTR 302819473615 · ₹24,500 to unknown VPA fraudster@ybl', flag: 'critical' },
  { id: 't3', time: '2026-06-28 14:06', label: 'Confirmation SMS', detail: 'Debit confirmation received from bank', flag: 'neutral' },
  { id: 't4', time: '2026-06-28 14:20', label: 'User noticed fraud', detail: 'Screenshot of transaction history captured', flag: 'neutral' },
]

const MOCK_EXTRACTED_FIELDS = {
  amount: '₹24,500',
  utr: '302819473615',
  date: '28 Jun 2026',
  time: '14:04:11',
  merchant: 'Unknown',
  beneficiaryVpa: 'fraudster@ybl',
  senderBank: 'HDFC Bank',
}

const MOCK_FRAUD_INDICATORS = [
  { label: 'Unsolicited OTP request preceding transaction', severity: 'high' },
  { label: 'Beneficiary VPA created within last 10 days', severity: 'high' },
  { label: 'No prior transaction history with this VPA', severity: 'medium' },
]

// ---------------------------------------------------------------------------
// API FUNCTIONS — each one has a mock branch and a real-call branch.
// Your pages only ever call these functions, never axios directly.
// ---------------------------------------------------------------------------

function displayNameFromIdentifier(identifier) {
  return identifier.includes('@') ? identifier.split('@')[0] : identifier
}
export async function loginUser(identifier, password) {
  if (USE_MOCK_DATA) {
    await delay(500)
    return { user: { name: displayNameFromIdentifier(identifier), email: identifier }, token: 'mock-jwt-token' }
  }

  // Backend expects { identifier, password } — identifier can be email OR phone.
  const res = await api.post('/auth/login', { identifier, password })

  // Backend only returns { access_token, token_type } — no user object.
  // We build a lightweight user object locally from whatever was typed in,
  // since there's nothing else to display a name from yet.
  return {
    user: { name: displayNameFromIdentifier(identifier), email: identifier },
    token: res.data.access_token,
  }
}
 export async function registerUser({ fullName, email, password, phone }) {
  const res = await api.post('/auth/signup', {
    email,
    password,
    full_name: fullName,
    phone: phone || null,
  })
  return res.data
}
export async function fetchCaseById(caseId) {
  const res = await api.get(`/cases/${caseId}`)
  return res.data
}
export async function fetchCases() {
  if (USE_MOCK_DATA) {
    await delay(400)
    return MOCK_CASES
  }
  const res = await api.get('/cases/')
  return res.data.map((c) => ({
  ...c,
  amount: c.total_amount,
  createdAt: c.created_at,
}))
}

export async function createCase(payload) {
  if (USE_MOCK_DATA) {
    await delay(500)
    return { id: `RA-2026-0${Math.floor(Math.random() * 900 + 100)}`, ...payload, status: 'pending_evidence', completeness: 10 }
  }

  // Backend only accepts { title, fraud_type, description } — it generates
  // id/case_number itself, and doesn't accept "amount" or "user_id".
  // If you want to keep tracking amount on the frontend, you'll need to ask
  // your Backend Lead to add that field to their schema — for now it's
  // silently dropped before sending.
  const res = await api.post('/cases/', {
    title: payload.title,
    fraud_type: payload.fraudType,
    description: payload.description,
  })
  return res.data
}
 export async function updateCase(caseId, payload) {
  const res = await api.patch(`/cases/${caseId}`, payload)
  return res.data
}
export async function deleteCase(caseId) {
  await api.delete(`/cases/${caseId}`)
}
// NOTE: this now requires a fileType alongside the files, since the backend
// applies ONE file_type to the whole upload batch. Default to 'screenshot'
// since that's the most common evidence type — pass a different one
// explicitly if your UploadEvidence page ever lets the user choose.
export async function uploadEvidence(caseId, files, fileType = 'screenshot') {
  if (USE_MOCK_DATA) {
    await delay(1200)
    return { success: true, filesProcessed: files.length }
  }
  

  const formData = new FormData()
  formData.append('case_id', caseId)
  formData.append('file_type', fileType)
  files.forEach((f) => formData.append('files', f))

  // Real endpoint is /evidence/upload — NOT /cases/{id}/evidence.
  const res = await api.post('/evidence/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  // Response is an ARRAY of evidence objects (one per file), not a single object.
  return res.data
}
export async function fetchEvidenceForCase(caseId) {
  const res = await api.get(`/evidence/case/${caseId}`)
  return res.data
}

// ---------------------------------------------------------------------------
// UNCONFIRMED ENDPOINTS — the backend team hasn't built these yet.
// Left as mock-only for now. When they're ready, ask for the real contract
// (URL, method, request/response shape) and update these the same way
// the functions above were fixed.
// ---------------------------------------------------------------------------

export async function generateTimeline(caseId) {
  const res = await api.post(`/cases/${caseId}/timeline/generate`)
  return res.data
}
export async function generateFraudAnalysis(caseId) {
  const res = await api.post(`/cases/${caseId}/fraud-analysis`)
  return res.data
}

export async function fetchFraudIndicators(caseId) {
  const res = await api.get(`/cases/${caseId}/fraud-indicators`)
  return res.data
}

export async function fetchTimeline(caseId) {
  if (USE_MOCK_DATA) {
    await delay(600)
    return MOCK_TIMELINE
  }
  const res = await api.get(`/cases/${caseId}/timeline`)
  return res.data
}

export async function fetchAnalysis(caseId) {
  // Always mock for now — this endpoint doesn't exist on the backend yet.
  await delay(800)
  return { fields: MOCK_EXTRACTED_FIELDS, indicators: MOCK_FRAUD_INDICATORS, completeness: 86 }
}

export async function generateComplaint(caseId) {
  if (USE_MOCK_DATA) {
    await delay(1000)
    return {
      text: `To,\nThe Grievance Redressal Officer,\nHDFC Bank\n\nSubject: Unauthorised UPI Transaction — UTR 302819473615 — Case ${caseId}\n\nI am writing to report an unauthorised debit of ₹24,500 from my account on 28 Jun 2026 at 14:04:11 to VPA fraudster@ybl. This transaction was preceded by a fraudulent OTP request and was not authorised by me. I request an immediate investigation and reversal under RBI's Limited Liability guidelines.\n\nRegards,\nAarav Sharma`,
    }
  }
  const res = await api.get(`/cases/${caseId}/complaint`)
  return { text: res.data.complaint_text }
}
export async function downloadComplaintPdf(caseId) {
  const res = await api.get(`/cases/${caseId}/complaint/pdf`, {
    responseType: 'blob',
  })

  const disposition = res.headers['content-disposition']
  let filename = `${caseId}-complaint.pdf`
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/)
    if (match) filename = match[1]
  }

  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}