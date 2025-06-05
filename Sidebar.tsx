import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <div className="h-screen flex flex-col bg-[#08081A] w-64 shrink-0 border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 flex items-center">
        <div className="bg-[#00B27A] rounded-full h-10 w-10 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="12 6 8 12 12 18 16 12 12 6"></polygon>
          </svg>
        </div>
        <div className="text-white font-bold text-xl">CryptoPilot</div>
      </div>
      
      {/* Flight Deck Section */}
      <div className="px-6 py-4">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-4">Flight Deck</div>
        <nav className="space-y-2">
          <a 
            href="/dashboard" 
            className={`flex items-center gap-3 p-2.5 rounded-md ${isActive('/dashboard') ? 'bg-[#121229] text-white' : 'text-gray-400 hover:bg-[#121229] hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            Dashboard
          </a>
          
          <a 
            href="/generate" 
            className={`flex items-center gap-3 p-2.5 rounded-md ${isActive('/generate') ? 'bg-[#121229] text-white' : 'text-gray-400 hover:bg-[#121229] hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            Generate
          </a>
          
          <a 
            href="/convert" 
            className={`flex items-center gap-3 p-2.5 rounded-md ${isActive('/convert') ? 'bg-[#121229] text-white' : 'text-gray-400 hover:bg-[#121229] hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 1l4 4-4 4"></path>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <path d="M7 23l-4-4 4-4"></path>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
            Convert
          </a>
          
          <a 
            href="/transfer" 
            className={`flex items-center gap-3 p-2.5 rounded-md ${isActive('/transfer') ? 'bg-[#121229] text-white' : 'text-gray-400 hover:bg-[#121229] hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            Transfer
          </a>
        </nav>
      </div>
      
      {/* Control Center Section */}
      <div className="px-6 py-4">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-4">Control Center</div>
        <nav className="space-y-2">
          <a 
            href="/wallet" 
            className={`flex items-center gap-3 p-2.5 rounded-md ${isActive('/wallet') ? 'bg-[#121229] text-white' : 'text-gray-400 hover:bg-[#121229] hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M6 12h.01"></path>
              <path d="M18 12h.01"></path>
            </svg>
            My Wallet
          </a>
          
          <a 
            href="/history" 
            className={`flex items-center gap-3 p-2.5 rounded-md ${isActive('/history') ? 'bg-[#121229] text-white' : 'text-gray-400 hover:bg-[#121229] hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            History
          </a>
          
          <a 
            href="/ai-analysis" 
            className={`flex items-center gap-3 p-2.5 rounded-md ${isActive('/ai-analysis') ? 'bg-[#121229] text-white' : 'text-gray-400 hover:bg-[#121229] hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
            AI Analysis
          </a>
          
          <a 
            href="/settings" 
            className={`flex items-center gap-3 p-2.5 rounded-md ${isActive('/settings') ? 'bg-[#121229] text-white' : 'text-gray-400 hover:bg-[#121229] hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Settings
          </a>
        </nav>
      </div>
      
      {/* User Profile */}
      <div className="mt-auto p-6 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <div className="font-medium text-white">
              {user?.displayName || user?.email?.split('@')[0] || "User"}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user?.email || ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}