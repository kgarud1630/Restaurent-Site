'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { MenuItem, Reservation, RestaurantState, RestaurantAction } from '@/types/restaurant';

const initialState: RestaurantState = {
  menuItems: [],
  reservations: [],
  availableSlots: [],
  loading: false,
  error: null,
  menuFilters: {
    category: 'all',
    dietary: [],
    priceRange: [0, 100],
    searchQuery: '',
  },
};

function restaurantReducer(state: RestaurantState, action: RestaurantAction): RestaurantState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload, loading: false };
    
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };
    
    case 'SET_RESERVATIONS':
      return { ...state, reservations: action.payload };
    
    case 'ADD_RESERVATION':
      return { ...state, reservations: [...state.reservations, action.payload] };
    
    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(reservation =>
          reservation.id === action.payload.id ? { ...reservation, ...action.payload } : reservation
        ),
      };
    
    case 'SET_AVAILABLE_SLOTS':
      return { ...state, availableSlots: action.payload };
    
    case 'UPDATE_MENU_FILTERS':
      return { ...state, menuFilters: { ...state.menuFilters, ...action.payload } };
    
    default:
      return state;
  }
}

const RestaurantContext = createContext<{
  state: RestaurantState;
  dispatch: React.Dispatch<RestaurantAction>;
  loadMenuItems: () => Promise<void>;
  loadReservationSlots: () => Promise<void>;
  createReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => Promise<void>;
  updateMenuFilters: (filters: Partial<RestaurantState['menuFilters']>) => void;
} | null>(null);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  const loadMenuItems = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Updated menu items without beef products
      const mockMenuItems: MenuItem[] = [
        {
          id: '1',
          name: 'Grilled Atlantic Salmon',
          description: 'Fresh Atlantic salmon with herb butter, roasted vegetables, and lemon quinoa',
          price: 32.00,
          category: 'main',
          dietary: ['gluten-free'],
          available: true,
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
          preparationTime: 15,
          popularity: 95,
        },
        {
          id: '2',
          name: 'Truffle Risotto',
          description: 'Creamy arborio rice with black truffle, parmesan, and wild mushrooms',
          price: 28.00,
          category: 'main',
          dietary: ['vegetarian', 'gluten-free'],
          available: true,
          image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
          preparationTime: 20,
          popularity: 88,
        },
        {
          id: '3',
          name: 'Pan-Seared Duck Breast',
          description: 'Succulent duck breast with cherry reduction and roasted root vegetables',
          price: 38.00,
          category: 'main',
          dietary: ['gluten-free'],
          available: true,
          image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg',
          preparationTime: 25,
          popularity: 92,
        },
        {
          id: '4',
          name: 'Caesar Salad',
          description: 'Crisp romaine lettuce with house-made croutons, parmesan, and Caesar dressing',
          price: 16.00,
          category: 'appetizer',
          dietary: ['vegetarian'],
          available: true,
          image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
          preparationTime: 5,
          popularity: 85,
        },
        {
          id: '5',
          name: 'Chocolate Lava Cake',
          description: 'Warm chocolate cake with molten center, vanilla ice cream, and berry coulis',
          price: 12.00,
          category: 'dessert',
          dietary: ['vegetarian'],
          available: true,
          image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
          preparationTime: 10,
          popularity: 90,
        },
        {
          id: '6',
          name: 'Grilled Chicken Breast',
          description: 'Herb-marinated chicken breast with seasonal vegetables and garlic mashed potatoes',
          price: 26.00,
          category: 'main',
          dietary: ['gluten-free'],
          available: true,
          image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg',
          preparationTime: 18,
          popularity: 87,
        },
        {
          id: '7',
          name: 'Mediterranean Quinoa Bowl',
          description: 'Quinoa with roasted vegetables, feta cheese, olives, and tahini dressing',
          price: 22.00,
          category: 'main',
          dietary: ['vegetarian', 'gluten-free'],
          available: true,
          image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
          preparationTime: 12,
          popularity: 83,
        },
        {
          id: '8',
          name: 'Seafood Linguine',
          description: 'Fresh linguine with shrimp, scallops, and mussels in white wine sauce',
          price: 34.00,
          category: 'main',
          dietary: [],
          available: true,
          image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
          preparationTime: 22,
          popularity: 91,
        },
        {
          id: '9',
          name: 'Caprese Salad',
          description: 'Fresh mozzarella, tomatoes, and basil with balsamic reduction',
          price: 14.00,
          category: 'appetizer',
          dietary: ['vegetarian', 'gluten-free'],
          available: true,
          image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',
          preparationTime: 8,
          popularity: 79,
        },
        {
          id: '10',
          name: 'Tiramisu',
          description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
          price: 10.00,
          category: 'dessert',
          dietary: ['vegetarian'],
          available: true,
          image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg',
          preparationTime: 5,
          popularity: 88,
        },
      ];
      
      dispatch({ type: 'SET_MENU_ITEMS', payload: mockMenuItems });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load menu items' });
    }
  }, []);

  const loadReservationSlots = useCallback(async () => {
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const today = new Date();
      const slots = [];
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
        timeSlots.forEach(time => {
          slots.push({
            date: date.toISOString().split('T')[0],
            time,
            available: Math.random() > 0.3, // 70% availability
            capacity: 4,
          });
        });
      }
      
      dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: slots });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load reservation slots' });
    }
  }, []);

  const createReservation = useCallback(async (reservationData: Omit<Reservation, 'id' | 'status'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReservation: Reservation = {
        ...reservationData,
        id: Date.now().toString(),
        status: 'confirmed',
      };
      
      dispatch({ type: 'ADD_RESERVATION', payload: newReservation });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create reservation' });
      throw error;
    }
  }, []);

  const updateMenuFilters = useCallback((filters: Partial<RestaurantState['menuFilters']>) => {
    dispatch({ type: 'UPDATE_MENU_FILTERS', payload: filters });
  }, []);

  const value = {
    state,
    dispatch,
    loadMenuItems,
    loadReservationSlots,
    createReservation,
    updateMenuFilters,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}

export { RestaurantContext }