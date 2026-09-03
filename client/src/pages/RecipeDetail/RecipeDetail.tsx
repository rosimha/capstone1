import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipe } from '../../api/recipes'
import './RecipeDetail.css'

interface Ingredient {
  name: string
  quantity: string
}

interface Instruction {
  step: number
  description: string
}

interface Recipe {
  _id: string
  title: string
  description?: string
  image?: string
  ingredients: Ingredient[]
  instructions: Instruction[]
  tags?: string[]
}

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getRecipe(id)
      .then((res) => setRecipe(res.data))
      .catch(() => setError('Recipe not found'))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <p className="status-text">Loading...</p>
  if (error) return <p className="status-text error">{error}</p>
  if (!recipe) return null

  return (
    <div className="recipe-detail-page">
      <button className="back-link" onClick={() => navigate('/recipes')}>
        ← Back to Recipes
      </button>

      <img
        src={recipe.image || 'https://placehold.co/600x300?text=🍽'}
        alt={recipe.title}
        className="recipe-detail-image"
      />

      <h1>{recipe.title}</h1>
      {recipe.description && <p className="recipe-detail-description">{recipe.description}</p>}

      <h2>Ingredients</h2>
      <ul className="ingredient-list">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing.quantity} {ing.name}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol className="instruction-list">
        {[...recipe.instructions]
          .sort((a, b) => a.step - b.step)
          .map((inst) => (
            <li key={inst.step}>{inst.description}</li>
          ))}
      </ol>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="recipe-detail-tags">
          {recipe.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipeDetail
