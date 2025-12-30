import React, { useState, useEffect } from 'react';
import { Service } from '../../types';
import { Button } from '../ui/Button';
import { ArrowLeft, Check, Calendar, CreditCard, Sparkles, AlertCircle, Lock } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface BookingWizardProps {
  onClose: () => void;
  onSuccess?: () => void; // Called after successful booking to navigate user
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Booking form data
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    scheduledDate: '',
    scheduledTime: '',
    specialInstructions: '',
    password: '' // New field for account creation
  });

  useEffect(() => {
    loadServices();
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (session?.user) {
      // Pre-fill data if user is logged in
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          customerName: profile.full_name || '',
          customerEmail: profile.email || session.user.email || '',
        }));
      }
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getServices();

      // Filter for commercial services if needed, or just use what's in DB
      // For now, we'll use whatever is in the DB. 
      // If the DB is empty, we might want to show a message or fallback,
      // but falling back to mocks with invalid IDs causes errors.
      if (data && data.length > 0) {
        setServices(data);
      } else {
        // Fallback for demo purposes ONLY if DB is empty - but warn about IDs
        console.warn('No services found in DB. Using mock data which may fail booking creation due to ID mismatch.');
        const mockServices: Service[] = [
          {
            id: 'office-maintenance',
            name: 'Office Maintenance',
            description: 'Daily or weekly cleaning for professional workspaces. Trash removal, vacuuming, mopping, and restroom sanitation.',
            base_price: 200,
            duration_minutes: 120,
            image_url: '/images/service-office-maintenance.png'
          },
          {
            id: 'corporate-deep-clean',
            name: 'Corporate Deep Clean',
            description: 'Comprehensive detailed cleaning for offices. Windows, breakrooms, conference rooms, and all common areas.',
            base_price: 450,
            duration_minutes: 240,
            image_url: '/images/service-corporate-deep-clean.png'
          },
          {
            id: 'commercial-floor-care',
            name: 'Commercial Floor Care',
            description: 'Professional floor maintenance including stripping, waxing, buffing, and high-traffic area restoration.',
            base_price: 300,
            duration_minutes: 180,
            image_url: '/images/service-commercial-floor-care.png'
          },
          {
            id: 'post-construction-cleanup',
            name: 'Post-Construction Cleanup',
            description: 'Heavy-duty site cleanup for renovated or newly built commercial spaces. Debris removal and move-in ready finish.',
            base_price: 600,
            duration_minutes: 480,
            image_url: '/images/service-post-construction.png'
          }
        ];
        setServices(mockServices);
      }
    } catch (error: any) {
      console.error('Failed to load services:', error);
      setError(error.message || 'Failed to load available services. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedService) return;

    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    try {
      setSubmitting(true);
      setError(null);

      // Always check the latest session state first
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      let userId = currentSession?.user?.id;

      // 1. Handle Authentication (Create Account or Sign In)
      if (!userId) {
        if (!formData.password) {
          setError('Please provide a password to create your account.');
          setSubmitting(false);
          return;
        }

        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.customerEmail,
            password: formData.password,
            options: {
              data: {
                full_name: formData.customerName,
                role: 'customer'
              }
            }
          });

          if (authError) throw authError;

          if (authData.user) {
            userId = authData.user.id;
            // Wait a moment for the trigger to create the public user profile if needed
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (authError: any) {
          // If user already exists, try to sign them in with the provided password
          if (authError.message?.includes('already registered') || authError.message?.includes('User already exists')) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: formData.customerEmail,
              password: formData.password
            });

            if (signInError) {
              // If sign in fails (e.g. wrong password), show a clearer error
              if (signInError.message.includes('Invalid login credentials')) {
                throw new Error('An account with this email already exists, but the password provided was incorrect.');
              }
              throw signInError;
            }

            if (signInData.user) {
              userId = signInData.user.id;
            }
          } else {
            // Re-throw other auth errors
            throw authError;
          }
        }
      }

      if (!userId) {
        throw new Error('Authentication failed. Please try again.');
      }

      // Combine date and time into ISO string
      const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();

      // 2. Create Booking
      await supabaseService.createBooking({
        service_id: selectedService,
        scheduled_at: scheduledAt,
        total_price: service.base_price,
        address: formData.address,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        special_instructions: formData.specialInstructions || undefined,
        customer_id: userId,
      });

      // Success! Call onSuccess to navigate to profile, or fallback to just closing
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-brand-navy/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right rounded-l-[2rem] border-l border-white/20">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/90 backdrop-blur rounded-tl-[2rem] z-10">
          <button onClick={onClose} className="text-brand-slate hover:text-brand-navy transition-colors font-medium text-sm flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Cancel
          </button>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${i <= step ? 'bg-brand-gold shadow-glow' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-8 mt-6 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

          {step === 1 && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">Step 1 of 3</span>
                <h2 className="text-3xl font-serif font-bold text-brand-navy mt-2">Select a Service</h2>
                <p className="text-brand-slate mt-2">Choose the level of clean your business needs.</p>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-brand-slate mt-4">Loading services...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No services available.
                  </div>
                ) : (
                  services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedService === service.id
                        ? 'border-brand-navy bg-brand-navy/5 shadow-md'
                        : 'border-gray-100 hover:border-brand-navy/30 hover:shadow-lg'
                        }`}
                    >
                      <div className="flex items-start space-x-5">
                        <img src={service.image_url} alt={service.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-serif font-bold text-brand-navy">{service.name}</h3>
                            <span className="font-semibold text-brand-navy/70 text-xs bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                              Request Estimate
                            </span>
                          </div>
                          <p className="text-sm text-brand-slate leading-relaxed mb-3">{service.description}</p>
                          <div className="flex items-center text-xs font-medium text-brand-gold">
                            <Sparkles size={14} className="mr-1" />
                            Est. {service.duration_minutes / 60} hours
                          </div>
                        </div>
                        {selectedService === service.id && (
                          <div className="absolute top-6 right-6 bg-brand-navy text-brand-gold p-1.5 rounded-full shadow-lg transform scale-100 transition-transform">
                            <Check size={16} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}


              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">Step 2 of 3</span>
                <h2 className="text-3xl font-serif font-bold text-brand-navy mt-2">Business Details</h2>
                <p className="text-brand-slate mt-2">Tell us about your company and where we should clean.</p>
              </div>

              <div className="space-y-5">

                {/* Account Creation / Login Status */}
                {!session ? (
                  <div className="bg-brand-navy/5 p-5 rounded-2xl border border-brand-navy/10 mb-6 flex items-start space-x-3">
                    <Sparkles className="text-brand-navy mt-0.5" size={18} />
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm mb-1">Create your account</h4>
                      <p className="text-xs text-brand-slate">We'll create a secure account for you to manage your bookings.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6 flex items-center">
                    <Check size={16} className="text-green-600 mr-2" />
                    <p className="text-sm text-green-800">Logged in as <strong>{session.user.email}</strong></p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">Contact Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-medium text-brand-navy"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-medium text-brand-navy"
                    placeholder="john@example.com"
                    required
                    disabled={!!session}
                  />
                </div>

                {/* Password Field */}
                {!session && (
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">Create Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-medium text-brand-navy"
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-medium text-brand-navy"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">Business Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-medium text-brand-navy"
                    placeholder="123 Main St, San Francisco, CA 94102"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-medium text-brand-navy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-medium text-brand-navy"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">Special Instructions (Optional)</label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all font-medium text-brand-navy"
                    rows={3}
                    placeholder="Any specific areas to focus on or access instructions..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">Step 3 of 3</span>
                <h2 className="text-3xl font-serif font-bold text-brand-navy mt-2">Confirm Request</h2>
                <p className="text-brand-slate mt-2">Double check your details before submitting.</p>
              </div>

              <div className="bg-brand-gray/50 p-8 rounded-2xl space-y-5 border border-gray-100">
                <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                  <span className="text-brand-slate">Service</span>
                  <span className="font-bold text-brand-navy">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                  <span className="text-brand-slate">Date & Time</span>
                  <span className="font-bold text-brand-navy text-right">
                    {formData.scheduledDate && formData.scheduledTime
                      ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })
                      : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                  <span className="text-brand-slate">Address</span>
                  <span className="font-bold text-brand-navy text-right max-w-xs">{formData.address}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                  <span className="text-brand-slate">Contact</span>
                  <span className="font-bold text-brand-navy">{formData.customerEmail}</span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-brand-navy">Estimated Total</span>
                  <span className="px-3 py-1 bg-brand-navy text-brand-gold text-xs font-bold uppercase rounded-full tracking-wider">Pending Quote</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start space-x-3">
                <Sparkles size={20} className="text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong>Almost done!</strong> Upon submission, our team will review your requirements and send a finalized quote to your email within 24 hours.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 bg-white rounded-bl-[2rem]">
          <div className="flex space-x-4">
            {step > 1 && (
              <Button onClick={prevStep} variant="outline" fullWidth disabled={submitting}>Back</Button>
            )}
            <Button
              onClick={() => {
                if (step === 3) handleSubmitBooking();
                else nextStep();
              }}
              fullWidth
              variant="primary"
              className="shadow-glow"
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.address || !formData.scheduledDate || !formData.scheduledTime || (!session && !formData.password))) ||
                submitting
              }
            >
              {submitting ? 'Submitting...' : (step === 3 ? 'Request Quote' : 'Continue')}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};