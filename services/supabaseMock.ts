import { Booking, BookingStatus, CleanerProfile, Service, UserRole } from '../types';

// Mock Data
const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Standard Clean',
    description: 'Perfect for maintaining a tidy home. Dusting, vacuuming, mopping, and bathroom sanitation.',
    base_price: 120,
    image_url: 'https://picsum.photos/800/600?random=1',
    duration_minutes: 120
  },
  {
    id: '2',
    name: 'Deep Clean',
    description: 'A thorough top-to-bottom clean. Includes inside oven, baseboards, and window sills.',
    base_price: 250,
    image_url: 'https://picsum.photos/800/600?random=2',
    duration_minutes: 240
  },
  {
    id: '3',
    name: 'Move-In/Out',
    description: 'Empty home cleaning ensuring you get your deposit back.',
    base_price: 350,
    image_url: 'https://picsum.photos/800/600?random=3',
    duration_minutes: 360
  }
];

const ACTIVE_BOOKINGS: Booking[] = [
  {
    id: 'ATL-342',
    customer_id: 'cust-1',
    cleaner_id: 'cl-1',
    service_id: '2',
    status: BookingStatus.IN_PROGRESS,
    scheduled_at: new Date().toISOString(),
    total_price: 275,
    address: '123 Market St, San Francisco, CA',
    location: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 'ATL-343',
    customer_id: 'cust-2',
    cleaner_id: 'cl-2',
    service_id: '1',
    status: BookingStatus.EN_ROUTE,
    scheduled_at: new Date().toISOString(),
    total_price: 120,
    address: '450 Hayes St, San Francisco, CA',
    location: { lat: 37.7766, lng: -122.4228 }
  }
];

export const mockSupabase = {
  getServices: async (): Promise<Service[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(SERVICES), 500));
  },

  getActiveBookings: async (): Promise<Booking[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(ACTIVE_BOOKINGS), 500));
  },

  // Simulates the Realtime subscription
  subscribeToCleanerLocations: (callback: (locations: any[]) => void) => {
    // Generate some fake movement around SF
    const interval = setInterval(() => {
        const time = Date.now() / 1000;
        const locations = [
            {
                cleaner_id: 'cl-1',
                lat: 37.7749 + Math.sin(time) * 0.001,
                lng: -122.4194 + Math.cos(time) * 0.001,
                status: 'working'
            },
            {
                cleaner_id: 'cl-2',
                lat: 37.7766 + Math.cos(time * 0.5) * 0.002,
                lng: -122.4228 + Math.sin(time * 0.5) * 0.002,
                status: 'driving'
            }
        ];
        callback(locations);
    }, 2000);
    return () => clearInterval(interval);
  }
};