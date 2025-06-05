import { supabase } from "@/lib/supabase";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@supabase/supabase-js";

/**
 * Signs in a user with email and password through Supabase
 * @param email User email
 * @param password User password
 * @returns Supabase auth response
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    if (data.user) {
      await syncUserWithBackend(data.user);
    }
    
    return data;
  } catch (error) {
    console.error("Supabase sign in error:", error);
    throw error;
  }
}

/**
 * Registers a new user with email and password through Supabase
 * @param email User email
 * @param password User password
 * @returns Supabase auth response
 */
export async function signUpWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Sync new user with backend
    if (data.user) {
      try {
        await syncUserWithBackend(data.user);
      } catch (syncError) {
        console.warn("Initial Supabase user sync failed:", syncError);
        // Continue since account was created successfully
      }
    }
    
    return data;
  } catch (error) {
    console.error("Supabase sign up error:", error);
    throw error;
  }
}

/**
 * Initiates Google OAuth sign-in flow through Supabase
 * @returns Supabase auth response
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Supabase Google sign in error:", error);
    throw error;
  }
}

/**
 * Signs out a user from Supabase
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Supabase sign out error:", error);
    throw error;
  }
}

/**
 * Sends a password reset email through Supabase
 * @param email User email
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Supabase password reset error:", error);
    throw error;
  }
}

/**
 * Synchronizes a Supabase user with the backend
 * @param user Supabase user
 */
export async function syncUserWithBackend(user: User) {
  try {
    // Get the current session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      throw new Error("No active Supabase session");
    }
    
    // Get the access token from the session
    const accessToken = sessionData.session.access_token;
    
    if (!accessToken) {
      throw new Error("No access token available");
    }
    
    // Sync with backend
    const response = await apiRequest("POST", "/api/auth/supabase-sync", {
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        phone: user.phone,
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
        user_metadata: user.user_metadata
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to sync Supabase user with backend");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error syncing Supabase user with backend:", error);
    throw error;
  }
}

/**
 * Gets the current session from Supabase
 */
export function getSession() {
  return supabase.auth.getSession();
}

/**
 * Gets the current user from Supabase
 */
export function getUser() {
  return supabase.auth.getUser();
}

/**
 * Sets up an auth state change listener
 * @param callback Function to call when auth state changes
 */
export function onAuthStateChange(callback: (event: any, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}