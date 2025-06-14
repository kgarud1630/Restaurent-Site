'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { CartItem, CartState, CartAction, OrderSummary } from '@/types/cart';

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  tax: 0,
  subtotal: 0,
  deliveryFee: 0,
  loading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
        JSON.stringify(item.customizations) === JSON.stringify(action.payload.customizations)
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: updatedItems,
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.cartId !== action.payload),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...initialState,
      };
    
    case 'UPDATE_TOTALS':
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08; // 8% tax
      const deliveryFee = subtotal > 50 ? 0 : 5.99; // Free delivery over $50
      const total = subtotal + tax + deliveryFee;
      const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        subtotal,
        tax,
        deliveryFee,
        total,
        itemCount,
      };
    
    case 'RESTORE_CART':
      return {
        ...state,
        items: action.payload,
      };
    
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, 'cartId'>) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  getOrderSummary: () => OrderSummary;
  persistCart: () => void;
  restoreCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((item: Omit<CartItem, 'cartId'>) => {
    const cartItem: CartItem = {
      ...item,
      cartId: `${item.id}-${Date.now()}-${Math.random()}`,
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  }, []);

  const removeItem = useCallback((cartId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartId });
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } });
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cart_items');
  }, []);

  const getOrderSummary = useCallback((): OrderSummary => {
    return {
      items: state.items,
      subtotal: state.subtotal,
      tax: state.tax,
      deliveryFee: state.deliveryFee,
      total: state.total,
      itemCount: state.itemCount,
    };
  }, [state]);

  const persistCart = useCallback(() => {
    localStorage.setItem('cart_items', JSON.stringify(state.items));
  }, [state.items]);

  const restoreCart = useCallback(() => {
    try {
      const savedItems = localStorage.getItem('cart_items');
      if (savedItems) {
        const items = JSON.parse(savedItems);
        dispatch({ type: 'RESTORE_CART', payload: items });
      }
    } catch (error) {
      console.error('Failed to restore cart:', error);
    }
  }, []);

  // Update totals whenever items change
  useEffect(() => {
    dispatch({ type: 'UPDATE_TOTALS' });
  }, [state.items]);

  // Persist cart on changes
  useEffect(() => {
    if (state.items.length > 0) {
      persistCart();
    }
  }, [state.items, persistCart]);

  // Restore cart on mount
  useEffect(() => {
    restoreCart();
  }, [restoreCart]);

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getOrderSummary,
    persistCart,
    restoreCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}