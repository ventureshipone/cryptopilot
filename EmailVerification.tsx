import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { sendEmailVerification, auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

export function EmailVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user email is already verified
  const emailVerified = auth.currentUser?.emailVerified;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendVerification = async () => {
    if (!auth.currentUser) {
      setError("You must be logged in to verify your email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Set proper email verification settings with a custom URL
      const verificationSettings = {
        url: `${window.location.origin}/dashboard?verified=true`,
        handleCodeInApp: true,
      };
      
      // Add a delay to avoid Firebase rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Send email verification with custom settings
      await sendEmailVerification(auth.currentUser, verificationSettings);
      
      setSuccess(true);
      setCountdown(60); // 60 second cooldown
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and follow the link to verify your email",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Failed to send verification email:", err);
      // Handle specific Firebase error codes
      let errorMessage = "Failed to send verification email. Please try again later.";
      
      if (err.code === 'auth/too-many-requests') {
        errorMessage = "Too many verification emails sent. Please wait 24 hours before trying again.";
        setCountdown(120); // 2 minute cooldown for rate limiting
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshEmailStatus = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      // Force a re-render
      setSuccess(false);
      setSuccess(true);
    }
  };

  if (emailVerified) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Email Verification</CardTitle>
          <CardDescription>Your email has been verified</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertDescription>
              Your email address has been successfully verified. Thank you!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Email Verification</CardTitle>
        <CardDescription>Verify your email address to enhance your account security</CardDescription>
      </CardHeader>
      <CardContent>
        {user?.email ? (
          <>
            <p className="mb-4">
              Your current email: <strong>{user.email}</strong>
            </p>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200 mb-4">
                <AlertDescription>
                  Verification email sent successfully. Please check your inbox and click the verification link.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              You don't have an email associated with your account. Please add an email in your profile settings.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={refreshEmailStatus}
        >
          Check Verification Status
        </Button>
        <Button
          onClick={handleSendVerification}
          disabled={loading || countdown > 0 || !user?.email}
        >
          {loading ? 
            "Sending..." : 
            countdown > 0 ? 
              `Resend in ${countdown}s` : 
              "Send Verification Email"
          }
        </Button>
      </CardFooter>
    </Card>
  );
}