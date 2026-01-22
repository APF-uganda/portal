import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apfLogo from '../assets/logo_purple.png'
import loginImage from '../assets/images/Login-image/login.jpg'

function OtpPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState<string[]>(['', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 4) {
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
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5).split('')
    const newCode = [...code]

    digits.forEach((digit, i) => {
      newCode[i] = digit
    })

    setCode(newCode)
    inputRefs.current[Math.min(digits.length, 4)]?.focus()
  }

  const handleVerify = async () => {
    if (code.join('').length !== 5) {
      alert('Please enter the full 5-digit code')
      return
    }

    setIsVerifying(true)

    // TEMP: simulate verification
    setTimeout(() => {
      setIsVerifying(false)
      navigate('/dashboard') // next page later
    }, 2000)
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
          Enter the 5-digit code sent to <strong className="font-medium">your email</strong>
        </p>

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
              className="w-14 h-14 text-2xl font-mono text-center rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button 
          className="w-full py-4 rounded-xl bg-purple-600 text-white font-semibold text-lg shadow-lg hover:bg-purple-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
          onClick={handleVerify} 
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying…' : 'Verify'}
        </button>

        {/* Action Links */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => navigate('/login')} 
            className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
          >
            Back to Login
          </button>
          <button 
            onClick={() => alert('OTP resent')} 
            className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
          >
            Resend Code
          </button>
        </div>

      </div>
    </div>
  )
}

export default OtpPage
