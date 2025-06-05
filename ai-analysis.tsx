/**
 * AI Analysis Page
 * 
 * This page displays AI-powered analysis and insights for cryptocurrencies:
 * - Market sentiment analysis
 * - Price predictions
 * - Anomaly detection
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Separator } from '@/components/ui/separator';
import { Brain, AlertTriangle, Sparkles, PieChart, Lightbulb } from 'lucide-react';
import CryptoInsights from '@/components/ai/CryptoInsights';
import { AIAnalysisLayout } from '@/components/layout/AIAnalysisLayout';

const AIAnalysisPage: React.FC = () => {
  return (
    <AIAnalysisLayout
      title="Market Insights"
      description="AI-powered cryptocurrency analysis and market intelligence"
    >
      <Helmet>
        <title>AI Analysis - CryptoPilot</title>
        <meta name="description" content="Advanced AI-powered cryptocurrency analysis, market sentiment, price predictions, and anomaly detection." />
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CryptoInsights />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              How To Use
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <span>Select a cryptocurrency from the dropdown menu to analyze</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <span>Switch between sentiment analysis, price predictions, and anomaly detection</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <span>For price predictions, choose your preferred timeframe</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">4.</span>
                <span>Review AI-generated insights to inform your trading decisions</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Important Disclaimer
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              The AI-powered analysis provided on this page is for informational purposes only and should not be considered as financial advice. Cryptocurrency markets are highly volatile and unpredictable. Always conduct your own research and consider consulting a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-primary" />
          AI Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Market Sentiment Analysis</h3>
            <p className="text-sm text-gray-500 mb-4">
              Understand the current market sentiment for cryptocurrencies based on price movements, trading volume, and market cap changes.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Bullish/Bearish signals detection</li>
              <li>• Confidence rating system</li>
              <li>• Detailed reasoning</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Price Predictions</h3>
            <p className="text-sm text-gray-500 mb-4">
              Get AI-generated price predictions for cryptocurrencies over different timeframes with confidence intervals.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Short and long-term forecasts</li>
              <li>• Statistical confidence ranges</li>
              <li>• Percentage change estimates</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Anomaly Detection</h3>
            <p className="text-sm text-gray-500 mb-4">
              Identify unusual patterns and potential market manipulation or security issues in cryptocurrency markets.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Unusual volatility detection</li>
              <li>• Trading pattern analysis</li>
              <li>• Risk severity assessment</li>
            </ul>
          </div>
        </div>
      </div>
    </AIAnalysisLayout>
  );
};

export default AIAnalysisPage;