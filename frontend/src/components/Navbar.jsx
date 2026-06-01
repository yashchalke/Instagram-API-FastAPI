import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 px-6 sm:px-12 flex items-center justify-between select-none">
      {/* Left side Logo/Brand Text */}
      <Link 
        to="/" 
        className="text-lg font-bold tracking-tight text-neutral-800 hover:text-neutral-600 transition-colors duration-150"
      >
        Social Media
      </Link>

      {/* Right side Action Buttons */}
      <div className="flex items-center gap-5">
        <Link 
          to="/create" 
          className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors duration-150 cursor-pointer"
        >
          Create
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="text-xs font-semibold bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer shadow-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/auth" 
            className="text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer shadow-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar