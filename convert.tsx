import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Define cryptocurrency interface
interface Cryptocurrency {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change24h: string;
  marketCap: string;
  rank: number;
}

// Define token interface for user's tokens
interface Token {
  id: number;
  userId: number;
  symbol: string;
  amount: string;
  blockchain: string;
  type: string;
  status: string;
  securityLevel: string;
  isAiEnhanced: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConvertFormData {
  fromSymbol: string;
  toSymbol: string;
  amount: string;
  exchangeRate: number;
}

export default function Convert() {
  // Hooks for navigation and data management
  const queryClient = useQueryClient();
  
  // Form data state
  const [formData, setFormData] = useState<ConvertFormData>({
    fromSymbol: "BTC",
    toSymbol: "ETH",
    amount: "1",
    exchangeRate: 0
  });
  
  // Transaction status
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<string>("0");
  const [calculatingRate, setCalculatingRate] = useState<boolean>(false);
  
  // Fetch cryptocurrencies
  const {
    data: cryptoResponse,
    isLoading: isLoadingCryptos
  } = useQuery<{data: Cryptocurrency[]}>({
    queryKey: ['/api/crypto/listings'],
    staleTime: 60 * 1000,
  });
  
  // Extract the cryptocurrency array from the response
  const cryptocurrencies = cryptoResponse?.data || [];
  
  // Fetch user tokens
  const {
    data: userTokens,
    isLoading: isLoadingTokens,
    refetch: refetchTokens
  } = useQuery<Token[]>({
    queryKey: ['/api/tokens/recent'],
    staleTime: 30 * 1000,
    retry: false,
  });
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Swap from and to currencies
  const handleSwapCurrencies = () => {
    setCalculatingRate(true);
    
    // Swap the currencies
    const { fromSymbol, toSymbol } = formData;
    setFormData(prev => ({
      ...prev,
      fromSymbol: toSymbol,
      toSymbol: fromSymbol
    }));
    
    setTimeout(() => {
      setCalculatingRate(false);
    }, 500);
  };
  
  // Calculate exchange rate and converted amount
  useEffect(() => {
    if (!cryptocurrencies || !formData.fromSymbol || !formData.toSymbol) return;
    
    setCalculatingRate(true);
    
    // Fetch real-time exchange rates from the API
    const timer = setTimeout(async () => {
      try {
        console.log("Calculating exchange rate with data:", { formData, cryptocurrencies });
        
        // Find the from and to cryptocurrencies
        const fromCrypto = cryptocurrencies.find(c => c.symbol === formData.fromSymbol);
        const toCrypto = cryptocurrencies.find(c => c.symbol === formData.toSymbol);
        
        if (fromCrypto && toCrypto) {
          console.log("Found crypto data:", { fromCrypto, toCrypto });
          
          // Calculate exchange rate - fromCrypto price / toCrypto price tells us how many toCrypto we get for 1 fromCrypto
          const fromPrice = parseFloat(fromCrypto.price.toString());
          const toPrice = parseFloat(toCrypto.price.toString());
          
          if (fromPrice > 0 && toPrice > 0) {
            // This is the correct calculation: if BTC is $70,000 and ETH is $3,500, then 1 BTC = 20 ETH
            const rate = fromPrice / toPrice;
            console.log(`Exchange rate: 1 ${formData.fromSymbol} (${fromPrice}) = ${rate.toFixed(8)} ${formData.toSymbol} (${toPrice})`);
            
            setFormData(prev => ({ ...prev, exchangeRate: rate }));
            
            // Calculate converted amount
            const amount = parseFloat(formData.amount) || 0;
            setConvertedAmount((amount * rate).toFixed(8));
          } else {
            console.error("Invalid price values:", { fromPrice, toPrice });
            toast({
              title: "Exchange rate error",
              description: "Could not calculate exchange rate due to invalid price data.",
              variant: "destructive",
            });
          }
        } else {
          console.error("Could not find cryptocurrency data:", { formData, cryptocurrencies });
        }
      } catch (error) {
        console.error("Error calculating exchange rate:", error);
      } finally {
        setCalculatingRate(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formData.fromSymbol, formData.toSymbol, formData.amount, cryptocurrencies]);
  
  // Handle conversion mutation
  const { mutate: convertToken, isPending: isConverting } = useMutation({
    mutationFn: async (data: ConvertFormData) => {
      setTransactionStatus('processing');
      
      // Simulate a delay for blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Format the data according to what the server expects
      const convertData = {
        fromSymbol: data.fromSymbol,
        toSymbol: data.toSymbol,
        amount: data.amount,
        exchangeRate: data.exchangeRate.toString(),
        blockchain: "internal",
        recipientAddress: null, // Not needed for conversions but required by schema
      };
      
      console.log("Sending convert data:", convertData);
      
      const response = await fetch('/api/transactions/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Conversion error:", errorData);
        throw new Error(errorData.message || 'Failed to convert token');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Set success state
      setTransactionStatus('success');
      setTransactionId(data.transaction?.id || null);
      setConvertedAmount(data.convertedAmount || "0");
      
      // Show success toast
      toast({
        title: "Conversion successful",
        description: `Converted ${formData.amount} ${formData.fromSymbol} to ${data.convertedAmount} ${formData.toSymbol}`,
        variant: "default",
      });
      
      console.log("Conversion completed successfully, refreshing data:", data);

      // Invalidate queries to refresh data across the app
      queryClient.invalidateQueries({ queryKey: ['/api/tokens/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      
      // Also call the refetch function explicitly
      refetchTokens();
      
      // Reset form
      setFormData({
        fromSymbol: "BTC",
        toSymbol: "ETH",
        amount: "1",
        exchangeRate: 0
      });
      
      // Automatically navigate to the history page after a short delay
      setTimeout(() => {
        window.location.href = '/history';
      }, 2000);
    },
    onError: (error: Error) => {
      // Set error state
      setTransactionStatus('error');
      
      // Show error toast
      toast({
        title: "Conversion failed",
        description: error.message || "Something went wrong during the conversion",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromSymbol || !formData.toSymbol) {
      toast({
        title: "Error",
        description: "Please select cryptocurrencies to convert",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount to convert",
        variant: "destructive",
      });
      return;
    }
    
    // Proceed with conversion
    convertToken(formData);
  };
  
  // Calculate conversion fee (0.5%)
  const calculateFee = () => {
    const amount = parseFloat(formData.amount) || 0;
    return (amount * 0.005).toFixed(8);
  };
  
  // Check if the user has enough balance
  const hasEnoughBalance = () => {
    if (!userTokens) return false;
    
    const userToken = userTokens.find(t => t.symbol === formData.fromSymbol);
    if (!userToken) return false;
    
    const userAmount = parseFloat(userToken.amount);
    const convertAmount = parseFloat(formData.amount) || 0;
    
    return userAmount >= convertAmount;
  };
  
  return (
    <>
      <Helmet>
        <title>Convert | CryptoPilot</title>
        <meta name="description" content="Convert between cryptocurrencies with intelligent rate optimization" />
      </Helmet>
      
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">Convert Tokens</h1>
            <p className="text-gray-400 text-sm">Swap between cryptocurrencies with AI-optimized rates</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversion Card - First 2 Columns */}
            <div className="lg:col-span-2">
              <Card className="bg-[#121229] border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5" />
                    Convert Cryptocurrencies
                  </CardTitle>
                  <CardDescription>
                    Swap between different cryptocurrencies with real-time rates
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {transactionStatus === 'success' ? (
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-6 text-center">
                      <div className="bg-green-500/20 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Conversion Successful!</h3>
                      <p className="text-gray-400 mb-4">
                        Your conversion has been successfully processed.
                      </p>
                      <div className="bg-[#0A0A1B] p-4 rounded-md mb-4 max-w-md mx-auto">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">From:</span>
                          <span>{formData.amount} {formData.fromSymbol}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">To:</span>
                          <span>{convertedAmount} {formData.toSymbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Exchange Rate:</span>
                          <span>1 {formData.fromSymbol} = {formData.exchangeRate.toFixed(8)} {formData.toSymbol}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setTransactionStatus('idle');
                          setTransactionId(null);
                        }}
                      >
                        New Conversion
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {transactionStatus === 'error' && (
                        <div className="bg-red-900/20 border border-red-800 rounded-md p-3 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                          <p className="text-sm text-red-300">An error occurred during the conversion. Please try again.</p>
                        </div>
                      )}
                      
                      {/* From Currency */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">From</h3>
                        
                        <div className="flex space-x-2">
                          <Select 
                            value={formData.fromSymbol} 
                            onValueChange={(value) => handleSelectChange('fromSymbol', value)}
                            disabled={isConverting || calculatingRate}
                          >
                            <SelectTrigger className="w-[110px] bg-[#0A0A1B] border-gray-700">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#121229] border-gray-700">
                              {cryptocurrencies?.map(crypto => (
                                <SelectItem key={`from-${crypto.id}`} value={crypto.symbol}>
                                  {crypto.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            name="amount"
                            className="bg-[#0A0A1B] border-gray-700 flex-1"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleInputChange}
                            disabled={isConverting}
                          />
                        </div>
                        
                        {userTokens && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">
                              Available: {userTokens.find(t => t.symbol === formData.fromSymbol)?.amount || '0'} {formData.fromSymbol}
                            </span>
                            <button
                              type="button"
                              className="text-purple-400 hover:text-purple-300"
                              onClick={() => {
                                const userToken = userTokens.find(t => t.symbol === formData.fromSymbol);
                                if (userToken) {
                                  setFormData(prev => ({ ...prev, amount: userToken.amount }));
                                }
                              }}
                              disabled={isConverting || !(userTokens && userTokens.some(t => t.symbol === formData.fromSymbol))}
                            >
                              Max
                            </button>
                          </div>
                        )}
                        
                        {!hasEnoughBalance() && userTokens && userTokens.length > 0 && (
                          <div className="text-xs text-red-400">
                            Insufficient balance for this conversion
                          </div>
                        )}
                      </div>
                      
                      {/* Switch Button */}
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-[#0A0A1B] border-gray-700 hover:bg-[#1A1A3A]"
                          onClick={handleSwapCurrencies}
                          disabled={isConverting || calculatingRate}
                        >
                          {calculatingRate ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* To Currency */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">To</h3>
                        
                        <div className="flex space-x-2">
                          <Select 
                            value={formData.toSymbol} 
                            onValueChange={(value) => handleSelectChange('toSymbol', value)}
                            disabled={isConverting || calculatingRate}
                          >
                            <SelectTrigger className="w-[110px] bg-[#0A0A1B] border-gray-700">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#121229] border-gray-700">
                              {cryptocurrencies?.map(crypto => (
                                <SelectItem key={`to-${crypto.id}`} value={crypto.symbol}>
                                  {crypto.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            className="bg-[#0A0A1B] border-gray-700 flex-1"
                            type="text"
                            placeholder="0.00"
                            value={convertedAmount}
                            disabled={true}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>
                            Exchange Rate: 1 {formData.fromSymbol} = {formData.exchangeRate.toFixed(8)} {formData.toSymbol}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-purple-400 hover:text-purple-300"
                            onClick={() => {
                              setCalculatingRate(true);
                              setTimeout(() => setCalculatingRate(false), 500);
                            }}
                            disabled={isConverting || calculatingRate}
                          >
                            {calculatingRate ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <RefreshCw className="h-3 w-3 mr-1" />
                            )}
                            Refresh
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="bg-gray-800" />
                      
                      {/* Conversion Summary */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Conversion Summary</h3>
                        
                        <div className="bg-[#0A0A1B] p-4 rounded-md space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Amount</span>
                            <span className="text-sm">{formData.amount} {formData.fromSymbol}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Conversion Fee (0.5%)</span>
                            <span className="text-sm">{calculateFee()} {formData.fromSymbol}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">You'll Receive</span>
                            <span className="text-sm font-semibold">{convertedAmount} {formData.toSymbol}</span>
                          </div>
                          
                          {formData.fromSymbol === 'BTC' && formData.toSymbol === 'ETH' && (
                            <div className="bg-blue-900/20 border border-blue-800 rounded-md p-2 mt-2">
                              <h4 className="text-xs font-medium text-blue-300">AI Market Insight</h4>
                              <p className="text-xs text-blue-200 mt-1">ETH/BTC pair is currently trading at 2.1% below weekly average. Good time to convert!</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={isConverting || calculatingRate || !hasEnoughBalance() || !(userTokens && userTokens.length > 0)}
                      >
                        {isConverting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Conversion...
                          </>
                        ) : (
                          'Convert Now'
                        )}
                      </Button>
                      
                      {(!hasEnoughBalance() && userTokens && userTokens.length > 0) ? (
                        <div className="text-center text-sm text-yellow-400">
                          You need more {formData.fromSymbol} to complete this conversion.
                        </div>
                      ) : (userTokens && userTokens.length === 0) ? (
                        <div className="text-center text-sm text-yellow-400">
                          You need to generate tokens first before converting.
                        </div>
                      ) : null}
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Market Insights - Third Column */}
            <div className="lg:col-span-1">
              <Card className="bg-[#121229] border-gray-800">
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                  <CardDescription>AI-powered market analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-[#0A0A1B] rounded-md">
                    <h3 className="text-sm font-medium mb-2">BTC Market Trend</h3>
                    <p className="text-xs text-gray-400">Price up 2.3% in 24h with strong bullish indicators. Volume increased by 15% compared to 7-day average.</p>
                  </div>
                  <div className="p-3 bg-[#0A0A1B] rounded-md">
                    <h3 className="text-sm font-medium mb-2">ETH/BTC Relationship</h3>
                    <p className="text-xs text-gray-400">ETH is outperforming BTC by 5.2% over the past week, suggesting a potential rotation of capital.</p>
                  </div>
                  <div className="p-3 bg-[#0A0A1B] rounded-md">
                    <h3 className="text-sm font-medium mb-2">Recommended Pairs</h3>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li className="flex justify-between">
                        <span>BTC → ETH</span>
                        <span className="text-green-400">Favorable</span>
                      </li>
                      <li className="flex justify-between">
                        <span>SOL → USDT</span>
                        <span className="text-green-400">Favorable</span>
                      </li>
                      <li className="flex justify-between">
                        <span>ETH → SOL</span>
                        <span className="text-yellow-400">Neutral</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#121229] border-gray-800">
              <CardHeader>
                <CardTitle>Conversion History</CardTitle>
                <CardDescription>Recent conversion transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-400">
                  <p className="mb-2">No conversion history yet</p>
                  <p className="text-xs text-gray-500">Your recent conversions will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#121229] border-gray-800">
              <CardHeader>
                <CardTitle>Price Alerts</CardTitle>
                <CardDescription>Get notified when exchange rates are favorable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-400">
                  <p className="mb-2">No active price alerts</p>
                  <p className="text-xs text-gray-500">Set up alerts to be notified of favorable rates</p>
                  <Button variant="outline" className="mt-4">Create Alert</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  );
}