import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MyPosts from './pages/MyPosts'
import AuthSuccess from './pages/AuthSuccess'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Posts from './pages/Posts'
import Debug from './pages/Debug'
import LineupBuilder from './pages/LineupBuilder'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()

  const darkBg = 'linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #065f46 100%)'
  const lightBg = 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: theme === 'dark' ? darkBg : lightBg}}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Yükleniyor...</span>
        </div>
      </div>
    )
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-fixed" style={{background: theme === 'dark' ? darkBg : lightBg}}>
      {user && <Navbar />}

      <main className={user ? "pt-16" : ""}>
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
            {/* Admin – separate auth, no normal user login required */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
    </div>
  )
}

export default App
