import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Role = 'admin' | 'mesero' | 'cocina'
type AuthUser = { name: string; role: Role }
type AuthContextValue = {
  user: AuthUser | null
  login: (role: Role, username: string) => void
  logout: () => void
}
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('dukes-user')
    return saved ? JSON.parse(saved) as AuthUser : null
  })
  const value = useMemo(() => ({
    user,
    login: (role: Role, username: string) => {
      const next = { role, name: username.trim() || (role === 'admin' ? 'Administrador' : role === 'mesero' ? 'Carlos Ramírez' : 'Chef Luis') }
      localStorage.setItem('dukes-user', JSON.stringify(next))
      setUser(next)
    },
    logout: () => { localStorage.removeItem('dukes-user'); setUser(null) },
  }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider')
  return context
}