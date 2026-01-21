import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apfLogo from '../assets/logo_purple.png'
import '../assets/css/OtpPage.css'

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
    <div className="otp-page">
      <div className="otp-card">

        <div className="otp-logo-wrapper">
  <img src={apfLogo} alt="APF Logo" className="otp-logo" />
</div>


        <h2>Verify Your Account</h2>
        <p className="otp-subtitle">
          Enter the 5-digit code sent to <strong>your email</strong>
        </p>

        <div className="otp-inputs">
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
            />
          ))}
        </div>

        <button className="otp-btn" onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? 'Verifying…' : 'Verify'}
        </button>

        <div className="otp-links">
          <button onClick={() => navigate('/login')} className="link-btn">
            Back to Login
          </button>
          <button onClick={() => alert('OTP resent')} className="link-btn">
            Resend Code
          </button>
        </div>

      </div>
    </div>
  )
}

export default OtpPage
