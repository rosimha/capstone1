import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllRecipes, deleteRecipe } from '../../api/recipes'
import RecipeCard from '../../components/RecipeCard/RecipeCard'
import './Dashboard.css'

interface Recipe {
  _id: string
  title: string
  image?: string
  tags?: string[]
  ownerId: string
}

export default function Dashboard() {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchMyRecipes() {
      try {
        const res = await getAllRecipes()
        setRecipes(res.data.filter((r: Recipe) => r.ownerId === userId))
      } catch {
        setError('Failed to load your recipes.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyRecipes()
  }, [userId])

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this recipe?')) return
    try {
      await deleteRecipe(id)
      setRecipes((prev) => prev.filter((r) => r._id !== id))
    } catch {
      setError('Failed to delete recipe.')
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Recipes</h1>
        <button className="btn-primary" onClick={() => navigate('/dashboard/create')}>
          + Create Recipe
        </button>
      </div>

      {loading && <p className="dashboard-status">Loading your recipes...</p>}
      {error && <p className="dashboard-status error">{error}</p>}

      {!loading && recipes.length === 0 && (
        <p className="dashboard-status">You haven't created any recipes yet.</p>
      )}

      <div className="dashboard-grid">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="dashboard-card-wrapper">
            <RecipeCard recipe={recipe} />
            <div className="dashboard-card-actions">
              <button onClick={() => navigate(`/dashboard/edit/${recipe._id}`)}>
                Edit
              </button>
              <button className="btn-danger" onClick={() => handleDelete(recipe._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
