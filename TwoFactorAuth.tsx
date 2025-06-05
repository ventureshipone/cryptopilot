import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { TOTPQRCode } from "./TOTPQRCode";

// Function to generate a real TOTP secret and QR code URL
// In a real implementation, this would be a secure random string
// and the URL would be a real TOTP URL for Google Authenticator
function generateTOTPSecret() {
  // This would be a secure random string in a real implementation
  return 'JBSWY3DPEHPK3PXP';
}

function generateTOTPQRCodeURL(secret: string, account: string, issuer: string) {
  // In a real implementation, this would generate a proper otpauth:// URL
  // Format: otpauth://totp/{issuer}:{account}?secret={secret}&issuer={issuer}
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = `secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  return `otpauth://totp/${label}?${params}`;
}

// This is a hardcoded secret for the prototype only
const DEMO_SECRET = 'JBSWY3DPEHPK3PXP';

interface TwoFactorAuthProps {
  onComplete?: () => void;
  required?: boolean;
}

export function TwoFactorAuth({ onComplete, required = false }: TwoFactorAuthProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, set2FAEnabled, is2FAEnabled } = useAuth();
  
  // Generate a TOTP secret for this user
  const secret = DEMO_SECRET;
  const account = user?.username || 'user@cryptopilot.com';
  
  // Check for existing 2FA status
  useEffect(() => {
    // Set the local component state based on the AuthContext value
    setIsEnabled(is2FAEnabled);
  }, [is2FAEnabled]);
  const issuer = 'CryptoPilot';

  // Check if 2FA is already enabled for the user (this would come from your user's profile)
  useEffect(() => {
    // Mock check if user has 2FA enabled - in production this would come from your API
    // In real implementation, this would be a call to your backend
    const check2FAStatus = async () => {
      // For this prototype, we're just using a dummy value
      // setIsEnabled would be set based on the backend response
      const userHas2FA = localStorage.getItem('user2FAEnabled') === 'true';
      setIsEnabled(userHas2FA);
    };

    check2FAStatus();
    
    // If 2FA is required, automatically start setup
    if (required && !isEnabled) {
      setIsSetupMode(true);
    }
  }, [required, isEnabled]);

  const handleStartSetup = async () => {
    setIsSetupMode(true);
    setError(null);
    
    try {
      // In a real implementation, this would make an API call to generate a 2FA secret
      // For prototype purposes, we're using a hardcoded secret
      
      toast({
        title: "2FA Setup Started",
        description: "Scan the QR code with Google Authenticator app",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to start 2FA setup:", err);
      setError("Failed to generate 2FA setup information");
      toast({
        title: "Error",
        description: "Failed to start 2FA setup. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyCode = async () => {
    setError(null);
    
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }
    
    try {
      // In a real implementation, this would verify the code against the server
      // For prototype purposes, we'll accept any 6-digit code
      const isValid = code.length === 6 && /^\d+$/.test(code);
      
      if (isValid) {
        // In a real implementation, this would call your API to enable 2FA
        localStorage.setItem('user2FAEnabled', 'true');
        
        // Save to backend
        try {
          // This would be a real API call in production
          // await fetch('/api/user/enable2fa', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ secret, verified: true })
          // });
          
          setIsEnabled(true);
          setIsSetupMode(false);
          
          // Update the 2FA status in AuthContext
          set2FAEnabled(true);
          
          toast({
            title: "2FA Enabled",
            description: "Two-factor authentication has been successfully enabled for your account",
            variant: "default",
          });
          
          // If onComplete callback is provided, call it
          if (onComplete) {
            onComplete();
          }
        } catch (error) {
          console.error("Failed to save 2FA status:", error);
          setError("Failed to save 2FA settings to your account. Please try again.");
        }
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      console.error("Failed to verify 2FA code:", err);
      setError("Failed to verify the code. Please try again.");
    }
  };

  const handleDisable2FA = async () => {
    // Don't allow disabling if required mode is on
    if (required) {
      toast({
        title: "Cannot Disable 2FA",
        description: "Two-factor authentication is required for your account and cannot be disabled",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real implementation, this would call your API to disable 2FA
      set2FAEnabled(false); // Update in AuthContext
      setIsEnabled(false);
      
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to disable 2FA:", err);
      toast({
        title: "Error",
        description: "Failed to disable 2FA. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  if (isSetupMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enhance your account security by setting up two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col items-center py-4">
              {/* Real TOTP QR code for Google Authenticator */}
              <div className="mb-4 text-center">
                <p className="text-sm text-blue-400 mb-2">Google Authenticator Setup</p>
                <TOTPQRCode 
                  secret={secret} 
                  account={account} 
                  issuer={issuer} 
                  size={200}
                />
              </div>
              
              {/* Google Authenticator compatible secret key */}
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-400 mb-2">If you can't scan the QR code, enter this setup key manually in Google Authenticator:</p>
                <p className="bg-gray-800 text-white px-3 py-2 rounded font-mono tracking-wide text-lg">
                  JBSW <span className="mx-1">·</span> Y3DP <span className="mx-1">·</span> EHPK <span className="mx-1">·</span> 3PXP
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  <p>Account: {account}</p>
                  <p>Type: Time-based</p>
                  <p>Issuer: {issuer}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Enter the 6-digit code from your authenticator app</h3>
              <div className="mb-4">
                <InputOTP 
                  maxLength={6} 
                  value={code} 
                  onChange={handleCodeChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsSetupMode(false)}>
            Cancel
          </Button>
          <Button onClick={handleVerifyCode}>
            Verify and Enable
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
        <CardDescription>
          {required 
            ? "Required: You must set up two-factor authentication to continue using your account"
            : "Add an extra layer of security to your account by enabling two-factor authentication"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEnabled ? (
          <Alert variant="default" className="bg-green-50 border-green-200 mb-4">
            <AlertDescription>
              Two-factor authentication is currently enabled for your account.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert 
              variant="default"
              className={`mb-4 ${required ? "border-amber-300 bg-amber-50" : ""}`}
            >
              <AlertDescription>
                {required 
                  ? "Two-factor authentication is required for your account. You must complete this setup to continue."
                  : "With two-factor authentication, you'll need both your password and a code from your authenticator app to sign in."
                }
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Recommended authenticator apps:</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Google Authenticator</li>
                <li>Microsoft Authenticator</li>
                <li>Authy</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {isEnabled ? (
          <Button 
            variant="destructive" 
            onClick={handleDisable2FA}
            disabled={required} // Disable button if 2FA is required
            title={required ? "Two-factor authentication is required for your account" : ""}
          >
            {required ? "Required" : "Disable 2FA"}
          </Button>
        ) : (
          <Button 
            onClick={handleStartSetup}
            className="bg-[#6366F1] hover:bg-[#5355D8] text-white"
          >
            {required ? "Continue Setup" : "Set Up 2FA"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}