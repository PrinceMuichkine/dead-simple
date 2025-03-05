import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// SecureStore adapter for Supabase storage
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types for database tables
export type Tables = {
  profiles: {
    id: string;
    user_type: 'merchant' | 'customer' | null;
    kyc_level: 1 | 2 | 3 | null;
    store_id: string | null;
    phone: string | null;
    email: string | null;
    created_at: string;
    updated_at: string;
  };
  stores: {
    id: string;
    name: string;
    owner_id: string;
    category: string;
    location: string | null;
    coordinates: { latitude: number; longitude: number } | null;
    logo_url: string | null;
    mobile_money_account: string | null;
    created_at: string;
    updated_at: string;
  };
  products: {
    id: string;
    store_id: string;
    name: string;
    price: number;
    description: string | null;
    images: string[];
    inventory_count: number | null;
    category: string | null;
    created_at: string;
    updated_at: string;
  };
  orders: {
    id: string;
    customer_id: string;
    store_id: string;
    total_amount: number;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_method: 'mobile_money' | 'card';
    delivery_address: string | null;
    created_at: string;
    updated_at: string;
  };
  order_items: {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    created_at: string;
  };
  reviews: {
    id: string;
    customer_id: string;
    store_id: string;
    order_id: string | null;
    rating: number;
    comment: string | null;
    created_at: string;
  };
}; 