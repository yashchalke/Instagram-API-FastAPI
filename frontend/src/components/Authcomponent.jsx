import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Authcomponent = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [username,setusername] = useState("")
  const [email,setemail] = useState("")
  const [password,setpassword] = useState("")
  const [isactive,setactive] = useState(false)

  const handlesubmit = async (e) => {
    e.preventDefault();
    setactive(true)

    const url = isSignUp
  ? `${BACKEND_URL}/auth/register`
  : `${BACKEND_URL}/auth/login`;

    const bodyData = isSignUp 
      ? { username, email, password } 
      : { username, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      console.log("Success:", data);
      alert(isSignUp ? "Registration successful!" : "Login successful!");

      if (!isSignUp) {
        login(data);
        navigate("/");
      } else {
        setIsSignUp(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setactive(false)
    }
  }
  
  return (
    <div
      className="border w-120 h-120 rounded-2xl px-8 py-6 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col justify-between font-['Poppins',sans-serif] text-neutral-800"
    >
      {/* Brand Header using provided structure */}
      <div className="w-full pb-4 justify-center border-b border-gray-100 flex text-2xl font-bold tracking-tight text-neutral-800 select-none">
        <h1>Social Media</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col justify-center my-4">

        {/* Toggle Mode Title */}
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider text-center mb-6">
          {isSignUp ? "Create a new account" : "Log in to your account"}
        </h2>

        <form onSubmit={handlesubmit} className="space-y-4">
          <div className="space-y-3">

            {/* Username Field */}
            <div className="space-y-1">
              <h1 className="text-xs font-bold text-gray-500 tracking-wide uppercase">Username</h1>
              <input
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="johndoe_12"
                disabled={isactive}
                className="border border-gray-300 w-full px-3 py-2 text-sm rounded-lg bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Email Field (Sign Up / Register Only) */}
            {isSignUp && (
              <div className="space-y-1">
                <h1 className="text-xs font-bold text-gray-500 tracking-wide uppercase">Email</h1>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isactive}
                  className="border border-gray-300 w-full px-3 py-2 text-sm rounded-lg bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h1 className="text-xs font-bold text-gray-500 tracking-wide uppercase">Password</h1>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  disabled={isactive}
                  className="border border-gray-300 w-full pl-3 pr-14 py-2 text-sm rounded-lg bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer select-none"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

          </div>

          {/* Action Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isactive}
              className={`w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-150 text-center shadow-sm ${
                isactive 
                  ? "bg-neutral-500 cursor-not-allowed opacity-75" 
                  : "bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
              }`}
            >
              {isactive ? (isSignUp ? "Registering..." : "Logging in...") : (isSignUp ? "Register" : "Login")}
            </button>
          </div>
        </form>
      </div>

      {/* Switch mode footer */}
      <div className="w-full pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
        {isSignUp ? (
          <span>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="font-bold text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </button>
          </span>
        ) : (
          <span>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="font-bold text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
            >
              Register
            </button>
          </span>
        )}
      </div>
    </div>
  )
}

export default Authcomponent