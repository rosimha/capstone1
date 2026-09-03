import { useState, useEffect } from 'react'
import { getAllRecipes } from '../../api/recipes'
import RecipeCard from '../../components/RecipeCard/RecipeCard'
import './Recipes.css'

interface Recipe {
  _id: string
  title: string
  image?: string
  tags?: string[]
}

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllRecipes()
      .then((res) => setRecipes(res.data))
      .catch(() => setError('Failed to load recipes'))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h2>Recipe List</h2>
        <input
          className="search-input"
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <p className="status-text">Loading...</p>}
      {error && <p className="status-text error">{error}</p>}

      {!isLoading && !error && filtered.length === 0 && (
        <p className="status-text">No recipes found.</p>
      )}

      <div className="recipes-list">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default Recipes
