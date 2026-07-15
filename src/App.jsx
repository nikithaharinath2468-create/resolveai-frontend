import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import CaseDetail from './pages/CaseDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateCase from './pages/CreateCase.jsx'
import UploadEvidence from './pages/UploadEvidence.jsx'
import Timeline from './pages/Timeline.jsx'
import Report from './pages/Report.jsx'
import CaseHistory from './pages/CaseHistory.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/cases/new" element={<ProtectedRoute><CreateCase /></ProtectedRoute>} />
      <Route path="/cases/history" element={<ProtectedRoute><CaseHistory /></ProtectedRoute>} />
      <Route path="/cases/:caseId" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
      <Route path="/cases/:caseId/upload" element={<ProtectedRoute><UploadEvidence /></ProtectedRoute>} />
      <Route path="/cases/:caseId/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
      <Route path="/cases/:caseId/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
