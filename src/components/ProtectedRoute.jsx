import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
