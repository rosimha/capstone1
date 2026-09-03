import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Recipes from './pages/Recipes/Recipes'
import RecipeDetail from './pages/RecipeDetail/RecipeDetail'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/ai-assistant" element={<h1>AI Assistant</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
