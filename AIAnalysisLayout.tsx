/**
 * AI Analysis Layout Component
 * 
 * This component provides a consistent layout for all AI Analysis pages:
 * - Header with user info and page title
 * - Sidebar with navigation
 * - Main content area
 */

import React, { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Brain, Bot, LineChart, AlertTriangle, MessageSquare, FileText, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AIAnalysisLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const SidebarNavItem = ({ href, label, icon, active }: SidebarNavItemProps) => {
  return (
    <Link href={href}>
      <a className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
        active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}>
        {icon}
        {label}
      </a>
    </Link>
  );
};

export function AIAnalysisLayout({ children, title = 'AI Analysis', description }: AIAnalysisLayoutProps) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  // Navigation items
  const navItems = [
    {
      href: '/ai-analysis',
      label: 'Market Insights',
      icon: <Brain className="h-4 w-4" />,
      match: ['/ai-analysis'],
    },
    {
      href: '/ai-analysis/recommendations',
      label: 'Investment Recommendations',
      icon: <LineChart className="h-4 w-4" />,
      match: ['/ai-analysis/recommendations'],
    },
    {
      href: '/ai-analysis/anomalies',
      label: 'Risk Detection',
      icon: <AlertTriangle className="h-4 w-4" />,
      match: ['/ai-analysis/anomalies'],
    },
    {
      href: '/ai-analysis/chat',
      label: 'AI Assistant',
      icon: <MessageSquare className="h-4 w-4" />,
      match: ['/ai-analysis/chat'],
    },
    {
      href: '/ai-analysis/reports',
      label: 'Portfolio Reports',
      icon: <FileText className="h-4 w-4" />,
      match: ['/ai-analysis/reports'],
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Sidebar */}
      <Sidebar className="border-r" />

      {/* Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 pt-10">
              <nav className="grid gap-2 text-lg font-medium">
                {navItems.map((item, index) => (
                  <SidebarNavItem
                    key={index}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={item.match.includes(location)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {!isLoading && user && (
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="text-sm hidden sm:inline-block">{user.displayName || user.username}</span>
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.displayName || user.username || 'Profile'} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {(user.displayName || user.username || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Secondary Navigation */}
        <div className="h-[60px] border-b flex items-center">
          <div className="container px-4 md:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <SidebarNavItem
                  key={index}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={item.match.includes(location)}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}