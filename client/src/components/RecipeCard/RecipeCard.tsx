import { useNavigate } from 'react-router-dom'
import './RecipeCard.css'

interface Recipe {
  _id: string
  title: string
  image?: string
  tags?: string[]
}

interface Props {
  recipe: Recipe
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

function RecipeCard({ recipe, onEdit, onDelete }: Props) {
  const navigate = useNavigate()

  return (
    <div className="recipe-card" onClick={() => navigate(`/recipes/${recipe._id}`)}>
      <img
        src={recipe.image || 'https://placehold.co/300x180?text=🍽'}
        alt={recipe.title}
        className="recipe-card-image"
      />
      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {(onEdit || onDelete) && (
          <div className="recipe-card-actions">
            {onEdit && (
              <button
                type="button"
                className="icon-btn"
                aria-label="Edit recipe"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(recipe._id)
                }}
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="icon-btn"
                aria-label="Delete recipe"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(recipe._id)
                }}
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeCard
