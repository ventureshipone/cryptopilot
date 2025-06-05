import { useState, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { getAuth } from "firebase/auth";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard-fixed";
import Generate from "@/pages/generate";
import Convert from "@/pages/convert";
import Transfer from "@/pages/transfer";
import History from "@/pages/history";
import AIAnalysis from "@/pages/ai-analysis";
import AIRecommendations from "@/pages/ai-analysis/recommendations";
import AIAnomalies from "@/pages/ai-analysis/anomalies";
import AIChat from "@/pages/ai-analysis/chat";
import AIReports from "@/pages/ai-analysis/reports";
import Settings from "@/pages/settings";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import LogoutPage from "@/pages/auth/logout";
import AuthCallback from "@/pages/auth/callback";
import VerifyEmailPage from "@/pages/verify-email";
import VerificationRequired from "@/pages/auth/verification-required";
import KycVerification from "@/pages/kyc-verification";
import CustomVerificationUrls from "@/pages/auth/custom-verification-urls";
import RequiredTwoFactorSetup from "@/pages/auth/required-2fa-setup";
import AdminDashboard from "@/pages/admin";
import Profile from "@/pages/profile";
import Wallet from "@/pages/wallet";
import { AuthProvider } from "@/context/AuthContext";
import { FirebaseAuthProvider } from "@/context/FirebaseAuthContext";
import { Web3Provider } from "@/context/Web3Provider";
import { KycProvider, useKyc } from "@/context/KycContext";
import { useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { Loader2 } from "lucide-react";

// Protected route component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading, isEmailVerified, requiresSetup2FA } = useAuth();
  const [isFirebaseVerified, setIsFirebaseVerified] = useState<boolean | null>(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  
  // Direct check from Firebase for email verification status
  useEffect(() => {
    const checkFirebaseVerification = async () => {
      try {
        const auth = getAuth();
        if (auth.currentUser) {
          // Force reload to get fresh verification status
          await auth.currentUser.reload();
          setIsFirebaseVerified(auth.currentUser.emailVerified);
        } else {
          setIsFirebaseVerified(false);
        }
      } catch (err) {
        console.error("Error checking Firebase verification:", err);
        setIsFirebaseVerified(false);
      } finally {
        setIsCheckingVerification(false);
      }
    };
    
    if (isAuthenticated) {
      checkFirebaseVerification();
    } else {
      setIsCheckingVerification(false);
    }
  }, [isAuthenticated]);

  if (isLoading || isCheckingVerification) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  // Don't check email verification for settings page and make verification optional
  const [location] = window.location.pathname.split('?');
  const isSettingsPage = location === '/settings';
  
  // Email verification is now optional - only redirect if explicitly specified in user preferences
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const forceVerification = user?.preferences?.forceEmailVerification === true;
  
  if (!isSettingsPage && forceVerification) {
    const emailVerified = isEmailVerified || (isFirebaseVerified === true);
    if (!emailVerified) {
      return <Redirect to="/verification-required" />;
    }
  }

  // Check if this is a first login - if so, we'll show 2FA recommendation in Dashboard
  // but we won't force the user to set up 2FA

  return <Component />;
}

// KYC Protected route component
function KycProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { isKycVerified, kycStatus, showKycPrompt } = useKyc();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Only check after loading and if user is authenticated
    if (!isLoading && isAuthenticated) {
      // Check KYC status explicitly
      console.log("KYC Status Check:", { isKycVerified, kycStatus });
      
      // Only show prompt if not verified and not on KYC verification page already
      if (!isKycVerified && window.location.pathname !== '/kyc-verification') {
        showKycPrompt();
      }
    }
  }, [isKycVerified, kycStatus, isLoading, isAuthenticated, showKycPrompt]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <ProtectedRoute component={Component} />;
}

// Admin only route component
function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (user && user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/auth/reset-password" component={ResetPassword} />
      <Route path="/logout" component={LogoutPage} />
      <Route path="/auth/callback" component={AuthCallback} />
      
      {/* Protected user routes */}
      <Route path="/dashboard">
        <KycProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/generate">
        <KycProtectedRoute component={Generate} />
      </Route>
      <Route path="/convert">
        <KycProtectedRoute component={Convert} />
      </Route>
      <Route path="/transfer">
        <KycProtectedRoute component={Transfer} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/wallet">
        <KycProtectedRoute component={Wallet} />
      </Route>
      <Route path="/history">
        <KycProtectedRoute component={History} />
      </Route>
      <Route path="/ai-analysis">
        <KycProtectedRoute component={AIAnalysis} />
      </Route>
      <Route path="/analysis">
        <Redirect to="/ai-analysis" />
      </Route>
      <Route path="/ai-analysis/recommendations">
        <KycProtectedRoute component={AIRecommendations} />
      </Route>
      <Route path="/ai-analysis/anomalies">
        <KycProtectedRoute component={AIAnomalies} />
      </Route>
      <Route path="/ai-analysis/chat">
        <KycProtectedRoute component={AIChat} />
      </Route>
      <Route path="/ai-analysis/reports">
        <KycProtectedRoute component={AIReports} />
      </Route>
      
      {/* Authentication routes */}
      <Route path="/verify-email">
        <VerifyEmailPage />
      </Route>
      <Route path="/verification-required" component={VerificationRequired} />
      <Route path="/required-2fa-setup" component={RequiredTwoFactorSetup} />
      <Route path="/custom-verification-urls">
        <CustomVerificationUrls />
      </Route>
      
      {/* KYC verification */}
      <Route path="/kyc-verification">
        <ProtectedRoute component={KycVerification} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin">
        <AdminRoute component={AdminDashboard} />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseAuthProvider>
        <AuthProvider>
          <KycProvider>
            <Web3Provider>
              <ThemeProvider defaultTheme="light">
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </ThemeProvider>
            </Web3Provider>
          </KycProvider>
        </AuthProvider>
      </FirebaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
