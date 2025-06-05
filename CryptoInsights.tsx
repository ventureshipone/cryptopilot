/**
 * CryptoInsights Component
 * 
 * This component provides AI-powered insights for cryptocurrencies:
 * - Market sentiment analysis
 * - Price predictions
 * - Anomaly detection
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowUpRight, ArrowDownRight, MinusCircle, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// Common top cryptocurrencies
const popularCryptos = [
  { name: 'Bitcoin', symbol: 'BTC' },
  { name: 'Ethereum', symbol: 'ETH' },
  { name: 'Tether', symbol: 'USDT' },
  { name: 'XRP', symbol: 'XRP' },
  { name: 'BNB', symbol: 'BNB' },
  { name: 'Solana', symbol: 'SOL' },
  { name: 'Cardano', symbol: 'ADA' },
  { name: 'Dogecoin', symbol: 'DOGE' },
  { name: 'Polygon', symbol: 'MATIC' },
  { name: 'Polkadot', symbol: 'DOT' },
];

// Available timeframes for predictions
const timeframes = [
  { label: '24 Hours', value: '24h' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
];

const CryptoInsights: React.FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [activeTab, setActiveTab] = useState('sentiment');

  // Fetch sentiment data
  const { 
    data: sentimentData,
    isLoading: sentimentLoading,
    error: sentimentError,
    refetch: refetchSentiment
  } = useQuery({
    queryKey: [`/api/ai/sentiment/${selectedCrypto}`],
    enabled: activeTab === 'sentiment',
  });

  // Fetch price prediction data
  const {
    data: predictionData,
    isLoading: predictionLoading,
    error: predictionError,
    refetch: refetchPrediction
  } = useQuery({
    queryKey: [`/api/ai/predict/${selectedCrypto}`, { timeframe: selectedTimeframe }],
    enabled: activeTab === 'prediction',
  });

  // Fetch anomaly data
  const {
    data: anomalyData,
    isLoading: anomalyLoading,
    error: anomalyError,
    refetch: refetchAnomalies
  } = useQuery({
    queryKey: ['/api/ai/anomalies', { symbols: selectedCrypto }],
    enabled: activeTab === 'anomalies',
  });

  // Handle cryptocurrency selection
  const handleCryptoChange = (value: string) => {
    setSelectedCrypto(value);
    
    // Refetch data based on active tab
    if (activeTab === 'sentiment') {
      refetchSentiment();
    } else if (activeTab === 'prediction') {
      refetchPrediction();
    } else if (activeTab === 'anomalies') {
      refetchAnomalies();
    }
  };

  // Handle timeframe selection for predictions
  const handleTimeframeChange = (value: '24h' | '7d' | '30d') => {
    setSelectedTimeframe(value);
    if (activeTab === 'prediction') {
      refetchPrediction();
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Render sentiment analysis content
  const renderSentimentContent = () => {
    if (sentimentLoading) {
      return <div className="flex justify-center p-8">Loading sentiment analysis...</div>;
    }

    if (sentimentError) {
      return (
        <div className="flex flex-col items-center p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <p className="text-red-500">Failed to load sentiment analysis</p>
          <Button variant="outline" onClick={() => refetchSentiment()} className="mt-4">
            Try Again
          </Button>
        </div>
      );
    }

    if (!sentimentData) {
      return <div className="p-8 text-center">No sentiment data available</div>;
    }

    // Determine sentiment color and icon
    let sentimentColor = 'bg-gray-500';
    let SentimentIcon = MinusCircle;

    if (sentimentData.sentiment === 'bullish') {
      sentimentColor = 'bg-green-500';
      SentimentIcon = ArrowUpRight;
    } else if (sentimentData.sentiment === 'bearish') {
      sentimentColor = 'bg-red-500';
      SentimentIcon = ArrowDownRight;
    }

    // Map the sentiment score from -1...1 to 0...100 for Progress component
    const normalizedScore = ((sentimentData.score + 1) / 2) * 100;

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${sentimentColor} flex items-center justify-center`}>
              <SentimentIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold capitalize">{sentimentData.sentiment} Sentiment</h3>
              <p className="text-sm text-gray-500">
                Confidence: {(sentimentData.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <Badge variant={
            sentimentData.sentiment === 'bullish' ? 'success' : 
            sentimentData.sentiment === 'bearish' ? 'destructive' : 'outline'
          }>
            Score: {sentimentData.score.toFixed(2)}
          </Badge>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium">Sentiment Spectrum</label>
          <div className="flex items-center mt-2">
            <span className="text-xs text-red-500">Bearish</span>
            <div className="flex-grow mx-2">
              <Progress value={normalizedScore} className="h-2" />
            </div>
            <span className="text-xs text-green-500">Bullish</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Analysis</h4>
          <p className="text-sm text-gray-700">{sentimentData.reasoning}</p>
        </div>

        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
          <h4 className="text-sm font-medium mb-2">What This Means</h4>
          <p className="text-sm text-gray-700">
            {sentimentData.sentiment === 'bullish' 
              ? 'The market is showing positive signals for this cryptocurrency. Consider this favorable sentiment in your investment decisions.' 
              : sentimentData.sentiment === 'bearish'
              ? 'The market is showing negative signals for this cryptocurrency. Exercise caution in your investment decisions.'
              : 'The market is showing mixed signals for this cryptocurrency. Consider additional factors in your investment decisions.'}
          </p>
        </div>
      </div>
    );
  };

  // Render price prediction content
  const renderPredictionContent = () => {
    if (predictionLoading) {
      return <div className="flex justify-center p-8">Loading price prediction...</div>;
    }

    if (predictionError) {
      return (
        <div className="flex flex-col items-center p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <p className="text-red-500">Failed to load price prediction</p>
          <Button variant="outline" onClick={() => refetchPrediction()} className="mt-4">
            Try Again
          </Button>
        </div>
      );
    }

    if (!predictionData) {
      return <div className="p-8 text-center">No prediction data available</div>;
    }

    // Determine if prediction is up or down
    const isPriceUp = predictionData.predictedPrice > predictionData.currentPrice;
    
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${isPriceUp ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center`}>
              {isPriceUp ? <TrendingUp className="w-6 h-6 text-white" /> : <ArrowDownRight className="w-6 h-6 text-white" />}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{selectedTimeframe} Prediction</h3>
              <p className="text-sm text-gray-500">
                Confidence: {(predictionData.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <Badge variant={isPriceUp ? 'success' : 'destructive'}>
            {isPriceUp ? '+' : ''}{predictionData.percentageChange.toFixed(2)}%
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs text-gray-500 mb-1">Current Price</p>
            <p className="text-xl font-semibold">${predictionData.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div className={`rounded-lg ${isPriceUp ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} p-4`}>
            <p className="text-xs text-gray-500 mb-1">Predicted Price</p>
            <p className="text-xl font-semibold">${predictionData.predictedPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Confidence Range</h4>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Lower Bound</span>
            <span>Upper Bound</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">${predictionData.lowerBound.toLocaleString()}</span>
            <span className="font-medium">${predictionData.upperBound.toLocaleString()}</span>
          </div>
          <Progress value={50} className="h-2 mt-2" />
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Analysis</h4>
          <p className="text-sm text-gray-700">{predictionData.reasoning}</p>
        </div>

        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-1" /> Key Takeaway
          </h4>
          <p className="text-sm text-gray-700">
            {isPriceUp 
              ? `Our AI model predicts ${selectedCrypto} could increase by ${predictionData.percentageChange.toFixed(2)}% in the next ${selectedTimeframe === '24h' ? '24 hours' : selectedTimeframe === '7d' ? '7 days' : '30 days'}.` 
              : `Our AI model predicts ${selectedCrypto} could decrease by ${Math.abs(predictionData.percentageChange).toFixed(2)}% in the next ${selectedTimeframe === '24h' ? '24 hours' : selectedTimeframe === '7d' ? '7 days' : '30 days'}.`}
            {' '}Remember that all predictions have uncertainty.
          </p>
        </div>
      </div>
    );
  };

  // Render anomaly detection content
  const renderAnomalyContent = () => {
    if (anomalyLoading) {
      return <div className="flex justify-center p-8">Loading anomaly detection...</div>;
    }

    if (anomalyError) {
      return (
        <div className="flex flex-col items-center p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <p className="text-red-500">Failed to load anomaly detection</p>
          <Button variant="outline" onClick={() => refetchAnomalies()} className="mt-4">
            Try Again
          </Button>
        </div>
      );
    }

    if (!anomalyData) {
      return <div className="p-8 text-center">No anomaly data available</div>;
    }

    return (
      <div className="p-4">
        <div className="rounded-lg bg-slate-50 p-4 mb-6 dark:bg-slate-900">
          <h3 className="font-medium mb-2">Market Status</h3>
          <p className="text-sm text-gray-700">{anomalyData.overallMarketStatus}</p>
        </div>

        {anomalyData.anomalies.length > 0 ? (
          <div>
            <h3 className="font-medium mb-4">Detected Anomalies</h3>
            <div className="space-y-4">
              {anomalyData.anomalies.map((anomaly, index) => (
                <Card key={index}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{anomaly.symbol}</CardTitle>
                      <Badge variant={
                        anomaly.severity === 'high' ? 'destructive' : 
                        anomaly.severity === 'medium' ? 'warning' : 'outline'
                      }>
                        {anomaly.severity} severity
                      </Badge>
                    </div>
                    <CardDescription>{anomaly.anomalyType}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">{anomaly.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 block">
                    <Separator className="my-2" />
                    <p className="text-sm font-medium">Potential Impact:</p>
                    <p className="text-sm text-gray-700">{anomaly.potentialImpact}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 border rounded-lg">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="font-medium text-lg mb-2">No anomalies detected</h3>
            <p className="text-sm text-gray-500">
              The market for {selectedCrypto} appears to be functioning normally without any unusual patterns.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI-Powered Crypto Insights</CardTitle>
        <CardDescription>
          Get advanced analytics and intelligence about cryptocurrency markets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
          <div className="w-full sm:w-1/2">
            <label className="text-sm font-medium mb-2 block">Select Cryptocurrency</label>
            <Select value={selectedCrypto} onValueChange={handleCryptoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {popularCryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {activeTab === 'prediction' && (
            <div className="w-full sm:w-1/2">
              <label className="text-sm font-medium mb-2 block">Prediction Timeframe</label>
              <Select 
                value={selectedTimeframe} 
                onValueChange={(value) => handleTimeframeChange(value as '24h' | '7d' | '30d')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="prediction">Price Prediction</TabsTrigger>
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          </TabsList>
          <TabsContent value="sentiment">
            {renderSentimentContent()}
          </TabsContent>
          <TabsContent value="prediction">
            {renderPredictionContent()}
          </TabsContent>
          <TabsContent value="anomalies">
            {renderAnomalyContent()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t p-4">
        <p className="text-xs text-gray-500">
          Analysis powered by AI using real-time market data. Predictions and analyses are for informational purposes only and should not be considered financial advice.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CryptoInsights;