import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, File } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

type DataCategory = {
  id: string;
  name: string;
  description: string;
  fields: Array<{
    id: string;
    name: string;
    description: string;
  }>;
};

type ExportFormat = "json" | "csv" | "pdf";

export function DataExport() {
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    personal: true,
    wallets: true,
    transactions: true,
    settings: true,
  });
  const [selectedFields, setSelectedFields] = useState<Record<string, string[]>>({
    personal: ["basic", "profile"],
    wallets: ["addresses", "balances"],
    transactions: ["history", "pending"],
    settings: ["preferences", "notifications"],
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Data categories for export
  const dataCategories: DataCategory[] = [
    {
      id: "personal",
      name: "Personal Information",
      description: "Your account details and profile information",
      fields: [
        { id: "basic", name: "Account Details", description: "Username, email, account creation date" },
        { id: "profile", name: "Profile Information", description: "Display name, profile picture, contact details" },
        { id: "security", name: "Security Settings", description: "2FA status, authentication methods" },
      ],
    },
    {
      id: "wallets",
      name: "Wallet Information",
      description: "Your connected wallets and crypto assets",
      fields: [
        { id: "addresses", name: "Wallet Addresses", description: "All your saved wallet addresses" },
        { id: "balances", name: "Wallet Balances", description: "Current balances across all wallets" },
        { id: "tokens", name: "Token Information", description: "Detailed information about your tokens" },
      ],
    },
    {
      id: "transactions",
      name: "Transaction Data",
      description: "Your transaction history and pending transactions",
      fields: [
        { id: "history", name: "Transaction History", description: "Complete record of all completed transactions" },
        { id: "pending", name: "Pending Transactions", description: "All pending and unconfirmed transactions" },
        { id: "failed", name: "Failed Transactions", description: "Record of failed or rejected transactions" },
      ],
    },
    {
      id: "settings",
      name: "User Settings",
      description: "Your application settings and preferences",
      fields: [
        { id: "preferences", name: "User Preferences", description: "UI settings, display options" },
        { id: "notifications", name: "Notification Settings", description: "Email and push notification preferences" },
        { id: "api", name: "API Settings", description: "API keys and access permissions" },
      ],
    },
  ];

  const toggleCategory = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: checked,
    }));
  };

  const toggleField = (categoryId: string, fieldId: string, checked: boolean) => {
    setSelectedFields(prev => {
      const currentFields = prev[categoryId] || [];
      
      if (checked && !currentFields.includes(fieldId)) {
        return {
          ...prev,
          [categoryId]: [...currentFields, fieldId],
        };
      } else if (!checked && currentFields.includes(fieldId)) {
        return {
          ...prev,
          [categoryId]: currentFields.filter(f => f !== fieldId),
        };
      }
      
      return prev;
    });
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // In a real implementation, this would make an API call to generate the export
      // For this prototype, we'll simulate an export by generating a mock file
      
      // Collect the export configuration
      const categories = Object.entries(selectedCategories)
        .filter(([_, selected]) => selected)
        .map(([id]) => id);
      
      const fields = Object.entries(selectedFields)
        .filter(([categoryId]) => selectedCategories[categoryId])
        .reduce((acc, [categoryId, fieldIds]) => {
          acc[categoryId] = fieldIds;
          return acc;
        }, {} as Record<string, string[]>);
      
      // Generate mock data for demonstration
      const mockData = {
        exportDate: new Date().toISOString(),
        user: {
          username: user?.username || "current_user",
          email: user?.email || "user@example.com",
        },
        categories,
        fields,
        format: exportFormat,
      };
      
      // Create a downloadable file
      const dataStr = JSON.stringify(mockData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // Create a download link and trigger it
      const exportName = `cryptopilot-data-export-${new Date().toISOString().slice(0, 10)}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataUri);
      downloadAnchorNode.setAttribute("download", `${exportName}.${exportFormat}`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      toast({
        title: "Export Successful",
        description: `Your data has been exported in ${exportFormat.toUpperCase()} format.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to export data:", err);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "json":
        return <FileJson className="h-5 w-5" />;
      case "csv":
        return <FileSpreadsheet className="h-5 w-5" />;
      case "pdf":
        return <File className="h-5 w-5" />;
      default:
        return <Download className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Data Export</CardTitle>
        <CardDescription>
          Export your data in various formats for backup or analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Select Data to Export</h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose the categories and specific data fields you want to include in your export
            </p>
            
            <Accordion type="multiple" className="w-full">
              {dataCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <div className="flex items-center space-x-2 py-1">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={selectedCategories[category.id]} 
                      onCheckedChange={(checked) => toggleCategory(category.id, checked as boolean)}
                    />
                    <AccordionTrigger className="flex-1 py-0">
                      <div className="flex items-center">
                        <Label 
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {category.name}
                        </Label>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                    <div className="ml-6 mt-2 space-y-3">
                      <p className="text-sm text-gray-500">{category.description}</p>
                      <div className="space-y-2">
                        {category.fields.map((field) => (
                          <div key={field.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={`field-${category.id}-${field.id}`}
                              checked={(selectedFields[category.id] || []).includes(field.id)} 
                              onCheckedChange={(checked) => toggleField(category.id, field.id, checked as boolean)}
                              disabled={!selectedCategories[category.id]}
                            />
                            <div className="space-y-1">
                              <Label 
                                htmlFor={`field-${category.id}-${field.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {field.name}
                              </Label>
                              <p className="text-xs text-gray-500">{field.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Export Format</h3>
            <Select 
              value={exportFormat} 
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center">
                    <FileJson className="h-4 w-4 mr-2" />
                    <span>JSON (Recommended)</span>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    <span>CSV (Spreadsheet)</span>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2" />
                    <span>PDF (Document)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          <p>Export is GDPR compliant and includes only your personal data.</p>
        </div>
        <Button 
          onClick={handleExport} 
          disabled={isExporting || !Object.values(selectedCategories).some(v => v)}
        >
          {isExporting ? (
            <>Exporting...</>
          ) : (
            <>
              {getFormatIcon(exportFormat)}
              <span className="ml-2">Export Data</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}