export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  dietary: string[];
  available: boolean;
  image: string;
  preparationTime: number;
  popularity: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  capacity: number;
}

export interface RestaurantState {
  menuItems: MenuItem[];
  reservations: Reservation[];
  availableSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  menuFilters: {
    category: string;
    dietary: string[];
    priceRange: [number, number];
    searchQuery: string;
  };
}

export type RestaurantAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'UPDATE_MENU_ITEM'; payload: Partial<MenuItem> & { id: string } }
  | { type: 'SET_RESERVATIONS'; payload: Reservation[] }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'UPDATE_RESERVATION'; payload: Partial<Reservation> & { id: string } }
  | { type: 'SET_AVAILABLE_SLOTS'; payload: TimeSlot[] }
  | { type: 'UPDATE_MENU_FILTERS'; payload: Partial<RestaurantState['menuFilters']> };