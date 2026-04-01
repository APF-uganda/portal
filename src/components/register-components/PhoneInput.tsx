/**
 * PhoneInput — country code dropdown + local number field.
 *
 * Uganda (+256) rules (ITU / BubblyPhone):
 *   - User enters local part: 07XXXXXXXX (10 digits) or 7XXXXXXXX (9 digits)
 *   - Allowed prefixes: Airtel 070/074/075, MTN 076/077/078/079
 *   - Stored/submitted as: +2567XXXXXXXX (no leading 0, no spaces)
 *
 * Other countries: basic length check only (7–12 digits).
 */

import { useState } from 'react';

const COUNTRY_CODES = [
  { code: '256' },
  { code: '254' },
  { code: '255' },
  { code: '250' },
  { code: '251' },
  { code: '211' },
];

// Uganda valid prefixes after stripping leading 0
// local: 07X → stored: 7X
const UG_VALID_PREFIXES = ['70', '74', '75', '76', '77', '78', '79'];
const UG_AIRTEL = ['70', '74', '75'];
const UG_MTN    = ['76', '77', '78', '79'];

/**
 * Normalise whatever the user typed into a clean local part (no leading 0, digits only).
 * Returns null if the input is clearly invalid.
 */
function normaliseLocal(raw: string, countryCode: string): string {
  // Strip spaces, dashes, parens, leading +countryCode or +0
  let s = raw.replace(/[\s\-()]/g, '');

  // If user pasted full international e.g. +256741234567 or 256741234567
  if (s.startsWith(`+${countryCode}`)) s = s.slice(countryCode.length + 1);
  else if (s.startsWith(countryCode)) s = s.slice(countryCode.length);

  // Strip leading 0 for Uganda (07X → 7X)
  if (countryCode === '256' && s.startsWith('0')) s = s.slice(1);

  return s.replace(/\D/g, '');
}

function validateUganda(local: string, operator?: 'mtn' | 'airtel'): string | null {
  if (!local) return 'Phone number is required';
  if (local.length !== 9) return 'Enter 9 digits starting with 7 (e.g. 7XXXXXXXXX)';
  const prefix = local.slice(0, 2);
  if (!UG_VALID_PREFIXES.includes(prefix)) {
    return 'Use an MTN (076–079) or Airtel (070, 074, 075) Uganda number';
  }
  if (operator === 'mtn' && !UG_MTN.includes(prefix)) {
    return 'Please enter an MTN Uganda number (077, 078, 079, 076)';
  }
  if (operator === 'airtel' && !UG_AIRTEL.includes(prefix)) {
    return 'Please enter an Airtel Uganda number (070, 074, 075)';
  }
  return null;
}

function validateOther(local: string): string | null {
  if (!local) return 'Phone number is required';
  if (local.length < 7 || local.length > 12) return 'Enter a valid phone number';
  return null;
}

interface PhoneInputProps {
  /** Called with the normalised international value e.g. "+256771234567" */
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  required?: boolean;
  /** If set, only numbers matching this operator are accepted (Uganda only) */
  operator?: 'mtn' | 'airtel';
}

export function PhoneInput({ onChange, onBlur, error, label = 'Phone Number', required = false, operator }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('256');
  const [localInput, setLocalInput] = useState('');
  const [touched, setTouched] = useState(false);

  const handleLocalChange = (raw: string) => {
    // Only allow digits (and leading 0 for convenience)
    const cleaned = raw.replace(/[^\d]/g, '').slice(0, countryCode === '256' ? 10 : 12);
    setLocalInput(cleaned);

    const normalised = normaliseLocal(cleaned, countryCode);
    const international = normalised ? `+${countryCode}${normalised}` : '';
    onChange(international);
  };

  const handleCodeChange = (code: string) => {
    setCountryCode(code);
    const normalised = normaliseLocal(localInput, code);
    const international = normalised ? `+${code}${normalised}` : '';
    onChange(international);
  };

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  // Inline validation for display
  const getInlineError = (): string | null => {
    if (!touched) return null;
    const normalised = normaliseLocal(localInput, countryCode);
    if (countryCode === '256') return validateUganda(normalised, operator);
    return validateOther(normalised);
  };

  // Operator hint for Uganda
  const getOperatorHint = (): string | null => {
    if (countryCode !== '256' || !localInput) return null;
    const normalised = normaliseLocal(localInput, '256');
    const prefix = normalised.slice(0, 2);
    if (UG_MTN.includes(prefix)) return '✓ MTN Uganda';
    if (UG_AIRTEL.includes(prefix)) return '✓ Airtel Uganda';
    return null;
  };

  const displayError = error || getInlineError();
  const operatorHint = getOperatorHint();

  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex">
        <select
          value={countryCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              +{c.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          placeholder={countryCode === '256' ? '7XXXXXXXXX' : 'Phone number'}
          value={localInput}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={handleBlur}
          className={`flex-1 rounded-r-md border px-3 py-3 text-sm sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${displayError ? 'border-red-500' : 'border-gray-300'}`}
          style={{ fontSize: '16px' }}
        />
      </div>
      {operatorHint && !displayError && (
        <p className="text-xs text-green-600 mt-1">{operatorHint}</p>
      )}
      {displayError && (
        <p className="text-sm text-red-500 mt-1">{displayError}</p>
      )}
    </div>
  );
}

export default PhoneInput;
