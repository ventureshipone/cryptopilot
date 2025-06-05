import { useState } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart4, 
  BrainCircuit, 
  TrendingUp, 
  LineChart, 
  Zap, 
  AlertTriangle,
  Shuffle,
  Search 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line
} from "recharts";

// Sample data for the charts
const marketTrendsData = [
  { name: "Jan", btc: 35000, eth: 1500, usdt: 1, bnb: 250 },
  { name: "Feb", btc: 38000, eth: 1600, usdt: 1, bnb: 270 },
  { name: "Mar", btc: 42000, eth: 1750, usdt: 1, bnb: 300 },
  { name: "Apr", btc: 39000, eth: 1800, usdt: 1, bnb: 290 },
  { name: "May", btc: 45000, eth: 2000, usdt: 1, bnb: 310 },
  { name: "Jun", btc: 48000, eth: 2100, usdt: 1, bnb: 320 },
  { name: "Jul", btc: 52000, eth: 2400, usdt: 1, bnb: 340 },
];

const volatilityData = [
  { date: "Aug 1", value: 42 },
  { date: "Aug 3", value: 38 },
  { date: "Aug 5", value: 45 },
  { date: "Aug 7", value: 50 },
  { date: "Aug 9", value: 35 },
  { date: "Aug 11", value: 40 },
  { date: "Aug 13", value: 42 },
  { date: "Aug 15", value: 47 },
];

const sentimentData = [
  { category: "News", positive: 65, negative: 35 },
  { category: "Social", positive: 55, negative: 45 },
  { category: "Reddit", positive: 70, negative: 30 },
  { category: "Twitter", positive: 60, negative: 40 },
  { category: "Forums", positive: 50, negative: 50 },
];

const riskScoreData = [
  { name: "BTC", score: 72 },
  { name: "ETH", score: 68 },
  { name: "BNB", score: 61 },
  { name: "SOL", score: 55 },
  { name: "ADA", score: 59 },
];

// Sample insights
const marketInsights = [
  {
    title: "Bitcoin Resistance Level",
    description: "BTC is approaching a key resistance level at $55,000. Historical patterns suggest increased volatility near this threshold.",
    confidence: 89,
    importance: "high",
    timeframe: "short-term"
  },
  {
    title: "Ethereum Token Velocity",
    description: "ETH token velocity has increased 23% over the past week, potentially indicating accumulation phase before major protocol update.",
    confidence: 76,
    importance: "medium",
    timeframe: "medium-term"
  },
  {
    title: "Altcoin Season Probability",
    description: "AI models indicate a 62% probability of an altcoin season starting within the next 30 days based on BTC dominance patterns.",
    confidence: 71,
    importance: "medium",
    timeframe: "medium-term"
  },
  {
    title: "Market Volatility Warning",
    description: "Market volatility indicators suggest potential for increased price swings in the next 7-10 days across major assets.",
    confidence: 83,
    importance: "high",
    timeframe: "short-term"
  },
  {
    title: "DeFi Sector Growth",
    description: "DeFi sector metrics show sustained growth with TVL increasing 15% month-over-month despite broader market fluctuations.",
    confidence: 78,
    importance: "medium",
    timeframe: "long-term"
  }
];

