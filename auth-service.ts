import { apiRequest } from "@/lib/queryClient";
import { 
  loginWithEmailPassword as firebaseLoginWithEmail, 
  registerWithEmailPassword as firebaseRegisterWithEmail,
  signInWithGoogle as firebaseSignInWithGoogle,
  logoutUser as firebaseLogout,
  auth
} from "@/lib/firebase";

import {
  signInWithEmail as supabaseLoginWithEmail,
  signUpWithEmail as supabaseRegisterWithEmail,
  signInWithGoogle as supabaseSignInWithGoogle,
  signOut as supabaseLogout,
  syncUserWithBackend as syncSupabaseUserWithBackend
} from "@/lib/supabase-auth";

/**
 * Multi-database authentication service that synchronizes user data across:
 * 1. PostgreSQL (main app database)
 * 2. Firebase Authentication
 * 3. Supabase Authentication
 */
export class AuthService {
  /**
   * Logs in a user with email and password across all platforms
   */
  static async loginWithEmail(username: string, password: string) {
    try {
      console.log("Login process started for", username);
      
      // Try Firebase login first (prioritized auth provider)
      let firebaseUser = null;
      let supabaseUser = null;
      let syncedWithBackend = false;
      
      try {
        firebaseUser = await firebaseLoginWithEmail(username, password);
        console.log("Firebase login success");
        
        // Get ID token for backend sync
        if (firebaseUser) {
          const idToken = await auth.currentUser?.getIdToken();
          
          if (idToken) {
            // Sync with PostgreSQL backend
            const backendResponse = await apiRequest("POST", "/api/auth/firebase-sync", {
              idToken,
              email: username,
              displayName: firebaseUser.displayName || username
            });
            
            if (backendResponse.ok) {
              syncedWithBackend = true;
              console.log("Synced Firebase user with backend");
            }
          }
        }
      } catch (fbError) {
        console.error("Firebase login failed:", fbError);
        // Continue to other auth providers
      }
      
      // Try Supabase login if Firebase failed
      if (!firebaseUser || !syncedWithBackend) {
        try {
          const supabaseAuth = await supabaseLoginWithEmail(username, password);
          supabaseUser = supabaseAuth.user;
          console.log("Supabase login success");
          
          if (supabaseUser) {
            // Sync Supabase user with backend
            try {
              await syncSupabaseUserWithBackend(supabaseUser);
              syncedWithBackend = true;
              console.log("Synced Supabase user with backend");
            } catch (syncError) {
              console.error("Failed to sync Supabase user with backend:", syncError);
            }
          }
        } catch (supabaseError) {
          console.error("Supabase login failed:", supabaseError);
          // Continue to local auth
        }
      }
      
      // Fall back to local authentication if both Firebase and Supabase failed
      if (!syncedWithBackend) {
        console.log("Falling back to local authentication");
        const response = await apiRequest("POST", "/api/auth/login", { 
          username, 
          password 
        });
        
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        
        return await response.json();
      } else if (firebaseUser) {
        // If we synced with backend using Firebase, return that user
        const response = await apiRequest("GET", "/api/auth/me", {});
        if (response.ok) {
          return await response.json();
        }
      }
      
      // Final fallback - just try to get the current user from the backend
      const response = await apiRequest("GET", "/api/auth/me", {});
      if (response.ok) {
        return await response.json();
      }
      
      throw new Error("Authentication failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  
  /**
   * Registers a new user across all platforms
   */
  static async registerWithEmail(username: string, password: string, displayName?: string) {
    try {
      console.log("Registration process started for", username);
      
      // Start with Firebase registration (primary auth provider)
      let firebaseUser = null;
      let supabaseUser = null;
      let registeredWithBackend = false;
      
      try {
        // Register with Firebase
        firebaseUser = await firebaseRegisterWithEmail(username, password, displayName || username);
        console.log("Firebase registration success");
        
        // Get ID token for backend sync
        if (firebaseUser && auth.currentUser) {
          const idToken = await auth.currentUser.getIdToken();
          
          if (idToken) {
            // Sync with PostgreSQL backend
            const backendResponse = await apiRequest("POST", "/api/auth/firebase-sync", {
              idToken,
              email: username,
              displayName: displayName || username
            });
            
            if (backendResponse.ok) {
              registeredWithBackend = true;
              console.log("Synced new Firebase user with backend");
            }
          }
        }
      } catch (fbError) {
        console.error("Firebase registration failed:", fbError);
      }
      
      // Try Supabase registration (even if Firebase succeeded, we want user in all DBs)
      try {
        const supabaseAuth = await supabaseRegisterWithEmail(username, password);
        supabaseUser = supabaseAuth.user;
        console.log("Supabase registration success");
        
        if (supabaseUser) {
          // Sync Supabase user with backend
          try {
            await syncSupabaseUserWithBackend(supabaseUser);
            console.log("Synced new Supabase user with backend");
            registeredWithBackend = true;
          } catch (syncError) {
            console.error("Failed to sync new Supabase user with backend:", syncError);
          }
        }
      } catch (supabaseError) {
        console.error("Supabase registration failed:", supabaseError);
      }
      
      // If Firebase and Supabase registration/sync failed, register directly with backend
      if (!registeredWithBackend) {
        console.log("Direct backend registration as fallback");
        const response = await apiRequest("POST", "/api/auth/register", {
          username,
          password,
          displayName: displayName || username,
          email: username
        });
        
        if (!response.ok) {
          throw new Error("Registration failed");
        }
        
        return await response.json();
      }
      
      // Final check - get the current user from the backend
      const response = await apiRequest("GET", "/api/auth/me", {});
      if (response.ok) {
        return await response.json();
      }
      
      throw new Error("Registration completed but user session not established");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }
  
  /**
   * Sign in with Google across all platforms
   */
  static async loginWithGoogle() {
    try {
      // Try Firebase Google login first
      try {
        await firebaseSignInWithGoogle();
        // The Firebase auth state listener will handle the session setup
        return true;
      } catch (fbError) {
        console.error("Firebase Google login failed:", fbError);
      }
      
      // Try Supabase Google login as fallback
      try {
        await supabaseSignInWithGoogle();
        // The redirect will handle the rest
        return true;
      } catch (supabaseError) {
        console.error("Supabase Google login failed:", supabaseError);
      }
      
      throw new Error("Google login failed");
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }
  
  /**
   * Logs out from all platforms
   */
  static async logout() {
    try {
      // Logout from PostgreSQL backend first
      await apiRequest("POST", "/api/auth/logout", {});
      
      // Logout from Firebase
      try {
        await firebaseLogout();
      } catch (fbError) {
        console.error("Firebase logout error:", fbError);
      }
      
      // Logout from Supabase
      try {
        await supabaseLogout();
      } catch (supabaseError) {
        console.error("Supabase logout error:", supabaseError);
      }
      
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}