import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { parse as parseUrl } from 'expo-linking';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

// Check if code is running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  if (!isBrowser) return false;
  
  try {
    if (typeof localStorage !== 'undefined') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// Empty storage for SSR (server-side rendering)
const emptyStorage = {
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, _value: string) => Promise.resolve(),
  removeItem: (_key: string) => Promise.resolve(),
};

// Platform-specific storage implementation
const getSupabaseStorage = () => {
  // For SSR (server-side rendering), use empty storage
  if (!isBrowser) {
    return emptyStorage;
  }
  
  if (Platform.OS === 'web' && isLocalStorageAvailable()) {
    // Use localStorage for web platform
    return {
      getItem: (key: string) => {
        try {
          const value = localStorage.getItem(key);
          return Promise.resolve(value);
        } catch (error) {
          console.error('Error getting item from localStorage:', error);
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (error) {
          console.error('Error setting item in localStorage:', error);
          return Promise.resolve();
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch (error) {
          console.error('Error removing item from localStorage:', error);
          return Promise.resolve();
        }
      },
    };
  } else {
    // Use SecureStore for native platforms
    return {
      getItem: async (key: string) => {
        try {
          return await SecureStore.getItemAsync(key);
        } catch (error) {
          console.error('Error getting item from SecureStore:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await SecureStore.setItemAsync(key, value);
          return Promise.resolve();
        } catch (error) {
          console.error('Error setting item in SecureStore:', error);
          return Promise.resolve();
        }
      },
      removeItem: async (key: string) => {
        try {
          await SecureStore.deleteItemAsync(key);
          return Promise.resolve();
        } catch (error) {
          console.error('Error removing item from SecureStore:', error);
          return Promise.resolve();
        }
      },
    };
  }
};

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.');
}

// Social auth configuration
const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const appleClientId = process.env.EXPO_PUBLIC_APPLE_CLIENT_ID;
const enableSocialAuth = process.env.EXPO_PUBLIC_ENABLE_SOCIAL_AUTH === 'true';
const enableAppleAuth = process.env.EXPO_PUBLIC_ENABLE_APPLE_AUTH === 'true' && enableSocialAuth;
const enableGoogleAuth = process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH === 'true' && enableSocialAuth;

// Create Supabase client with appropriate SSR config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getSupabaseStorage(),
    autoRefreshToken: isBrowser, // Only refresh tokens in browser/app environments
    persistSession: true,
    detectSessionInUrl: isBrowser && Platform.OS === 'web', // Only detect sessions in URL on web
  },
});

// Helper function for handling OAuth flow
export const signInWithOAuth = async (provider: 'google' | 'apple') => {
  try {
    // Prepare the URL to redirect the user
    const redirectUrl = Linking.createURL('/auth/callback');
    
    // Begin the auth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        scopes: provider === 'google' ? 'email profile' : 'email name',
      },
    });
    
    if (error) throw error;
    
    if (Platform.OS === 'web') {
      // For web, we can redirect directly
      window.location.href = data?.url || '';
      return { success: true };
    } else {
      // For native, use WebBrowser
      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        data?.url || '',
        redirectUrl
      );
      
      if (result.type === 'success') {
        const { url } = result;
        const parsedUrl = parseUrl(url);
        
        // Handle URL parameters via path and queryParams
        if (parsedUrl.queryParams && parsedUrl.queryParams.access_token) {
          return { success: true, data: parsedUrl.queryParams };
        }
      }
      
      return { success: false, error: 'Authentication canceled' };
    }
  } catch (error) {
    console.error('OAuth error:', error);
    return { success: false, error };
  }
};

// Helper function for phone auth
export const signInWithPhone = async (phone: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true,
      }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Phone auth error:', error);
    return { success: false, error };
  }
};

// Helper function to verify OTP
export const verifyOtp = async (phone: string, otp: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms'
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { success: false, error };
  }
};

// Types are generated using: 
// bunx supabase gen types typescript --project-id ngdwxcejxtluaecusrkv > lib/types/database.types.ts