import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import apfLogo from '../assets/logo_white.jpeg'
import '../assets/css/LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/otp')
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* LEFT SIDE */}
        <div className="login-left">
          <img src={apfLogo} alt="APF Logo" className="login-logo" />
          <h1>Your Professional Journey Begins Here 
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <h2>Member Login</h2>
          <span className="login-subtitle">
            Sign in to access your APF portal
          </span>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remember me
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>

            {/* SIGN UP */}
            <div className="signup-link">
              Don’t have an account?{' '}
              <Link to="/membership">Sign up</Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
