import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'

function App() {
  const token = localStorage.getItem('token')

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/feed" element={token ? <FeedPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={token ? "/feed" : "/login"} />} />
    </Routes>
  )
}

export default App