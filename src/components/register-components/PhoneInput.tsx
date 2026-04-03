import 'react-phone-number-input/style.css';
import ReactPhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { useState } from 'react';

const UG_MTN_REGEX = /^\+2567[6789]/;
const UG_AIRTEL_REGEX = /^\+2567[045]/;

interface PhoneInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  label?: string;
  required?: boolean;
  operator?: 'mtn' | 'airtel';
  error?: string;
}

function PhoneInputField({
  value,
  onChange,
  label = 'Phone Number',
  required = false,
  operator,
  error: externalError,
}: PhoneInputProps) {
  const [touched, setTouched] = useState(false);

  const getError = (): string | null => {
    if (!touched) return null;
    if (!value) return 'Phone number is required';
    if (!isValidPhoneNumber(value)) return 'Enter a valid phone number';

    if (value.startsWith('+256')) {
      const isMTN = UG_MTN_REGEX.test(value);
      const isAirtel = UG_AIRTEL_REGEX.test(value);
      if (operator === 'mtn' && !isMTN) return 'Please enter an MTN Uganda number (077, 078, 079, 076)';
      if (operator === 'airtel' && !isAirtel) return 'Please enter an Airtel Uganda number (070, 074, 075)';
      if (!operator && !isMTN && !isAirtel) return 'Enter a valid Uganda MTN or Airtel number';
    }

    return null;
  };

  const getHint = (): string | null => {
    if (!value || !value.startsWith('+256')) return null;
    if (UG_MTN_REGEX.test(value)) return '✓ MTN Uganda';
    if (UG_AIRTEL_REGEX.test(value)) return '✓ Airtel Uganda';
    return null;
  };

  const displayError = externalError || getError();
  const hint = !displayError ? getHint() : null;

  return (
    <div className="w-full">
      <label className="block text-sm text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={`flex items-center border rounded-md bg-white px-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 ${displayError ? 'border-red-500' : 'border-gray-300'}`}>
        <ReactPhoneInput
          placeholder="Enter phone number"
          value={value}
          onChange={onChange}
          defaultCountry="UG"
          international
          flags={flags}
          onBlur={() => setTouched(true)}
          className="w-full"
        />
      </div>
      {hint && <p className="text-xs text-green-600 mt-1">{hint}</p>}
      {displayError && <p className="text-sm text-red-500 mt-1">{displayError}</p>}
    </div>
  );
}

export default PhoneInputField;
