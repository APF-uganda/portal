import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apfLogo from '../assets/logo_white.jpeg'
import '../assets/css/LoginPage.css'

function OtpPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()

    // TEMP: assume OTP is valid
    navigate('/member/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-form-section">

        <img src={apfLogo} alt="APF Logo" className="login-logo" />

        <div className="login-header">
          <h2>OTP Verification</h2>
          <p>Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            className="otp-input"
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Verify & Continue
          </button>
        </form>

      </div>
    </div>
  )
}

export default OtpPage
