import { useState, useEffect } from 'react';
import Input from '../Input';
import { AccountDetailsData } from '../../../types/registration';
import {
  validateEmail,
  validatePasswordLength,
  validatePasswordMatch,
} from '../../../lib/validators';

interface AccountDetailsStepProps {
  data: AccountDetailsData;
  onChange: (data: AccountDetailsData) => void;
  onValidationChange: (isValid: boolean) => void;
}

function AccountDetailsStep({ data, onChange, onValidationChange }: AccountDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate all fields and update validation state
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    // Validate username (required)
    if (!data.username || data.username.trim() === '') {
      newErrors.username = 'Username is required';
    }

    // Validate email
    if (!data.email || data.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else {
      const emailResult = validateEmail(data.email);
      if (!emailResult.isValid) {
        newErrors.email = emailResult.errorMessage || 'Invalid email';
      }
    }

    // Validate password
    if (!data.password || data.password.trim() === '') {
      newErrors.password = 'Password is required';
    } else {
      const passwordResult = validatePasswordLength(data.password);
      if (!passwordResult.isValid) {
        newErrors.password = passwordResult.errorMessage || 'Invalid password';
      }
    }

    // Validate password confirmation
    if (!data.passwordConfirmation || data.passwordConfirmation.trim() === '') {
      newErrors.passwordConfirmation = 'Password confirmation is required';
    } else if (data.password) {
      const matchResult = validatePasswordMatch(data.password, data.passwordConfirmation);
      if (!matchResult.isValid) {
        newErrors.passwordConfirmation = matchResult.errorMessage || 'Passwords do not match';
      }
    }

    setErrors(newErrors);

    // Notify parent of validation state
    const isValid = Object.keys(newErrors).length === 0 &&
                    data.username.trim() !== '' &&
                    data.email.trim() !== '' &&
                    data.password.trim() !== '' &&
                    data.passwordConfirmation.trim() !== '';
    
    onValidationChange(isValid);
  }, [data, onValidationChange]);

  const handleFieldChange = (field: keyof AccountDetailsData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleBlur = (field: keyof AccountDetailsData) => {
    setTouched({
      ...touched,
      [field]: true,
    });
  };

  const getFieldError = (field: keyof AccountDetailsData): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  return (
    <>
      <h3 className="font-semibold text-gray-800 mb-6 text-center">
        Account Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Username"
          type="text"
          placeholder="johndoe"
          name="username"
          value={data.username}
          onChange={(e) => handleFieldChange('username', e.target.value)}
          onBlur={() => handleBlur('username')}
          error={getFieldError('username')}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          name="email"
          value={data.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={getFieldError('email')}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          name="password"
          value={data.password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={getFieldError('password')}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          name="passwordConfirmation"
          value={data.passwordConfirmation}
          onChange={(e) => handleFieldChange('passwordConfirmation', e.target.value)}
          onBlur={() => handleBlur('passwordConfirmation')}
          error={getFieldError('passwordConfirmation')}
          required
        />
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Password must be at least 8 characters
      </p>
    </>
  );
}

export default AccountDetailsStep;