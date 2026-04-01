import { useState, useEffect } from 'react';
import { Check, ShieldCheck, Loader2, X, AlertCircle, Mail, Eye, EyeOff } from 'lucide-react';
import Input from '../Input';
import { AccountDetailsData } from '../../../types/registration';
import { validateEmail } from '../../../lib/validators';
import { requestVerificationEmail, confirmVerificationCode } from '../../../services/authApi';
import { checkApplicationAvailability } from '../../../services/applicationApi';

interface AccountDetailsStepProps {
  data: AccountDetailsData;
  onChange: (data: AccountDetailsData) => void;
  onValidationChange: (isValid: boolean) => void;
}

function AccountDetailsStep({ data, onChange, onValidationChange }: AccountDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [availabilityErrors, setAvailabilityErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

  // Keep account availability checks server-backed to prevent duplicate submissions.
  useEffect(() => {
    const trimmedEmail = data.email.trim();
    const trimmedUsername = data.username.trim();
    const shouldCheckEmail = validateEmail(trimmedEmail).isValid;
    const shouldCheckUsername = trimmedUsername.length > 0;

    if (!shouldCheckEmail && !shouldCheckUsername) {
      setAvailabilityErrors({});
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      try {
        const availability = await checkApplicationAvailability({
          email: shouldCheckEmail ? trimmedEmail : undefined,
          username: shouldCheckUsername ? trimmedUsername : undefined,
        });

        if (cancelled) {
          return;
        }

        const nextErrors: Record<string, string> = {};
        if (shouldCheckEmail && !availability.email_available) {
          nextErrors.email = 'This email is already registered. Please use a different email or login to your existing account.';
        }
        if (shouldCheckUsername && !availability.username_available) {
          nextErrors.username = 'This username is already taken. Please choose a different username.';
        }
        setAvailabilityErrors(nextErrors);
      } catch {
        if (!cancelled) {
          setAvailabilityErrors({});
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [data.email, data.username]);

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

      <div className="space-y-4">
        {/* Username and Email Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Input
            label="Preferred Username"
            name="username"
            value={data.username}
            onChange={(e) => {
              onChange({ ...data, username: e.target.value });
              // Clear availability error when user starts typing
              if (availabilityErrors.username) {
                setAvailabilityErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.username;
                  return newErrors;
                });
              }
            }}
            error={availabilityErrors.username || (touched.username ? errors.username : undefined)}
            required
          />

          <div>
            <Input
              label="Email Address"
              name="email"
              value={data.email}
              disabled={isEmailVerified || otpSent}
              onChange={(e) => {
                onChange({ ...data, email: e.target.value });
                setIsEmailVerified(false);
                setOtpSent(false);
                // Clear availability error when user starts typing
                if (availabilityErrors.email) {
                  setAvailabilityErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                  });
                }
              }}
              error={availabilityErrors.email || (touched.email ? errors.email : undefined)}
              required
            />
            {isEmailVerified && (
              <div className="mt-1 flex items-center justify-end gap-1 text-xs font-bold text-green-600">
                <Check size={14} /> Verified
              </div>
            )}
          </div>
        </div>

        {/* Email Verification Button - More Prominent */}
        {!isEmailVerified && !otpSent && validateEmail(data.email).isValid && !availabilityErrors.email && (
          <div className="flex justify-center">
            <button 
              type="button"
              onClick={handleSendOTP}
              disabled={isVerifying}
              className="px-6 py-3 bg-[#5E2590] text-white rounded-lg font-semibold hover:bg-[#4a1d72] disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending Verification...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Verify Email Address
                </>
              )}
            </button>
          </div>
        )}
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
        
      {/* Password Fields - Only show after email verification */}
      {isEmailVerified && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-[#5E2590]" size={16} />
              Create Your Password
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Password <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={data.password}
                      onChange={(e) => onChange({ ...data, password: e.target.value })}
                      onBlur={() => setTouched(t => ({ ...t, password: true }))}
                      className={`w-full rounded-md border px-3 py-3 pr-10 text-sm sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      style={{ fontSize: '16px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-y-2">
                  <StrengthItem label="8+ Characters" met={strength.length} />
                  <StrengthItem label="Number" met={strength.hasNumber} />
                  <StrengthItem label="Special Char" met={strength.hasSpecial} />
                  <StrengthItem label="Uppercase" met={strength.hasUpper} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="passwordConfirmation"
                    value={data.passwordConfirmation}
                    onChange={(e) => onChange({ ...data, passwordConfirmation: e.target.value })}
                    onBlur={() => setTouched(t => ({ ...t, passwordConfirmation: true }))}
                    className={`w-full rounded-md border px-3 py-3 pr-10 text-sm sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${touched.passwordConfirmation && errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300'}`}
                    style={{ fontSize: '16px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.passwordConfirmation && errors.passwordConfirmation && (
                  <p className="text-sm text-red-500 mt-1">{errors.passwordConfirmation}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
