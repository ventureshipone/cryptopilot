import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Wallet, Copy, ExternalLink, AlertTriangle } from 'lucide-react';

// Simulated wallet types for demo purposes
export type WalletProvider = 'metamask' | 'walletconnect' | 'coinbase' | 'trustwallet';

export interface WalletInfo {
  address: string;
  balance: string;
  provider: WalletProvider;
  connected: boolean;
  chainId?: number;
}

interface WalletConnectProps {
  onWalletConnected: (walletInfo: WalletInfo) => void;
}

// Function to shorten wallet address for display
const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function WalletConnect({ onWalletConnected }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Check if ethereum is available (MetaMask injected)
  const isEthereumAvailable = typeof window !== 'undefined' && (window as any).ethereum;
  
  // Simulate wallet connection
  const connectWallet = async (provider: WalletProvider) => {
    setConnecting(true);
    setError(null);
    
    try {
      // If MetaMask is available, try to connect to it
      if (provider === 'metamask' && isEthereumAvailable) {
        const ethereum = (window as any).ethereum;
        
        // Request account access
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          // Get chain ID
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          
          // Get ETH balance
          const balance = await ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });
          
          // Convert balance from wei to ETH
          const ethBalance = parseInt(balance, 16) / 1e18;
          
          const walletData: WalletInfo = {
            address: accounts[0],
            balance: ethBalance.toFixed(4),
            provider: 'metamask',
            connected: true,
            chainId: parseInt(chainId, 16)
          };
          
          setWalletInfo(walletData);
          onWalletConnected(walletData);
        }
      } else {
        // Simulate connection for demo purposes
        setTimeout(() => {
          const mockAddress = '0x' + Array(40).fill(0).map(() => 
            Math.floor(Math.random() * 16).toString(16)
          ).join('');
          
          const mockBalance = (Math.random() * 10).toFixed(4);
          
          const walletData: WalletInfo = {
            address: mockAddress,
            balance: mockBalance,
            provider,
            connected: true,
            chainId: 1 // Ethereum Mainnet
          };
          
          setWalletInfo(walletData);
          onWalletConnected(walletData);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletInfo(null);
    setError(null);
  };
  
  // Copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Address copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy address', err);
      });
  };
  
  return (
    <Card className="bg-[#121229] border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to transfer tokens
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-md p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        
        {!walletInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="bg-[#25254B] hover:bg-[#32326A] border-purple-800 justify-start h-auto py-3"
              onClick={() => connectWallet('metamask')}
              disabled={connecting}
            >
              <div className="flex items-center gap-2">
                <img src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" alt="MetaMask" className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">MetaMask</div>
                  <div className="text-xs text-gray-400">Connect with browser wallet</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-[#25254B] hover:bg-[#32326A] border-purple-800 justify-start h-auto py-3"
              onClick={() => connectWallet('walletconnect')}
              disabled={connecting}
            >
              <div className="flex items-center gap-2">
                <img src="https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png" alt="WalletConnect" className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">WalletConnect</div>
                  <div className="text-xs text-gray-400">Scan with WalletConnect</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-[#25254B] hover:bg-[#32326A] border-purple-800 justify-start h-auto py-3"
              onClick={() => connectWallet('coinbase')}
              disabled={connecting}
            >
              <div className="flex items-center gap-2">
                <img src="https://seeklogo.com/images/C/coinbase-coin-logo-C86F46D7B8-seeklogo.com.png" alt="Coinbase" className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">Coinbase</div>
                  <div className="text-xs text-gray-400">Connect with Coinbase Wallet</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-[#25254B] hover:bg-[#32326A] border-purple-800 justify-start h-auto py-3"
              onClick={() => connectWallet('trustwallet')}
              disabled={connecting}
            >
              <div className="flex items-center gap-2">
                <img src="https://trustwallet.com/assets/images/trust_platform.svg" alt="Trust Wallet" className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">Trust Wallet</div>
                  <div className="text-xs text-gray-400">Connect with Trust Wallet</div>
                </div>
              </div>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#0A0A1B]/80 rounded-md p-4 border border-purple-800/30">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500/20 p-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">Connected</span>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => copyToClipboard(walletInfo.address)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => window.open(`https://etherscan.io/address/${walletInfo.address}`, '_blank')}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-400">Address</span>
                <span className="font-mono text-sm text-gray-300">{shortenAddress(walletInfo.address)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Balance</span>
                <span className="font-mono text-sm text-gray-300">{walletInfo.balance} ETH</span>
              </div>
              
              <Separator className="my-3 bg-gray-800" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-400">
                    {walletInfo.chainId === 1 ? 'Ethereum Mainnet' : 
                     walletInfo.chainId === 56 ? 'Binance Smart Chain' :
                     walletInfo.chainId === 137 ? 'Polygon' : 'Unknown Network'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <img
                    src={
                      walletInfo.provider === 'metamask' ? 'https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png' :
                      walletInfo.provider === 'walletconnect' ? 'https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png' :
                      walletInfo.provider === 'coinbase' ? 'https://seeklogo.com/images/C/coinbase-coin-logo-C86F46D7B8-seeklogo.com.png' :
                      'https://trustwallet.com/assets/images/trust_platform.svg'
                    }
                    alt={walletInfo.provider}
                    className="h-4 w-4"
                  />
                  <span className="text-xs capitalize">{walletInfo.provider}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={disconnectWallet}
                className="text-gray-400 hover:text-gray-300"
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}