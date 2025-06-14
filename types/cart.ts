export interface CartItem {
  cartId: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: {
    [key: string]: any;
  };
  specialInstructions?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  tax: number;
  subtotal: number;
  deliveryFee: number;
  loading: boolean;
  error: string | null;
}

export type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_TOTALS' }
  | { type: 'RESTORE_CART'; payload: CartItem[] };

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: PaymentMethod;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
}