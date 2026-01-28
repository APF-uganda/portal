import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apfLogo from '../assets/logo_purple.png'
import loginImage from '../assets/images/Login-image/login.jpg'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function OtpPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get session_id from sessionStorage
    const storedSessionId = sessionStorage.getItem('otp_session_id')
    const storedRememberMe = sessionStorage.getItem('remember_me') === 'true'
    const storedEmail = sessionStorage.getItem('login_email') || ''
    
    if (!storedSessionId) {
      // No session_id means user didn't come from login page
      navigate('/login')
      return
    }
    
    setSessionId(storedSessionId)
    setRememberMe(storedRememberMe)
    setEmail(storedEmail)
    inputRefs.current[0]?.focus()
  }, [navigate])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    const newCode = [...code]

    digits.forEach((digit, i) => {
      newCode[i] = digit
    })

    setCode(newCode)
    inputRefs.current[Math.min(digits.length, 5)]?.focus()
  }

  const handleVerify = async () => {
    const otpCode = code.join('')
    
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          otp: otpCode,
          remember_me: rememberMe,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store tokens
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Clear session storage
        sessionStorage.removeItem('otp_session_id')
        sessionStorage.removeItem('remember_me')
        sessionStorage.removeItem('login_email')
        
        // Redirect based on role
        if (data.user.role === '1') {
          navigate('/admin/dashboard')
        } else {
          navigate('/member/dashboard')
        }
      } else {
        setError(data.error?.message || 'Invalid or expired OTP code')
      }
    } catch (err) {
      console.error('OTP verification error:', err)
      setError('Unable to connect to server. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    
    try {
      // Re-login to get a new OTP
      const loginEmail = sessionStorage.getItem('login_email')
      if (!loginEmail) {
        navigate('/login')
        return
      }

      alert('Please login again to receive a new OTP code')
      navigate('/login')
    } catch (err) {
      console.error('Resend OTP error:', err)
      setError('Unable to resend OTP. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/60 to-black/60 bg-center bg-cover flex items-center justify-center p-4"
    style={{ backgroundImage: `url(${loginImage})` }}>
      <div className="bg-white backdrop-blur-sm p-12 rounded-2xl w-full max-w-md text-center shadow-2xl shadow-black/35">
        
        {/* Logo Wrapper */}
        <div className="w-full flex justify-center items-center mb-6">
          <img src={apfLogo} alt="APF Logo" className="w-36 mb-5" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h2>
        
        <p className="text-gray-600 text-sm mb-8">
          Enter the 6-digit code sent to <strong className="font-medium">{email || 'your email'}</strong>
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* OTP Inputs */}
        <div className="flex justify-between mb-8 gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isVerifying}
              className="w-12 h-14 text-2xl font-mono text-center rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 bg-white shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button 
          className="w-full py-4 rounded-xl bg-purple-600 text-white font-semibold text-lg shadow-lg hover:bg-purple-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2" 
          onClick={handleVerify} 
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying…
            </>
          ) : (
            'Verify'
          )}
        </button>

        {/* Action Links */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => navigate('/login')} 
            disabled={isVerifying}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back to Login
          </button>
          <button 
            onClick={handleResendOTP}
            disabled={isVerifying}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend Code
          </button>
        </div>

      </div>
    </div>
  )
}

export default OtpPage
