declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_ENABLE_SOCIAL_AUTH: string;
    EXPO_PUBLIC_ENABLE_APPLE_AUTH: string;
    EXPO_PUBLIC_ENABLE_GOOGLE_AUTH: string;
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    EXPO_PLATFORM: string;
    PLATFORM: string;
    NODE_ENV: "development" | "production" | "test";
  }
} 