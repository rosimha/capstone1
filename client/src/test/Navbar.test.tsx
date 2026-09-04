import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import Navbar from '../components/Navbar/Navbar'
import * as AuthContext from '../context/AuthContext'

describe('Navbar', () => {
  it('shows Login and Sign Up when logged out', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      token: null,
      userId: null,
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('hides Login and Sign Up when logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      token: 'fake-token',
      userId: 'user1',
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
  })

  it('shows Dashboard and Logout when logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      token: 'fake-token',
      userId: 'user1',
      login: vi.fn(),
      logout: vi.fn(),
    })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('calls logout when Logout is clicked', async () => {
    const mockLogout = vi.fn()
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      token: 'fake-token',
      userId: 'user1',
      login: vi.fn(),
      logout: mockLogout,
    })
    const user = userEvent.setup()
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    await user.click(screen.getByText('Logout'))
    expect(mockLogout).toHaveBeenCalled()
  })
})
