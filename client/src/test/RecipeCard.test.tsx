import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import RecipeCard from '../components/RecipeCard/RecipeCard'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const recipe = {
  _id: 'abc123',
  title: 'Pasta Carbonara',
  image: 'https://example.com/pasta.jpg',
  tags: ['Italian', 'pasta'],
}

describe('RecipeCard', () => {
  beforeEach(() => mockNavigate.mockClear())

  it('renders the recipe title', () => {
    render(<MemoryRouter><RecipeCard recipe={recipe} /></MemoryRouter>)
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })

  it('renders all tags', () => {
    render(<MemoryRouter><RecipeCard recipe={recipe} /></MemoryRouter>)
    expect(screen.getByText('Italian')).toBeInTheDocument()
    expect(screen.getByText('pasta')).toBeInTheDocument()
  })

  it('navigates to the recipe detail page on click', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><RecipeCard recipe={recipe} /></MemoryRouter>)
    await user.click(screen.getByText('Pasta Carbonara'))
    expect(mockNavigate).toHaveBeenCalledWith('/recipes/abc123')
  })

  it('renders a placeholder image when no image is provided', () => {
    const noImage = { _id: '1', title: 'No Image Recipe' }
    render(<MemoryRouter><RecipeCard recipe={noImage} /></MemoryRouter>)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('placehold'))
  })
})
