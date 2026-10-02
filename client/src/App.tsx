import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'
import RequestsPage from './pages/RequestsPage'
import ConnectionsPage from './pages/ConnectionsPage'
import MyPostsPage from './pages/MyPostsPage'
import ProfilePage from './pages/ProfilePage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const token = localStorage.getItem('token')

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/feed" element={token ? <FeedPage /> : <Navigate to="/login" />} />
      <Route path="/requests" element={token ? <RequestsPage /> : <Navigate to="/login" />} />
      <Route path="/connections" element={token ? <ConnectionsPage /> : <Navigate to="/login" />} />
      <Route path="/my-posts" element={token ? <MyPostsPage /> : <Navigate to="/login" />} />
      <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/profile/:userId" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/notifications" element={token ? <NotificationsPage /> : <Navigate to="/login" />} />
      <Route path="/settings" element={token ? <SettingsPage /> : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to={token ? "/feed" : "/login"} />} />

    </Routes>
  )
}

export default App