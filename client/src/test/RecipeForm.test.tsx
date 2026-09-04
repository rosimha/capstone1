import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import RecipeForm from '../pages/RecipeForm/RecipeForm'
import * as recipesApi from '../api/recipes'

vi.mock('../api/recipes', () => ({
  getRecipe: vi.fn(),
  createRecipe: vi.fn(),
  updateRecipe: vi.fn(),
}))

describe('RecipeForm', () => {
  it('shows "Create Recipe" heading in create mode', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/create']}>
        <Routes>
          <Route path="/dashboard/create" element={<RecipeForm />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Create Recipe' })).toBeInTheDocument()
  })

  it('shows "Edit Recipe" heading in edit mode', () => {
    vi.mocked(recipesApi.getRecipe).mockResolvedValue({
      data: {
        title: 'Old Title',
        image: '',
        description: '',
        ingredients: [{ name: 'Egg', quantity: '2' }],
        instructions: [{ step: 1, description: 'Boil water' }],
        tags: ['easy'],
      },
    } as never)

    render(
      <MemoryRouter initialEntries={['/dashboard/edit/abc123']}>
        <Routes>
          <Route path="/dashboard/edit/:id" element={<RecipeForm />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Edit Recipe' })).toBeInTheDocument()
  })

  it('renders all required form fields', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/create']}>
        <Routes>
          <Route path="/dashboard/create" element={<RecipeForm />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Tags')).toBeInTheDocument()
  })

  it('renders Add Ingredient and Add Step buttons', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/create']}>
        <Routes>
          <Route path="/dashboard/create" element={<RecipeForm />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('+ Add Ingredient')).toBeInTheDocument()
    expect(screen.getByText('+ Add Step')).toBeInTheDocument()
  })
})
