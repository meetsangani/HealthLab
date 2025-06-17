import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly configured.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  date_of_birth: string;
  role: 'customer' | 'admin';
  created_at: string;
};

export type TestCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
};

export type Test = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  category?: TestCategory;
  turnaround_time: string;
  preparation_instructions: string;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  user?: User;
  test_ids: string[];
  tests?: Test[];
  total_amount: number;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'sample_collected' | 'report_ready' | 'completed';
  prescription_url?: string;
  report_url?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  notes?: string;
  created_at: string;
};