import { useState, useEffect } from "react";
import { PlusCircle, Copy, Trash, EyeOff, Eye } from "lucide-react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// This would be the actual API type from your schema in a real implementation
type ApiKey = {
  id: number;
  name: string;
  key: string;
  permissions: "read" | "write" | "admin";
  lastUsed?: string;
  createdAt: string;
  expiresAt?: string;
};

export function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermission, setNewKeyPermission] = useState<"read" | "write" | "admin">("read");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isShowingKeys, setIsShowingKeys] = useState<Record<number, boolean>>({});
  const [showNewKey, setShowNewKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an actual API call
      // For this prototype, we're using mock data stored in localStorage
      const storedKeys = localStorage.getItem('userApiKeys');
      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      } else {
        setApiKeys([]);
      }
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
      toast({
        title: "Error",
        description: "Failed to load your API keys. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiKey = () => {
    // In a real implementation, this would be generated on the server
    // This is just a mock for demonstration purposes
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'cp_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "API key name is required",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingKey(true);
    try {
      const generatedKey = generateApiKey();
      
      // Create a new API key object
      const newApiKey: ApiKey = {
        id: Date.now(),
        name: newKeyName,
        key: generatedKey,
        permissions: newKeyPermission,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      };
      
      // Add to local state
      const updatedKeys = [...apiKeys, newApiKey];
      setApiKeys(updatedKeys);
      
      // In a real implementation, this would be saved via API
      // For this prototype, we're using localStorage
      localStorage.setItem('userApiKeys', JSON.stringify(updatedKeys));
      
      // Display the newly created key
      setNewKey(generatedKey);
      setShowNewKey(false); // Default to hidden

      toast({
        title: "API Key Created",
        description: "Your new API key has been created successfully.",
        variant: "default",
      });
      
      // Reset form
      setNewKeyName("");
      setNewKeyPermission("read");
    } catch (error) {
      console.error("Failed to create API key:", error);
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingKey(false);
    }
  };

  const deleteApiKey = async (id: number) => {
    try {
      // Filter out the deleted key
      const updatedKeys = apiKeys.filter(key => key.id !== id);
      setApiKeys(updatedKeys);
      
      // In a real implementation, this would be deleted via API
      // For this prototype, we're using localStorage
      localStorage.setItem('userApiKeys', JSON.stringify(updatedKeys));
      
      toast({
        title: "API Key Deleted",
        description: "The API key has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete API key:", error);
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
        variant: "default",
      });
    }).catch(err => {
      console.error("Failed to copy:", err);
      toast({
        title: "Error",
        description: "Failed to copy API key to clipboard",
        variant: "destructive",
      });
    });
  };

  const toggleKeyVisibility = (id: number) => {
    setIsShowingKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return format(new Date(dateString), "PP");
  };

  const maskApiKey = (key: string) => {
    if (!key) return "";
    const prefix = key.substring(0, 5);
    const suffix = key.substring(key.length - 4);
    return `${prefix}...${suffix}`;
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case "read":
        return "Read Only";
      case "write":
        return "Read & Write";
      case "admin":
        return "Full Access";
      default:
        return permission;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">API Key Management</CardTitle>
        <CardDescription>
          Manage your API keys for programmatic access to CryptoPilot
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 && !isLoading ? (
          <div className="text-center py-6 text-gray-500">
            <p>You don't have any API keys yet.</p>
            <p className="mt-2">Create one to start integrating with the CryptoPilot API.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {isShowingKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {isShowingKeys[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{getPermissionLabel(apiKey.permissions)}</TableCell>
                  <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>{formatDate(apiKey.expiresAt)}</TableCell>
                  <TableCell>{formatDate(apiKey.lastUsed)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteApiKey(apiKey.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* New API Key Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate New API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                API keys allow secure programmatic access to your CryptoPilot account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">API Key Name</Label>
                <Input 
                  id="key-name" 
                  placeholder="e.g., Trading Bot, Analytics Dashboard" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-permission">Permissions</Label>
                <Select 
                  value={newKeyPermission} 
                  onValueChange={(value) => setNewKeyPermission(value as "read" | "write" | "admin")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read Only</SelectItem>
                    <SelectItem value="write">Read & Write</SelectItem>
                    <SelectItem value="admin">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createApiKey} disabled={isCreatingKey}>
                {isCreatingKey ? "Creating..." : "Create API Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Display New API Key Dialog */}
        {newKey && (
          <Dialog defaultOpen={true} onOpenChange={() => setNewKey(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your New API Key</DialogTitle>
                <DialogDescription>
                  Copy your API key now. For security reasons, it won't be displayed again.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-2 mb-4">
                  <Label>Secret API Key</Label>
                  <div className="flex items-center">
                    <Input 
                      value={newKey} 
                      readOnly 
                      type={showNewKey ? "text" : "password"} 
                      className="font-mono"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2" 
                      onClick={() => setShowNewKey(!showNewKey)}
                    >
                      {showNewKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2" 
                      onClick={() => copyToClipboard(newKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-900 text-sm">
                  <p className="font-medium">⚠️ Important:</p>
                  <p>This key will only be shown once. If you lose it, you'll need to generate a new one.</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setNewKey(null)}>I've Saved My Key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start">
        <h3 className="text-sm font-medium mb-2">API Documentation</h3>
        <p className="text-sm text-gray-500">
          Learn how to use the CryptoPilot API by reading our documentation.
        </p>
        <Button variant="link" className="p-0 mt-1">
          View API Documentation
        </Button>
      </CardFooter>
    </Card>
  );
}