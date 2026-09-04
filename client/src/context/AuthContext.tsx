import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  token: string | null
  userId: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function decodeUserId(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.user._id ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedToken = localStorage.getItem('token')

  const [token, setToken] = useState<string | null>(storedToken)
  const [userId, setUserId] = useState<string | null>(
    storedToken ? decodeUserId(storedToken) : null
  )

  function login(newToken: string) {
    setToken(newToken)
    setUserId(decodeUserId(newToken))
    localStorage.setItem('token', newToken)
  }

  function logout() {
    setToken(null)
    setUserId(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
