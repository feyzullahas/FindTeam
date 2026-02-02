import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MyPosts from './pages/MyPosts'
import AuthSuccess from './pages/AuthSuccess'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Posts from './pages/Posts'
import Debug from './pages/Debug'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sadece giriş yapmış kullanıcılar navbar görsün */}
      {user && <Navbar />}

      <main className={user ? "pt-20" : ""}>
        <Routes>

          <Route path="/" element={user ? <Navigate to="/posts" /> : <Home />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/debug" element={<Debug />} />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/create-post"
            element={user ? <CreatePost /> : <Navigate to="/" />}
          />
          <Route path="/posts" element={user ? <Posts /> : <Navigate to="/" />} />
          <Route path="/my-posts" element={user ? <MyPosts /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
