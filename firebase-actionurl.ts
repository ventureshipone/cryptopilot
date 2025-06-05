import { ActionCodeSettings } from 'firebase/auth';

/**
 * This file provides custom action URL settings for Firebase Authentication
 * to ensure password reset, email verification, and other actions use our custom pages
 */

// Get the current domain from the window location or use a default
const getDomain = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://cryptopilot-18404.replit.app'; // Update this with your actual deployed URL
};

/**
 * Create ActionCodeSettings for customizing Firebase Authentication URLs
 * 
 * Important: For custom actions to work with custom UI:
 * 1. The URL must be added to Firebase console's Authorized Domains
 * 2. The URL should contain the actual page path
 * 3. The oobCode needs to be passed as a query parameter
 */
export function getActionCodeSettings(action: 'resetPassword' | 'verifyEmail' = 'resetPassword'): ActionCodeSettings {
  let url: string;
  
  switch (action) {
    case 'verifyEmail':
      url = `${getDomain()}/verify-email?source=email_verification&%LINK%`;
      break;
    case 'resetPassword':
    default:
      url = `${getDomain()}/reset-password`;
      break;
  }
  
  return {
    // URL you want to redirect back to after action
    // The ?mode=resetPassword and &oobCode=... will be appended by Firebase
    url,
    // This is required for URL customization to work
    handleCodeInApp: true,
  };
}

/**
 * Get email verification action code settings
 */
export function getEmailVerificationSettings(): ActionCodeSettings {
  return getActionCodeSettings('verifyEmail');
}

/**
 * Get password reset action code settings
 */
export function getPasswordResetSettings(): ActionCodeSettings {
  return getActionCodeSettings('resetPassword');
}