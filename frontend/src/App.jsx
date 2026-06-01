import { Route, Routes, Navigate } from "react-router-dom"
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import Newpost from "./pages/Newpost"
import Navbar from "./components/Navbar"
import { useAuth } from "./context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

const App = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="fixed w-full top-0 z-50">
        <Navbar />
      </div>
      <div className="pt-16 flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={<ProtectedRoute><Newpost /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}

export default App