/**
 * Mock Supabase client for BOLT frontend
 * This is a placeholder - will be replaced with real backend API integration
 */

export const supabase: any = null;

export type Service = {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  category: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name?: string;
  email?: string;
  role?: 'customer' | 'helper';
  [key: string]: any;
};

export type HelperProfile = {
  id: string;
  bio?: string;
  rating_average?: number;
  jobs_completed?: number;
  [key: string]: any;
};

