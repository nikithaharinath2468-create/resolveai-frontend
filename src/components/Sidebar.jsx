import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FilePlus2, History, ShieldCheck, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cases/new', label: 'New Case', icon: FilePlus2 },
  { to: '/cases/history', label: 'Case History', icon: History },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 shrink-0 bg-ink text-paper flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 flex items-center gap-2 border-b border-white/10">
        <ShieldCheck size={22} className="text-pending" />
        <span className="font-display font-semibold text-lg tracking-tight">ResolveAI</span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-slate-light hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <p className="text-xs text-slate-light px-2 mb-2 truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-light hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  )
}
