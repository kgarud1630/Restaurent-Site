'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Menu, 
  ShoppingCart, 
  User, 
  LogOut, 
  Settings,
  Calendar,
  Heart,
  Utensils,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import AuthDialog from '@/components/auth/AuthDialog';
import CartSidebar from '@/components/cart/CartSidebar';

const navigation = [
  { name: 'Home', href: '/', ariaLabel: 'Go to homepage' },
  { name: 'Menu', href: '/menu', ariaLabel: 'View our menu' },
  { name: 'Reservations', href: '/reservations', ariaLabel: 'Make a reservation' },
  { name: 'About', href: '/about', ariaLabel: 'Learn about us' },
  { name: 'Contact', href: '/contact', ariaLabel: 'Contact us' },
];

interface NavigationMenuProps {
  className?: string;
  variant?: 'default' | 'hero';
}

export default function NavigationMenu({ className = '', variant = 'default' }: NavigationMenuProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  
  const { state: authState, logout } = useAuth();
  const { state: cartState } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  
  // Refs for performance optimization
  const menuRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced scroll handler for performance
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      const scrolled = window.scrollY > 0;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    }, 10);
  }, [isScrolled]);

  // Debounced hover handlers to prevent flickering
  const handleMouseEnter = useCallback((itemName: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredItem(itemName);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 100);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent, href: string) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        router.push(href);
        break;
      case 'Escape':
        setIsMobileMenuOpen(false);
        setFocusedItem(null);
        break;
      case 'Tab':
        // Let default tab behavior work
        break;
    }
  }, [router]);

  // Focus management
  const handleFocus = useCallback((itemName: string) => {
    setFocusedItem(itemName);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedItem(null);
  }, []);

  // Mobile menu toggle with focus management
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev;
      if (newState && mobileMenuRef.current) {
        // Focus first menu item when opening
        const firstLink = mobileMenuRef.current.querySelector('a');
        firstLink?.focus();
      }
      return newState;
    });
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Scroll event listener with cleanup
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Dynamic styles based on scroll state and variant
  const headerStyles = variant === 'hero' 
    ? 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out'
    : 'sticky top-0 z-50 transition-all duration-300 ease-out';

  const backgroundStyles = isScrolled || variant !== 'hero'
    ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
    : 'bg-transparent';

  const textStyles = isScrolled || variant !== 'hero'
    ? 'text-foreground'
    : 'text-white';

  return (
    <>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-[60] transition-all duration-200"
      >
        Skip to main content
      </a>

      <header 
        ref={menuRef}
        className={`${headerStyles} ${backgroundStyles} ${className}`}
        role="banner"
        aria-label="Main navigation"
      >
        <nav 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          role="navigation"
          aria-label="Primary navigation"
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md transition-all duration-200"
              aria-label="Savoria Restaurant - Go to homepage"
            >
              <Utensils className={`h-8 w-8 text-primary transition-transform duration-200 group-hover:scale-110 ${
                variant === 'hero' && !isScrolled ? 'drop-shadow-lg' : ''
              }`} />
              <span className={`font-bold text-xl font-playfair transition-colors duration-200 ${textStyles} ${
                variant === 'hero' && !isScrolled ? 'drop-shadow-lg' : ''
              }`}>
                Savoria
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav 
              className="hidden md:flex items-center space-x-1"
              role="menubar"
              aria-label="Main menu"
            >
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const isHovered = hoveredItem === item.name;
                const isFocused = focusedItem === item.name;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      transform will-change-transform
                      ${isActive 
                        ? 'text-primary bg-primary/10' 
                        : `${textStyles} hover:text-primary hover:bg-primary/5`
                      }
                      ${isHovered || isFocused ? 'scale-105' : 'scale-100'}
                      ${variant === 'hero' && !isScrolled ? 'hover:backdrop-blur-sm' : ''}
                    `}
                    role="menuitem"
                    aria-label={item.ariaLabel}
                    aria-current={isActive ? 'page' : undefined}
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                    onFocus={() => handleFocus(item.name)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleKeyDown(e, item.href)}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {/* Hover indicator */}
                    <span 
                      className={`
                        absolute inset-0 rounded-md bg-primary/10 transition-opacity duration-200
                        ${isHovered || isFocused ? 'opacity-100' : 'opacity-0'}
                      `}
                      aria-hidden="true"
                    />
                    {/* Active indicator */}
                    {isActive && (
                      <span 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`
                  relative transition-all duration-200 ease-out transform will-change-transform
                  hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${textStyles} hover:text-primary hover:bg-primary/10
                  ${variant === 'hero' && !isScrolled ? 'hover:backdrop-blur-sm' : ''}
                `}
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping cart with ${cartState.itemCount} items`}
                aria-expanded={isCartOpen}
                aria-haspopup="dialog"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                    aria-label={`${cartState.itemCount} items in cart`}
                  >
                    {cartState.itemCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 hover:scale-110"
                      aria-label="User menu"
                      aria-expanded="false"
                      aria-haspopup="menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials(authState.user?.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 animate-in slide-in-from-top-2 duration-200" 
                    align="end" 
                    forceMount
                    role="menu"
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{authState.user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {authState.user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center" role="menuitem">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center" role="menuitem">
                        <Calendar className="mr-2 h-4 w-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center" role="menuitem">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center" role="menuitem">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} role="menuitem">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant={isScrolled || variant !== 'hero' ? "default" : "secondary"}
                  onClick={() => setIsAuthOpen(true)}
                  className="transition-all duration-200 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`
                  md:hidden transition-all duration-200 transform hover:scale-110 focus:scale-110
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${textStyles} hover:text-primary hover:bg-primary/10
                  ${variant === 'hero' && !isScrolled ? 'hover:backdrop-blur-sm' : ''}
                `}
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-haspopup="menu"
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`
            md:hidden fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-background border-l border-border shadow-xl
            transform transition-transform duration-300 ease-out will-change-transform z-50
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          role="menu"
          aria-label="Mobile navigation menu"
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold text-lg font-playfair">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:bg-muted transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4" role="menubar">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-6 py-4 text-lg font-medium transition-all duration-200
                      hover:bg-muted hover:text-primary focus:bg-muted focus:text-primary
                      focus:outline-none border-l-4 border-transparent
                      ${isActive ? 'text-primary bg-primary/5 border-l-primary' : 'text-foreground hover:border-l-primary/50'}
                    `}
                    role="menuitem"
                    aria-label={item.ariaLabel}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        router.push(item.href);
                      }
                    }}
                    tabIndex={isMobileMenuOpen ? 0 : -1}
                  >
                    {item.name}
                    {isActive && (
                      <span className="ml-auto">
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Footer */}
            {!authState.isAuthenticated && (
              <div className="p-4 border-t border-border">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="w-full transition-all duration-200 transform hover:scale-[1.02] focus:scale-[1.02]"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog 
        open={isAuthOpen} 
        onOpenChange={setIsAuthOpen}
        onSuccess={handleAuthSuccess}
      />

      {/* Cart Sidebar */}
      <CartSidebar 
        open={isCartOpen} 
        onOpenChange={setIsCartOpen}
      />

      {/* Main content landmark for skip navigation */}
      <div id="main-content" />
    </>
  );
}