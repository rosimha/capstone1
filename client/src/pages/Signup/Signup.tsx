import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup as signupApi } from '../../api/users'
import { useAuth } from '../../context/AuthContext'
import '../Login/Login.css'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await signupApi({ email, password })
      login(res.data.token)
      navigate('/dashboard')
    } catch {
      setError('Could not create account. That email may already be in use.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-icon">🥄</span>
        <h1>Create an Account</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <button className="btn-outline" onClick={() => navigate('/login')}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Signup
