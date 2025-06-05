import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export default function FirebaseUrlSettings() {
  const [origin, setOrigin] = useState<string>("https://cryptopilot-18404.replit.app");
  const { toast } = useToast();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);
  
  const customVerificationUrl = `${origin}/verify-email?source=email_verification&%LINK%`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(customVerificationUrl);
    toast({
      title: "Copied to clipboard",
      description: "The verification URL has been copied to your clipboard"
    });
  };
  
  const openFirebaseConsole = () => {
    window.open("https://console.firebase.google.com/", "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Firebase Email Verification URL</CardTitle>
        <CardDescription>
          Copy this URL to set up custom email verification in your Firebase Console
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-md overflow-x-auto">
          <code className="text-xs font-mono break-all whitespace-pre-wrap">
            {customVerificationUrl}
          </code>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          
          <Button size="sm" variant="outline" onClick={openFirebaseConsole}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Firebase Console
          </Button>
        </div>
        
        <div className="text-sm mt-4 space-y-2">
          <p className="font-medium">Where to use this URL:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to Firebase Console → Authentication</li>
            <li>Select "Templates" tab</li>
            <li>Edit the "Verify email address" template</li>
            <li>Change the "Action URL" field to the URL above</li>
            <li>Save the template</li>
          </ol>
        </div>
        
        <Button 
          size="sm" 
          variant="link" 
          className="p-0 h-auto" 
          onClick={() => window.location.href = '/custom-verification-urls'}
        >
          View more email templates
        </Button>
      </CardContent>
    </Card>
  );
}