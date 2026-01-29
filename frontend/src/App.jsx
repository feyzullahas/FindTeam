import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AuthSuccess from './pages/AuthSuccess'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Posts from './pages/Posts'
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
      
      <main className={user ? "container mx-auto px-4 py-8" : ""}>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/" />} 
          />
          <Route 
            path="/create-post" 
            element={user ? <CreatePost /> : <Navigate to="/" />} 
          />
          <Route path="/posts" element={user ? <Posts /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
