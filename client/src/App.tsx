import './App.css'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import ActivationPage from './pages/ActivationPage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/activate/:token" element={<ActivationPage />} />

      </Routes>
    </Router>
  )
}

export default App
