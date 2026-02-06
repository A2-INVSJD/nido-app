import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// TODO: Replace with actual Supabase credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types
export interface Student {
  id: string;
  name: string;
  age: number;
  parent_name: string;
  parent_phone: string;
  access_code: string;
  photo_url?: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  check_in: string;
  check_out?: string;
  checked_in_by: string;
  checked_out_by?: string;
  signature_in?: string;
  signature_out?: string;
  date: string;
}

export interface DailyReport {
  id: string;
  student_id: string;
  date: string;
  meals: string;
  nap: string;
  activities: string;
  mood: string;
  notes: string;
  created_by: string;
}
