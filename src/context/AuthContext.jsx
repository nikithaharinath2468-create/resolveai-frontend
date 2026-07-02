import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // In-memory only (Claude artifacts / this environment can't use localStorage,
  // but in your real hackathon build on your own machine, swap this for
  // localStorage.getItem('token') so login persists across refresh).
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  function login(userData, jwt) {
    setUser(userData)
    setToken(jwt)
  }

  function logout() {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
