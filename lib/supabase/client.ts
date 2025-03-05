import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { parse as parseUrl } from 'expo-linking';
import * as Linking from 'expo-linking';

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

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
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
