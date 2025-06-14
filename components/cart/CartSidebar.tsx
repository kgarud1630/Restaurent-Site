'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const handleCheckout = () => {
    onOpenChange(false);
    // Navigation to checkout will be handled by the Link component
  };

  if (state.items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Your Cart</span>
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some delicious items from our menu to get started
            .
            </p>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Your Cart</span>
              <Badge variant="secondary">{state.itemCount}</Badge>
            </div>
            {state.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            {state.items.map((item) => (
              <div key={item.cartId} className="flex items-center space-x-4">
                {/* Item Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Item Total & Remove */}
                <div className="text-right">
                  <p className="font-medium text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive mt-1"
                    onClick={() => removeItem(item.cartId)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Cart Summary */}
        <div className="border-t pt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${state.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${state.tax.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span>
                {state.deliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `$${state.deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${state.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Free Delivery Notice */}
          {state.subtotal < 50 && state.subtotal > 0 && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              Add ${(50 - state.subtotal).toFixed(2)} more for free delivery!
            </div>
          )}

          {/* Checkout Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleCheckout}
            asChild
          >
            <Link href="/checkout">
              Proceed to Checkout
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}