import axios from 'axios'

// ---------------------------------------------------------------------------
// SWITCH THIS ONE FLAG when your backend teammate's API is ready.
// While it's true, every function below returns mock data instantly.
// ---------------------------------------------------------------------------
export const USE_MOCK_DATA = true

export const api = axios.create({
  baseURL: 'http://localhost:8000', // change to your Render backend URL later
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

export async function loginUser(email, password) {
  if (USE_MOCK_DATA) {
    await delay(500)
    return { user: { name: 'Aarav Sharma', email }, token: 'mock-jwt-token' }
  }
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export async function fetchCases() {
  if (USE_MOCK_DATA) {
    await delay(400)
    return MOCK_CASES
  }
  const res = await api.get('/cases')
  return res.data
}

export async function createCase(payload) {
  if (USE_MOCK_DATA) {
    await delay(500)
    return { id: `RA-2026-0${Math.floor(Math.random() * 900 + 100)}`, ...payload, status: 'pending_evidence', completeness: 10 }
  }
  const res = await api.post('/cases', payload)
  return res.data
}

export async function uploadEvidence(caseId, files) {
  if (USE_MOCK_DATA) {
    await delay(1200)
    return { success: true, filesProcessed: files.length }
  }
  const formData = new FormData()
  files.forEach((f) => formData.append('files', f))
  const res = await api.post(`/cases/${caseId}/evidence`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
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
  if (USE_MOCK_DATA) {
    await delay(800)
    return { fields: MOCK_EXTRACTED_FIELDS, indicators: MOCK_FRAUD_INDICATORS, completeness: 86 }
  }
  const res = await api.get(`/cases/${caseId}/analysis`)
  return res.data
}

export async function generateComplaint(caseId) {
  if (USE_MOCK_DATA) {
    await delay(1000)
    return {
      text: `To,\nThe Grievance Redressal Officer,\nHDFC Bank\n\nSubject: Unauthorised UPI Transaction — UTR 302819473615 — Case ${caseId}\n\nI am writing to report an unauthorised debit of ₹24,500 from my account on 28 Jun 2026 at 14:04:11 to VPA fraudster@ybl. This transaction was preceded by a fraudulent OTP request and was not authorised by me. I request an immediate investigation and reversal under RBI's Limited Liability guidelines.\n\nRegards,\nAarav Sharma`,
    }
  }
  const res = await api.post(`/cases/${caseId}/complaint`)
  return res.data
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
