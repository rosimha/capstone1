import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecipe, createRecipe, updateRecipe } from '../../api/recipes'
import './RecipeForm.css'

interface Ingredient {
  name: string
  quantity: string
}

interface Instruction {
  description: string
}

interface FormData {
  title: string
  image: string
  description: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  tags: string
}

const emptyForm: FormData = {
  title: '',
  image: '',
  description: '',
  ingredients: [{ name: '', quantity: '' }],
  instructions: [{ description: '' }],
  tags: '',
}

export default function RecipeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    getRecipe(id)
      .then((res) => {
        const r = res.data
        setForm({
          title: r.title,
          image: r.image || '',
          description: r.description || '',
          ingredients: r.ingredients.length ? r.ingredients : [{ name: '', quantity: '' }],
          instructions: r.instructions.length
            ? r.instructions.map((inst: { description: string }) => ({ description: inst.description }))
            : [{ description: '' }],
          tags: r.tags ? r.tags.join(', ') : '',
        })
      })
      .catch(() => setError('Failed to load recipe.'))
  }, [id])

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleIngredient(index: number, field: keyof Ingredient, value: string) {
    setForm((prev) => {
      const updated = [...prev.ingredients]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, ingredients: updated }
    })
  }

  function addIngredient() {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '' }],
    }))
  }

  function removeIngredient(index: number) {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  function handleInstruction(index: number, value: string) {
    setForm((prev) => {
      const updated = [...prev.instructions]
      updated[index] = { description: value }
      return { ...prev, instructions: updated }
    })
  }

  function addInstruction() {
    setForm((prev) => ({
      ...prev,
      instructions: [...prev.instructions, { description: '' }],
    }))
  }

  function removeInstruction(index: number) {
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      instructions: form.instructions.map((inst, i) => ({
        step: i + 1,
        description: inst.description,
      })),
    }

    try {
      if (id) {
        await updateRecipe(id, payload)
      } else {
        await createRecipe(payload)
      }
      navigate('/dashboard')
    } catch {
      setError('Failed to save recipe.')
      setLoading(false)
    }
  }

  return (
    <div className="recipe-form-page">
      <h1>{id ? 'Edit Recipe' : 'Create Recipe'}</h1>
      {error && <p className="form-error">{error}</p>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleField} required />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input id="image" name="image" value={form.image} onChange={handleField} placeholder="https://..." />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleField} rows={3} />
        </div>

        <div className="form-section">
          <h2>Ingredients</h2>
          {form.ingredients.map((ing, i) => (
            <div key={i} className="dynamic-row">
              <input
                placeholder="Name"
                value={ing.name}
                onChange={(e) => handleIngredient(i, 'name', e.target.value)}
                required
              />
              <input
                placeholder="Quantity"
                value={ing.quantity}
                onChange={(e) => handleIngredient(i, 'quantity', e.target.value)}
                required
              />
              {form.ingredients.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeIngredient(i)}>
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addIngredient}>
            + Add Ingredient
          </button>
        </div>

        <div className="form-section">
          <h2>Instructions</h2>
          {form.instructions.map((inst, i) => (
            <div key={i} className="dynamic-row">
              <span className="step-number">{i + 1}.</span>
              <input
                placeholder="Describe this step"
                value={inst.description}
                onChange={(e) => handleInstruction(i, e.target.value)}
                required
              />
              {form.instructions.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeInstruction(i)}>
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addInstruction}>
            + Add Step
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleField}
            placeholder="pasta, Italian, quick"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Save Changes' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}
