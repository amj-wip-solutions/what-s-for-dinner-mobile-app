// src/lib/supabaseClient.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// 🔑 Fetch your Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing from environment variables.");
}
console.log(process.env)
// Initialize the Supabase client for React Native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use AsyncStorage to store the user's session
        storage: AsyncStorage,
        // Automatically refresh the token
        autoRefreshToken: true,
        // Persist the session on the device
        persistSession: true,
        // Don't try to detect sessions from the URL, which is a browser-only feature
        detectSessionInUrl: false,
    },
});