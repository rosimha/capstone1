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
}

function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate()

  return (
    <div className="recipe-card" onClick={() => navigate(`/recipes/${recipe._id}`)}>
      <img
        src={recipe.image || 'https://placehold.co/80x80?text=🍽'}
        alt={recipe.title}
        className="recipe-card-image"
      />
      <div className="recipe-card-info">
        <h3>{recipe.title}</h3>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeCard
