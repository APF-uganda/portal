import { useState, useEffect, useRef } from 'react';
import { Check, ShieldCheck, Loader2, X,AlertCircle, Mail } from 'lucide-react';
import Input from '../Input';
import { AccountDetailsData } from '../../../types/registration';
import { validateEmail } from '../../../lib/validators';
import { requestVerificationEmail, confirmVerificationCode } from '../../../services/authApi';

interface AccountDetailsStepProps {
  data: AccountDetailsData;
  onChange: (data: AccountDetailsData) => void;
  onValidationChange: (isValid: boolean) => void;
}

function AccountDetailsStep({ data, onChange, onValidationChange }: AccountDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [availabilityErrors, setAvailabilityErrors] = useState<Record<string, string>>({});
  
  // Verification States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpToken, setOtpToken] = useState<string>(''); 
  const [isVerifying, setIsVerifying] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Password Strength Logic
  const strength = {
    length: data.password.length >= 8,
    hasNumber: /\d/.test(data.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(data.password),
    hasUpper: /[A-Z]/.test(data.password),
  };
  const isPasswordStrong = Object.values(strength).every(Boolean);

  // 1. Validation Logic
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (!data.username?.trim()) newErrors.username = 'Username is required';
    if (!validateEmail(data.email).isValid) newErrors.email = 'Valid email is required';
    if (!isPasswordStrong) newErrors.password = 'Password too weak';
    if (data.password !== data.passwordConfirmation) newErrors.passwordConfirmation = 'Passwords must match';

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0 &&
                    Object.keys(availabilityErrors).length === 0 &&
                    isEmailVerified;
    
    onValidationChange(isValid);
  }, [data, availabilityErrors, isEmailVerified, isPasswordStrong, onValidationChange]);

  // 2. Send OTP Logic
  const handleSendOTP = async () => {
    if (!validateEmail(data.email).isValid || availabilityErrors.email) return;
  
    setIsVerifying(true);
    setServerError(null);

    try {
      const response = await requestVerificationEmail(data.email, data.username);
      
      // Save the token returned by Django's TimestampSigner
      if (response.token) {
        setOtpToken(response.token);
        setOtpSent(true);
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to send verification email.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 3. Verify Code Logic
  const handleVerifyOTP = async () => {
    if (otpValue.length < 6) return;
    
    setIsVerifying(true);
    setServerError(null);

    try {
      // Pass BOTH the code and the token back to the server
      await confirmVerificationCode(data.email, otpValue, otpToken);
      setIsEmailVerified(true);
      setOtpSent(false);
      setOtpValue('');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
        <ShieldCheck className="text-[#5E2590]" size={20} />
        Account Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Username"
          name="username"
          value={data.username}
          onChange={(e) => onChange({ ...data, username: e.target.value })}
          error={availabilityErrors.username || (touched.username ? errors.username : undefined)}
          required
        />

        <div className="relative">
          <Input
            label="Email Address"
            name="email"
            value={data.email}
            disabled={isEmailVerified || otpSent}
            onChange={(e) => {
              onChange({ ...data, email: e.target.value });
              setIsEmailVerified(false);
              setOtpSent(false);
            }}
            error={availabilityErrors.email || (touched.email ? errors.email : undefined)}
            required
          />
          {!isEmailVerified && !otpSent && validateEmail(data.email).isValid && !availabilityErrors.email && (
            <button 
              type="button"
              onClick={handleSendOTP}
              disabled={isVerifying}
              className="absolute right-2 top-[34px] text-xs font-bold text-[#5E2590] hover:underline disabled:opacity-50"
            >
              {isVerifying ? "Sending..." : "Verify Email"}
            </button>
          )}
          {isEmailVerified && (
            <div className="absolute right-3 top-10 flex items-center gap-1 text-xs font-bold text-green-600">
              <Check size={14} /> Verified
            </div>
          )}
        </div>
      </div>

      {/* OTP Input Section */}
      {otpSent && !isEmailVerified && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="text-[#5E2590]" size={18} />
            <p className="text-sm text-gray-700">Enter the 6-digit code sent to your email.</p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="Verification Code"
                name="otp"
                placeholder="000000"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                error={serverError || undefined}
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={isVerifying || otpValue.length !== 6}
              className="mt-[28px] px-6 h-[42px] bg-[#5E2590] text-white rounded-lg font-semibold hover:bg-[#4a1d72] disabled:opacity-50 flex items-center gap-2"
            >
              {isVerifying ? <Loader2 className="animate-spin" size={18} /> : "Verify"}
            </button>
          </div>
          <button 
            onClick={() => { setOtpSent(false); setServerError(null); }}
            className="mt-2 text-xs text-gray-500 hover:text-[#5E2590]"
          >
            Change email address
          </button>
        </div>
      )}

      {serverError && !otpSent && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          {serverError}
        </div>
      )}
        
        {/* Password Fields */}
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            error={touched.password ? errors.password : undefined}
            required
          />
          <div className="mt-3 grid grid-cols-2 gap-y-2">
            <StrengthItem label="8+ Characters" met={strength.length} />
            <StrengthItem label="Number" met={strength.hasNumber} />
            <StrengthItem label="Special Char" met={strength.hasSpecial} />
            <StrengthItem label="Uppercase" met={strength.hasUpper} />
          </div>
        </div>

        <Input
          label="Confirm Password"
          type="password"
          name="passwordConfirmation"
          value={data.passwordConfirmation}
          onChange={(e) => onChange({ ...data, passwordConfirmation: e.target.value })}
          error={touched.passwordConfirmation ? errors.passwordConfirmation : undefined}
          required
        />
      </div>
   
  );
}

function StrengthItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight ${met ? 'text-green-600' : 'text-gray-400'}`}>
      {met ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      {label}
    </div>
  );
}

export default AccountDetailsStep;