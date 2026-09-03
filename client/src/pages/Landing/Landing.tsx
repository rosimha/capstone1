import { useNavigate } from 'react-router-dom'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <div className="landing-card">
        <span className="landing-icon">🥄</span>
        <h1>Spoonful</h1>
        <p>Your personal recipe manager</p>
        <div className="landing-buttons">
          <button className="btn-primary" onClick={() => navigate('/recipes')}>
            Explore Recipes
          </button>
          <button className="btn-outline" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing
