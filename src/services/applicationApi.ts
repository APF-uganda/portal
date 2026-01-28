/**
 * Application API Client
 * Feature: membership-registration-payment
 * 
 * Handles communication with the backend API for application submission.
 * Requirements: 9.2, 9.5, 13.2
 */

import axios, { AxiosError } from 'axios';
import { ApplicationSubmissionData } from '../types/registration';
import { Application } from '../types/Application';

/**
 * API base URL from environment variables
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Fetch applications (stub function for admin functionality)
 */
export async function fetchApplications(): Promise<Application[]> {
  // TODO: Implement actual API call when admin functionality is ready
  return [];
}

/**
 * API response for successful application submission
 */
export interface ApplicationAPIResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  nationalIdNumber: string;
  icpauCertificateNumber: string;
  organization?: string;
  paymentMethod: string;
  paymentPhone?: string;
  paymentCardNumber?: string;
  paymentCardExpiry?: string;
  paymentCardholderName?: string;
  paymentStatus?: string;
  paymentTransactionReference?: string;
  paymentErrorMessage?: string;
  status: string;
  submittedAt: string;
  documents: any[];
}

/**
 * API error response structure
 */
export interface ApplicationAPIError {
  errors: {
    [field: string]: string[];
  };
}

/**
 * Result type for application submission
 */
export interface SubmissionResult {
  success: boolean;
  data?: ApplicationAPIResponse;
  error?: string;
  fieldErrors?: {
    [field: string]: string[];
  };
}

/**
 * Submit application to backend API
 * 
 * Creates FormData with all application fields and uploaded documents,
 * sends POST request to /api/applications/, and handles response/errors.
 * 
 * @param applicationData - Complete application data including files
 * @returns Promise with submission result
 * 
 * Requirements: 9.2, 9.5, 13.2
 */
export async function submitApplication(
  applicationData: ApplicationSubmissionData
): Promise<SubmissionResult> {
  try {
    // Create FormData for multipart/form-data submission
    const formData = new FormData();
    
    // Add account details
    formData.append('username', applicationData.username);
    formData.append('email', applicationData.email);
    formData.append('password_hash', applicationData.password); // Backend expects password_hash
    
    // Add personal information
    formData.append('first_name', applicationData.firstName);
    formData.append('last_name', applicationData.lastName);
    formData.append('date_of_birth', applicationData.dateOfBirth);
    formData.append('phone_number', applicationData.phoneNumber);
    formData.append('address', applicationData.address);
    formData.append('national_id_number', applicationData.nationalIdNumber);
    formData.append('icpau_certificate_number', applicationData.icpauCertificateNumber);
    
    // Add optional organization field
    if (applicationData.organization) {
      formData.append('organization', applicationData.organization);
    }
    
    // Add payment information
    formData.append('payment_method', applicationData.paymentMethod);
    
    // Add payment-specific fields based on method
    if (applicationData.paymentMethod === 'mtn' || applicationData.paymentMethod === 'airtel') {
      if (applicationData.paymentPhone) {
        formData.append('payment_phone', applicationData.paymentPhone);
      }
    } else if (applicationData.paymentMethod === 'credit_card') {
      if (applicationData.paymentCardNumber) {
        formData.append('payment_card_number', applicationData.paymentCardNumber);
      }
      if (applicationData.paymentCardExpiry) {
        formData.append('payment_card_expiry', applicationData.paymentCardExpiry);
      }
      if (applicationData.paymentCardCvv) {
        formData.append('payment_card_cvv', applicationData.paymentCardCvv);
      }
      if (applicationData.paymentCardholderName) {
        formData.append('payment_cardholder_name', applicationData.paymentCardholderName);
      }
    }
    
    // Add payment processing fields
    if (applicationData.paymentStatus) {
      formData.append('payment_status', applicationData.paymentStatus);
    }
    if (applicationData.paymentTransactionReference) {
      formData.append('payment_transaction_reference', applicationData.paymentTransactionReference);
    }
    if (applicationData.paymentErrorMessage) {
      formData.append('payment_error_message', applicationData.paymentErrorMessage);
    }
    
    // Add document files
    applicationData.documents.forEach((file) => {
      formData.append('documents', file);
    });
    
    // Send POST request to backend
    const response = await axios.post<ApplicationAPIResponse>(
      `${API_BASE_URL}/api/v1/applications/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, 
      }
    );
    
    // Return success result
    return {
      success: true,
      data: response.data,
    };
    
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error);
    }
    
    // Handle unexpected errors
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Handle axios errors and convert to user-friendly messages
 * 
 * @param error - Axios error object
 * @returns Submission result with error information
 * 
 * Requirements: 9.5, 13.2
 */
function handleAxiosError(error: AxiosError<ApplicationAPIError>): SubmissionResult {
  // Network error (no response from server)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        success: false,
        error: 'Request timed out. Please check your connection and try again.',
      };
    }
    
    return {
      success: false,
      error: 'Unable to connect to the server. Please check your internet connection and try again.',
    };
  }
  
  // Server responded with error status
  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      // Bad Request - validation errors
      if (data && data.errors) {
        // Filter out empty errors
        const validErrors: { [field: string]: string[] } = {};
        for (const [field, errors] of Object.entries(data.errors)) {
          const nonEmptyErrors = errors.filter((err: string) => err && err.trim().length > 0);
          if (nonEmptyErrors.length > 0) {
            validErrors[field] = nonEmptyErrors;
          }
        }
        
        if (Object.keys(validErrors).length > 0) {
          return {
            success: false,
            error: 'Please correct the errors in your application.',
            fieldErrors: validErrors,
          };
        }
      }
      return {
        success: false,
        error: 'Invalid application data. Please check your information and try again.',
      };
    
    case 409:
      // Conflict - duplicate email/username
      if (data && data.errors) {
        // Filter out empty errors
        const validErrors: { [field: string]: string[] } = {};
        for (const [field, errors] of Object.entries(data.errors)) {
          const nonEmptyErrors = errors.filter((err: string) => err && err.trim().length > 0);
          if (nonEmptyErrors.length > 0) {
            validErrors[field] = nonEmptyErrors;
          }
        }
        
        if (Object.keys(validErrors).length > 0) {
          return {
            success: false,
            error: 'This email or username is already registered.',
            fieldErrors: validErrors,
          };
        }
      }
      return {
        success: false,
        error: 'This email or username is already registered.',
      };
    
    case 413:
      // Payload Too Large - file size exceeded
      return {
        success: false,
        error: 'One or more files are too large. Maximum file size is 5MB.',
      };
    
    case 500:
    case 502:
    case 503:
    case 504:
      // Server errors
      return {
        success: false,
        error: 'Something went wrong on our end. Please try again later.',
      };
    
    default:
      return {
        success: false,
        error: 'An error occurred while submitting your application. Please try again.',
      };
  }
}

/**
 * Parse field errors into a flat error message string
 * 
 * @param fieldErrors - Field errors from API response
 * @returns Formatted error message string
 */
export function formatFieldErrors(fieldErrors: { [field: string]: string[] }): string {
  const messages: string[] = [];
  
  for (const [field, errors] of Object.entries(fieldErrors)) {
    const fieldName = field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    errors.forEach((error) => {
      messages.push(`${fieldName}: ${error}`);
    });
  }
  
  return messages.join('\n');
}
