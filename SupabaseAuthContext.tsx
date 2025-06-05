import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getUser, getSession } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Define the auth context type
type SupabaseAuthContextType = {
  user: User | null;
  session: any;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  syncUserWithBackend: (user: User) => Promise<void>;
};

// Create the auth context with default values
const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  signOut: async () => {},
  syncUserWithBackend: async () => {},
});

// Auth provider component
export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Function to sync Supabase user with our backend
  const syncUserWithBackend = async (currentUser: User) => {
    if (!currentUser) return;
    
    try {
      // Get id token
      const { data: { session } } = await getSession();
      if (!session) return;
      
      const token = session.access_token;
      
      // Call backend API to sync user data
      const response = await fetch('/api/auth/supabase-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user: {
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.email?.split('@')[0], // Fallback username from email
            displayName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
            profilePicture: currentUser.user_metadata?.avatar_url
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync user with backend');
      }
      
      // Successful sync
      console.log('User synced with backend');
    } catch (err: any) {
      console.error('Error syncing user with backend:', err);
      toast({
        title: 'Sync Error',
        description: 'Failed to sync user data with the server.',
        variant: 'destructive'
      });
      setError(err);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);

      // Call backend logout
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      toast({
        title: 'Signed Out',
        description: 'You have been signed out successfully.',
      });
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err);
      toast({
        title: 'Sign Out Error',
        description: 'Failed to sign out.',
        variant: 'destructive'
      });
    }
  };

  // Update auth state when it changes
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Get current session and user
        const { data: { session } } = await getSession();
        const { data: { user } } = await getUser();
        
        setSession(session);
        setUser(user);

        if (user) {
          await syncUserWithBackend(user);
        }
      } catch (err: any) {
        console.error('Error initializing auth:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user || null);

        if (event === 'SIGNED_IN' && session?.user) {
          await syncUserWithBackend(session.user);
        }
      }
    );

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Context value
  const value = {
    user,
    session,
    loading,
    error,
    signOut: handleSignOut,
    syncUserWithBackend
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

// Hook to use the auth context
export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};