export default function Analysis() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [analysisType, setAnalysisType] = useState("market");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coinFilter, setCoinFilter] = useState("BTC");
  const [timeframeFilter, setTimeframeFilter] = useState("7d");
  
  const handleGenerateAnalysis = () => {
    if (!query.trim()) {
      toast({
        title: "Analysis query required",
        description: "Please enter a question or topic for analysis",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI analysis generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Analysis complete",
        description: "AI analysis has been generated successfully"
      });
    }, 2500);
  };
  
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case "short-term":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "medium-term":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20";
      case "long-term":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  return (
    <>
      <Helmet>
        <title>AI Analysis | CryptoPilot</title>
        <meta name="description" content="Advanced AI-powered market analysis for cryptocurrencies" />
      </Helmet>
      
      <div className="min-h-screen bg-[#070714] text-white flex">
        {/* Sidebar */}
        <div className="w-[200px] flex-shrink-0 border-r border-gray-800 bg-[#0F0F1B]">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center">
              <div className="bg-[#00B27A] rounded-full h-6 w-6 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="12 6 8 12 12 18 16 12 12 6"></polygon>
                </svg>
              </div>
              <div className="text-white font-bold text-lg">CryptoPilot</div>
            </div>
          </div>
          
          <div className="p-4 text-sm">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-3">Flight Deck</div>
            <div className="space-y-2">
              <a href="/dashboard" className="flex items-center gap-2.5 p-2 text-gray-400 hover:bg-[#121229] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Dashboard
              </a>
              <a href="/generate" className="flex items-center gap-2.5 p-2 text-gray-400 hover:bg-[#121229] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                Generate
              </a>
              <a href="/convert" className="flex items-center gap-2.5 p-2 text-gray-400 hover:bg-[#121229] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"></polyline>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                  <polyline points="7 23 3 19 7 15"></polyline>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
                Convert
              </a>
              <a href="/transfer" className="flex items-center gap-2.5 p-2 text-gray-400 hover:bg-[#121229] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
                Transfer
              </a>
            </div>
          </div>
          
          <div className="p-4 text-sm">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-3">Control Center</div>
            <div className="space-y-2">
              <a href="/wallet" className="flex items-center gap-2.5 p-2 text-gray-400 hover:bg-[#121229] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <circle cx="12" cy="12" r="2"></circle>
                  <path d="M6 12h.01"></path>
                  <path d="M18 12h.01"></path>
                </svg>
                My Wallet
              </a>
              <a href="/history" className="flex items-center gap-2.5 p-2 text-gray-400 hover:bg-[#121229] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v4l3 3"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                History
              </a>
              <a href="/ai-analysis" className="flex items-center gap-2.5 p-2 rounded-md bg-[#121229]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                AI Analysis
              </a>
              <a href="/settings" className="flex items-center gap-2.5 p-2 text-gray-400 hover:bg-[#121229] rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Settings
              </a>
            </div>
          </div>
          
          <div className="p-4 mt-auto fixed bottom-0 w-[200px]">
            <div className="flex items-center gap-3 bg-[#121229] rounded-md p-2.5">
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">TP</div>
              <div className="overflow-hidden">
                <div className="text-sm font-medium truncate">Test Pilot</div>
                <div className="text-xs text-gray-400 truncate">pilot@cryptopilot.ai</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header Navigation */}
          <header className="border-b border-gray-800 flex items-center justify-between p-4">
            <div className="relative mx-auto max-w-md w-full hidden md:block">
              <Input
                type="text"
                placeholder="Ask AI about market trends, token analysis, price predictions..."
                className="bg-[#121229] border-none rounded-md p-2 pl-10 w-full text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <div className="flex items-center gap-1 mr-4 text-xs text-green-400">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                Network: Online
              </div>
              
              {/* User Dropdown Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 text-gray-400 hover:text-white"
                  onClick={() => {
                    const menu = document.getElementById('user-dropdown');
                    if (menu) {
                      menu.classList.toggle('hidden');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M5.8 19.7c.9-1 2.5-1.7 3.8-1.7h4.8c1.3 0 2.9.7 3.8 1.7"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </Button>
                
                <div id="user-dropdown" className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#121229] border border-gray-700 hidden z-10">
                  <div className="py-1">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">Profile Settings</a>
                    <a href="/wallet" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">My Wallets</a>
                    <a href="/history" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">Transaction History</a>
                    <div className="border-t border-gray-700 my-1"></div>
                    <a href="/api/auth/logout" className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-800">Sign Out</a>
                  </div>
                </div>
              </div>
              
              <Button 
                className="bg-purple-600 hover:bg-purple-700" 
                size="sm"
                onClick={handleGenerateAnalysis}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4 mr-1" />
                    Generate Analysis
                  </>
                )}
              </Button>
            </div>
          </header>
          
          <main className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">AI Crypto Analysis</h1>
                <p className="text-gray-400 text-sm">Advanced market analysis and predictions powered by AI</p>
              </div>

              <div className="flex items-center gap-2">
                <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
                  <SelectTrigger className="h-8 bg-[#121229] border-gray-700 w-[120px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121229] border-gray-700">
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last quarter</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={coinFilter} onValueChange={setCoinFilter}>
                  <SelectTrigger className="h-8 bg-[#121229] border-gray-700 w-[100px]">
                    <SelectValue placeholder="Coin" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121229] border-gray-700">
                    <SelectItem value="BTC">Bitcoin</SelectItem>
                    <SelectItem value="ETH">Ethereum</SelectItem>
                    <SelectItem value="BNB">Binance</SelectItem>
                    <SelectItem value="SOL">Solana</SelectItem>
                    <SelectItem value="ADA">Cardano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Analysis Tabs */}
            <Tabs defaultValue="market" className="mb-6" onValueChange={setAnalysisType}>
              <TabsList className="bg-[#121229] border-gray-700 grid grid-cols-4 mb-6">
                <TabsTrigger value="market" className="data-[state=active]:bg-purple-900/20">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Market Trends
                </TabsTrigger>
                <TabsTrigger value="sentiment" className="data-[state=active]:bg-purple-900/20">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  Sentiment Analysis
                </TabsTrigger>
                <TabsTrigger value="risk" className="data-[state=active]:bg-purple-900/20">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Risk Assessment
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-purple-900/20">
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  AI Predictions
                </TabsTrigger>
              </TabsList>
              
              {/* Market Trends Tab */}
              <TabsContent value="market" className="space-y-6">
                <Card className="bg-[#121229] border-gray-800">
                  <CardHeader>
                    <CardTitle>Cryptocurrency Price Trends</CardTitle>
                    <CardDescription>Comparative price evolution over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={marketTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis dataKey="name" stroke="#6c7280" />
                          <YAxis stroke="#6c7280" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              borderColor: '#374151',
                              borderRadius: '0.375rem' 
                            }} 
                          />
                          <Line type="monotone" dataKey="btc" stroke="#F7931A" strokeWidth={2} />
                          <Line type="monotone" dataKey="eth" stroke="#627EEA" strokeWidth={2} />
                          <Line type="monotone" dataKey="bnb" stroke="#F3BA2F" strokeWidth={2} />
                          <Line type="monotone" dataKey="usdt" stroke="#26A17B" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#121229] border-gray-800">
                    <CardHeader>
                      <CardTitle>Market Volatility</CardTitle>
                      <CardDescription>Volatility index for {coinFilter}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={volatilityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorVolatility" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#6c7280" />
                            <YAxis stroke="#6c7280" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                borderColor: '#374151',
                                borderRadius: '0.375rem' 
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#8884d8" 
                              fillOpacity={1} 
                              fill="url(#colorVolatility)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#121229] border-gray-800">
                    <CardHeader>
                      <CardTitle>Price Correlation</CardTitle>
                      <CardDescription>Asset correlation matrix</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-2 text-center text-xs mb-2">
                        <div className="font-bold">Assets</div>
                        <div className="font-bold">BTC</div>
                        <div className="font-bold">ETH</div>
                        <div className="font-bold">BNB</div>
                        <div className="font-bold">SOL</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          <div className="font-semibold">BTC</div>
                          <div className="bg-purple-900/50 rounded p-2">1.00</div>
                          <div className="bg-purple-800/30 rounded p-2">0.82</div>
                          <div className="bg-purple-700/30 rounded p-2">0.76</div>
                          <div className="bg-purple-600/30 rounded p-2">0.68</div>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          <div className="font-semibold">ETH</div>
                          <div className="bg-purple-800/30 rounded p-2">0.82</div>
                          <div className="bg-purple-900/50 rounded p-2">1.00</div>
                          <div className="bg-purple-800/30 rounded p-2">0.79</div>
                          <div className="bg-purple-700/30 rounded p-2">0.75</div>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          <div className="font-semibold">BNB</div>
                          <div className="bg-purple-700/30 rounded p-2">0.76</div>
                          <div className="bg-purple-800/30 rounded p-2">0.79</div>
                          <div className="bg-purple-900/50 rounded p-2">1.00</div>
                          <div className="bg-purple-700/30 rounded p-2">0.72</div>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          <div className="font-semibold">SOL</div>
                          <div className="bg-purple-600/30 rounded p-2">0.68</div>
                          <div className="bg-purple-700/30 rounded p-2">0.75</div>
                          <div className="bg-purple-700/30 rounded p-2">0.72</div>
                          <div className="bg-purple-900/50 rounded p-2">1.00</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Sentiment Analysis Tab */}
              <TabsContent value="sentiment" className="space-y-6">
                <Card className="bg-[#121229] border-gray-800">
                  <CardHeader>
                    <CardTitle>Market Sentiment Analysis</CardTitle>
                    <CardDescription>Sentiment across different sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sentimentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis dataKey="category" stroke="#6c7280" />
                          <YAxis stroke="#6c7280" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              borderColor: '#374151',
                              borderRadius: '0.375rem' 
                            }} 
                          />
                          <Bar dataKey="positive" stackId="a" fill="#10b981" />
                          <Bar dataKey="negative" stackId="a" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#121229] border-gray-800">
                    <CardHeader>
                      <CardTitle>Social Media Buzz</CardTitle>
                      <CardDescription>24-hour social media activity for {coinFilter}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Twitter Mentions</span>
                            <span className="text-sm font-medium">8,563</span>
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Reddit Posts</span>
                            <span className="text-sm font-medium">3,217</span>
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Discord Activity</span>
                            <span className="text-sm font-medium">12,489</span>
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Telegram Messages</span>
                            <span className="text-sm font-medium">7,832</span>
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: '72%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#121229] border-gray-800">
                    <CardHeader>
                      <CardTitle>Sentiment Keywords</CardTitle>
                      <CardDescription>Most frequent terms in discussions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-500/20 text-green-500 border border-green-500/20 text-xs py-1 px-2">
                          bullish
                          <span className="ml-1 opacity-70">+428%</span>
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-500 border border-green-500/20 text-xs py-1 px-2">
                          buy
                          <span className="ml-1 opacity-70">+362%</span>
                        </Badge>
                        <Badge className="bg-green-500/10 text-green-400 border border-green-400/20 text-xs py-1 px-2">
                          growth
                          <span className="ml-1 opacity-70">+287%</span>
                        </Badge>
                        <Badge className="bg-blue-500/10 text-blue-400 border border-blue-400/20 text-xs py-1 px-2">
                          announcement
                          <span className="ml-1 opacity-70">+243%</span>
                        </Badge>
                        <Badge className="bg-blue-500/10 text-blue-400 border border-blue-400/20 text-xs py-1 px-2">
                          partnership
                          <span className="ml-1 opacity-70">+218%</span>
                        </Badge>
                        <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 text-xs py-1 px-2">
                          analysis
                          <span className="ml-1 opacity-70">+175%</span>
                        </Badge>
                        <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 text-xs py-1 px-2">
                          hold
                          <span className="ml-1 opacity-70">+152%</span>
                        </Badge>
                        <Badge className="bg-gray-500/10 text-gray-400 border border-gray-400/20 text-xs py-1 px-2">
                          market
                          <span className="ml-1 opacity-70">+128%</span>
                        </Badge>
                        <Badge className="bg-red-500/10 text-red-400 border border-red-400/20 text-xs py-1 px-2">
                          correction
                          <span className="ml-1 opacity-70">+98%</span>
                        </Badge>
                        <Badge className="bg-red-500/10 text-red-400 border border-red-400/20 text-xs py-1 px-2">
                          sell
                          <span className="ml-1 opacity-70">+76%</span>
                        </Badge>
                        <Badge className="bg-red-500/20 text-red-500 border border-red-500/20 text-xs py-1 px-2">
                          bearish
                          <span className="ml-1 opacity-70">+52%</span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Risk Assessment Tab */}
              <TabsContent value="risk" className="space-y-6">
                <Card className="bg-[#121229] border-gray-800">
                  <CardHeader>
                    <CardTitle>Risk Assessment Scores</CardTitle>
                    <CardDescription>AI-generated risk metrics for top cryptocurrencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={riskScoreData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis type="number" domain={[0, 100]} stroke="#6c7280" />
                          <YAxis dataKey="name" type="category" stroke="#6c7280" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              borderColor: '#374151',
                              borderRadius: '0.375rem' 
                            }}
                            formatter={(value) => [`${value}/100`, 'Risk Score']}
                          />
                          <defs>
                            <linearGradient id="gradientRisk" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                          </defs>
                          <Bar dataKey="score" fill="url(#gradientRisk)" barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-[#121229] border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle>Liquidity Risk</CardTitle>
                      <CardDescription>Market depth analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <div className="relative h-36 w-36">
                          <svg className="transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke="#1f2937"
                              strokeWidth="8"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke="#10b981"
                              strokeWidth="8"
                              strokeDasharray="283"
                              strokeDashoffset={283 - (283 * 82) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">82%</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-center">
                          High liquidity with significant market depth
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#121229] border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle>Volatility Risk</CardTitle>
                      <CardDescription>Price stability analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <div className="relative h-36 w-36">
                          <svg className="transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke="#1f2937"
                              strokeWidth="8"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke="#f59e0b"
                              strokeWidth="8"
                              strokeDasharray="283"
                              strokeDashoffset={283 - (283 * 58) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">58%</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-center">
                          Moderate volatility with manageable swings
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#121229] border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle>Technical Risk</CardTitle>
                      <CardDescription>Protocol security assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <div className="relative h-36 w-36">
                          <svg className="transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke="#1f2937"
                              strokeWidth="8"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke="#8b5cf6"
                              strokeWidth="8"
                              strokeDasharray="283"
                              strokeDashoffset={283 - (283 * 91) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">91%</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-center">
                          High security with battle-tested protocol
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* AI Predictions Tab */}
              <TabsContent value="ai" className="space-y-6">
                <Card className="bg-[#121229] border-gray-800">
                  <CardHeader>
                    <CardTitle>AI Market Insights</CardTitle>
                    <CardDescription>Machine learning generated market insights and predictions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketInsights.map((insight, index) => (
                        <div key={index} className="p-4 bg-gray-800/30 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium flex items-center">
                              <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                              {insight.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getImportanceColor(insight.importance)}>
                                {insight.importance}
                              </Badge>
                              <Badge className={getTimeframeColor(insight.timeframe)}>
                                {insight.timeframe}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{insight.description}</p>
                          <div className="flex items-center">
                            <div className="text-xs text-gray-400">Confidence Score:</div>
                            <div className="ml-2 w-24 h-2 bg-gray-700 rounded-full">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                                style={{ width: `${insight.confidence}%` }}
                              ></div>
                            </div>
                            <div className="ml-2 text-xs font-medium">{insight.confidence}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#121229] border-gray-800">
                  <CardHeader>
                    <CardTitle>AI Analysis Assistant</CardTitle>
                    <CardDescription>Ask the AI assistant about cryptocurrencies and markets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Ask anything about cryptocurrencies, market trends, or specific tokens..."
                        className="bg-gray-800/50 border-gray-700 min-h-[120px]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700" 
                          onClick={handleGenerateAnalysis}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <BrainCircuit className="h-4 w-4 mr-1" />
                              Generate Analysis
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <BrainCircuit className="h-5 w-5 text-purple-400" />
                          <span className="font-medium">AI Response</span>
                        </div>
                        
                        <div className="text-gray-300 space-y-2">
                          {query ? (
                            isGenerating ? (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="flex space-x-1">
                                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"></div>
                                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                                <span>AI is analyzing your query...</span>
                              </div>
                            ) : (
                              <p className="text-sm">Try asking a question about cryptocurrency markets, token analysis, or price predictions. Click the Generate Analysis button to get AI insights.</p>
                            )
                          ) : (
                            <p className="text-sm">Enter a query to get started. You can ask about market trends, specific tokens, technical analysis, price predictions, or any other crypto-related topics.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
}