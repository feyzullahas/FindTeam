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
import LineupBuilder from './pages/LineupBuilder'
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
    <div className="min-h-screen relative">
      {/* Soccer Field Background for authenticated users */}
      {user && (
        <>
          <div
            className="fixed inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: 'url(/soccer-field-night.jpg)',
              backgroundPosition: 'center center',
              backgroundAttachment: 'fixed',
            }}
          />
          <div className="fixed inset-0 bg-black/40 z-0" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
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
            <Route
              path="/edit-post/:postId"
              element={user ? <CreatePost /> : <Navigate to="/" />}
            />
            <Route path="/posts" element={user ? <Posts /> : <Navigate to="/" />} />
            <Route path="/my-posts" element={user ? <MyPosts /> : <Navigate to="/" />} />
            <Route path="/kadro" element={user ? <LineupBuilder /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
