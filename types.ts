export enum UserRole {
  CUSTOMER = 'customer',
  CLEANER = 'cleaner',
  ADMIN = 'admin'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  EN_ROUTE = 'en_route',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface CleanerProfile {
  user_id: string;
  bio: string;
  rating: number;
  jobs_completed: number;
  is_verified: boolean;
  current_location?: {
    lat: number;
    lng: number;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  duration_minutes: number;
}

export interface Booking {
  id: string;
  customer_id?: string;
  cleaner_id?: string;
  service_id: string;
  status: BookingStatus;
  scheduled_at: string; // ISO date
  total_price: number;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  special_instructions?: string;
  services?: Service; // For joined queries
}

// For chart data
export interface RevenueData {
  name: string;
  value: number;
}

export interface AdminTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  created_at?: string;
}