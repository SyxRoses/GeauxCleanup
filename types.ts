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

// ============================================
// MY ACCOUNT FEATURES
// ============================================

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  cleaner_id?: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
  // Joined data
  booking?: Booking;
}

export interface SupportTicket {
  id: string;
  customer_id: string;
  booking_id?: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_payment_method_id: string;
  stripe_customer_id: string;
  card_last4: string;
  card_brand: string; // visa, mastercard, amex, etc.
  card_exp_month?: number;
  card_exp_year?: number;
  is_default: boolean;
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses?: number;
  current_uses: number;
  expires_at?: string;
  is_active: boolean;
}

export interface UserCredit {
  id: string;
  user_id: string;
  amount: number;
  source: 'referral' | 'promo' | 'refund' | 'admin_gift';
  description?: string;
  expires_at?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referral_code: string;
  referred_email?: string;
  referred_user_id?: string;
  status: 'pending' | 'signed_up' | 'first_booking' | 'reward_given';
  reward_amount: number;
  created_at: string;
}

// History page booking with review status
export interface BookingWithReview extends Booking {
  review?: Review;
  hasReview: boolean;
}