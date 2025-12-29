import { supabase } from '../lib/supabase';
import { Booking, Service } from '../types';

export const supabaseService = {
    /**
     * Fetch all available cleaning services
     */
    getServices: async (): Promise<Service[]> => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('base_price', { ascending: true });

        if (error) {
            console.error('Error fetching services:', error);
            throw new Error(error.message);
        }

        return data || [];
    },

    /**
     * Create a new booking
     */
    createBooking: async (bookingData: {
        service_id: string;
        scheduled_at: string;
        total_price: number;
        address: string;
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        special_instructions?: string;
        customer_id?: string;
    }): Promise<Booking> => {
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                ...bookingData,
                status: 'pending',
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating booking:', error);
            throw new Error('Failed to create booking');
        }

        return data;
    },

    /**
     * Get all active bookings (for admin dashboard)
     */
    getActiveBookings: async (): Promise<Booking[]> => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, services(*)')
            .in('status', ['pending', 'confirmed', 'en_route', 'in_progress'])
            .order('scheduled_at', { ascending: true });

        if (error) {
            console.error('Error fetching bookings:', error);
            throw new Error('Failed to load bookings');
        }

        return data || [];
    },

    /**
     * Get bookings for the current user (customer dashboard)
     */
    getUserBookings: async (): Promise<Booking[]> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // We match by customer_email since we don't strictly link user_id in bookings yet
        // In a production app, we should use user_id foreign key
        const { data, error } = await supabase
            .from('bookings')
            .select('*, services(*)')
            .eq('customer_email', user.email)
            .order('scheduled_at', { ascending: false });

        if (error) {
            console.error('Error fetching user bookings:', error);
            throw new Error('Failed to load your bookings');
        }

        return data || [];
    },

    /**
     * Get a single booking by ID
     */
    getBooking: async (id: string): Promise<Booking | null> => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching booking:', error);
            return null;
        }

        return data;
    },

    /**
     * Update booking status
     */
    updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating booking:', error);
            throw new Error('Failed to update booking');
        }

        return data;
    },

    /**
     * Subscribe to cleaner location updates (for real-time tracking)
     */
    subscribeToCleanerLocations: (callback: (locations: any[]) => void) => {
        const channel = supabase
            .channel('cleaner-locations')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'cleaner_profiles'
                },
                (payload) => {
                    // Transform the payload into the format expected by the map
                    callback([payload.new]);
                }
            )
            .subscribe();

        // Return unsubscribe function
        return () => {
            supabase.removeChannel(channel);
        };
    },

    /**
     * Get all admin tasks
     */
    getAdminTasks: async (): Promise<any[]> => {
        const { data, error } = await supabase
            .from('admin_tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Create a new admin task
     */
    createAdminTask: async (task: { title: string; priority: string; status: string }) => {
        const { data, error } = await supabase
            .from('admin_tasks')
            .insert([task])
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error);
            throw error;
        }

        return data;
    },

    /**
     * Update an admin task
     */
    updateAdminTask: async (id: string, updates: any) => {
        const { data, error } = await supabase
            .from('admin_tasks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating task:', error);
            throw error;
        }

        return data;
    },

    /**
     * Delete an admin task
     */
    deleteAdminTask: async (id: string) => {
        const { error } = await supabase
            .from('admin_tasks')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },
    /**
     * Subscribe to real-time changes for a specific table
     */
    subscribeToTable: (table: string, callback: (payload: any) => void) => {
        const channel = supabase
            .channel(`public:${table}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table
                },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
};
