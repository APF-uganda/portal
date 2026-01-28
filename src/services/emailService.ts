/**
 * EmailJS Service for sending emails from frontend
 * Note: EmailJS only works from browser, not from backend servers
 */

import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_algcmhn';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'cA_eld2ezDC7RRjxD';
const EMAILJS_TEMPLATE_ID_OTP = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OTP || 'template_le2zqzf';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface SendOTPEmailParams {
  to_email: string;
  otp_code: string;
  user_name?: string;
}

/**
 * Send OTP email using EmailJS from frontend
 */
export const sendOTPEmail = async (params: SendOTPEmailParams): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: params.to_email,
      otp_code: params.otp_code,
      user_name: params.user_name || params.to_email.split('@')[0],
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_OTP,
      templateParams
    );

    if (response.status === 200) {
      console.log('✅ OTP email sent successfully via EmailJS');
      return true;
    } else {
      console.error('❌ EmailJS error:', response);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
};
