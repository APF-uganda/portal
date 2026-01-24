import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import apfLogo from '../assets/whitelogo.png'
import loginImage from '../assets/images/Login-image/login.jpg'

function LoginPage() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  navigate('/otp')
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center
      bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6))]"
      style={{ backgroundImage: `url(${loginImage})` }}
      >

      <div className="w-[90%] max-w-5xl grid grid-cols-1 md:grid-cols-2
        bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center px-10 py-16 text-white text-center md:text-left">
          <img src={apfLogo} alt="APF Logo" className="w-56 mx-auto md:mx-0" />
          <h1 className="mt-8 text-3xl md:text-4xl font-semibold leading-tight">
            Your Professional Journey Begins Here
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white px-10 py-14 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-900">Member Login</h2>
          <span className="text-gray-500 mt-1 mb-8">
            Sign in to access your APF portal
          </span>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="mt-2 w-full rounded-lg border-2 border-gray-200 px-4 py-3
                  focus:outline-none focus:border-purple-600
                  focus:ring-4 focus:ring-purple-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 pr-12
                    focus:outline-none focus:border-purple-600
                    focus:ring-4 focus:ring-purple-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs text-gray-600">

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-purple-600"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-purple-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 py-3 text-white font-semibold
                hover:bg-purple-700 transition"
            >
              Sign In
            </button>

            {/* Sign up */}
            <div className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="text-purple-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
