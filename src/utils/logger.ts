/**
 * Safe Logger Utility
 * 
 * Provides logging functions that automatically redact sensitive information
 * Only logs in development mode
 */

const IS_DEV = import.meta.env.DEV || import.meta.env.MODE === 'development';

// List of sensitive keys to redact
const SENSITIVE_KEYS = [
  'password',
  'token',
  'access_token',
  'refresh_token',
  'access',
  'refresh',
  'secret',
  'api_key',
  'apiKey',
  'authorization',
  'auth',
  'session_id',
  'sessionId',
  'otp',
  'otp_code',
  'verification_code',
  'reset_token',
];

/**
 * Redact sensitive information from an object
 */
const redactSensitiveData = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item));
  }

  const redacted: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some(sensitiveKey => 
      lowerKey.includes(sensitiveKey.toLowerCase())
    );

    if (isSensitive) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
};

/**
 * Safe console.log that redacts sensitive data
 * Only logs in development mode
 */
export const safeLog = (...args: any[]) => {
  if (!IS_DEV) return;

  const redactedArgs = args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      return redactSensitiveData(arg);
    }
    return arg;
  });

  console.log(...redactedArgs);
};

/**
 * Safe console.error that redacts sensitive data
 */
export const safeError = (...args: any[]) => {
  const redactedArgs = args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      return redactSensitiveData(arg);
    }
    return arg;
  });

  console.error(...redactedArgs);
};

/**
 * Safe console.warn that redacts sensitive data
 * Only logs in development mode
 */
export const safeWarn = (...args: any[]) => {
  if (!IS_DEV) return;

  const redactedArgs = args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      return redactSensitiveData(arg);
    }
    return arg;
  });

  console.warn(...redactedArgs);
};

/**
 * Log only in development mode (no redaction)
 * Use for non-sensitive debug information
 */
export const devLog = (...args: any[]) => {
  if (IS_DEV) {
    console.log('[DEV]', ...args);
  }
};

/**
 * Log API requests safely (redacts sensitive headers and body)
 */
export const logApiRequest = (method: string, url: string, data?: any) => {
  if (!IS_DEV) return;

  safeLog(`[API Request] ${method} ${url}`, data ? redactSensitiveData(data) : '');
};

/**
 * Log API responses safely
 */
export const logApiResponse = (method: string, url: string, status: number, data?: any) => {
  if (!IS_DEV) return;

  safeLog(`[API Response] ${method} ${url} - ${status}`, data ? redactSensitiveData(data) : '');
};

export default {
  log: safeLog,
  error: safeError,
  warn: safeWarn,
  dev: devLog,
  apiRequest: logApiRequest,
  apiResponse: logApiResponse,
};
