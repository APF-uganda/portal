import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = BASE.endsWith('/api/v1') ? BASE : `${BASE}/api/v1`;

console.log("Current API Target:", API_URL); 

/**
 * requestVerificationEmail
 * Returns { status: "OTP sent", token: "...", message: "..." }
 */
export const requestVerificationEmail = async (email: string, username: string) => {
  try {
    const response = await axios.post(`${API_URL}/applications/send-otp/`, {
      email: email.trim().toLowerCase(),
      user_name: username,
    });
    // This response now contains the 'token' we need for the next step
    return response.data;
  } catch (error) {
    console.error("Error in requestVerificationEmail:", error);
    throw error;
  }
};

/**
 * confirmVerificationCode
 * Now requires the 'token' returned by requestVerificationEmail
 */
export const confirmVerificationCode = async (email: string, code: string, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/applications/verify-otp/`, {
      email: email.trim().toLowerCase(),
      verification_code: code,
      token: token, // <--- Crucial: Sending the signer token back to the server
    });
    return response.data;
  } catch (error) {
    console.error("Error in confirmVerificationCode:", error);
    throw error;
  }
};