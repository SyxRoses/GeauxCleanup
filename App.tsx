import React, { useState, useEffect } from 'react';
import { Navbar } from './components/landing/Navbar';
import { Hero } from './components/landing/Hero';
import { ServicesSection } from './components/landing/ServicesSection';
import { ProcessSection } from './components/landing/ProcessSection';
import { ImageGallery } from './components/landing/ImageGallery';
import { BookingWizard } from './components/booking/BookingWizard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { HistoryPage } from './components/customer/HistoryPage';
import { SupportPage } from './components/customer/SupportPage';
import { WalletPage } from './components/customer/WalletPage';
import { ReferralPage } from './components/customer/ReferralPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ServicesPage } from './components/landing/ServicesPage';
import { PricingPage } from './components/landing/PricingPage';
import { AboutPage } from './components/landing/AboutPage';
import { Login } from './components/auth/Login';
import { Sparkles } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Booking } from './types';



const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-20 pb-12 font-sans">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div>
          <h4 className="font-serif font-bold text-brand-navy text-lg mb-6">Services</h4>
          <ul className="space-y-4 text-sm text-brand-slate">
            <li><a href="#" className="hover:text-brand-gold transition-colors">Residential Cleaning</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Office Cleaning</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Deep Cleaning</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Move-in/Move-out</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Post-Construction</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif font-bold text-brand-navy text-lg mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-brand-slate">
            <li><a href="#" className="hover:text-brand-gold transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Service Areas</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Reviews</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif font-bold text-brand-navy text-lg mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-brand-slate">
            <li className="font-medium text-brand-navy">(555) 123-4567</li>
            <li>hello@geauxcleanup.com</li>
            <li>123 Main Street<br />San Francisco, CA 94102</li>
          </ul>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-brand-navy rounded-xl flex items-center justify-center shadow-glow">
              <Sparkles className="text-brand-gold w-6 h-6" />
            </div>
            <span className="font-serif font-bold text-2xl text-brand-navy">GeauxCleanup</span>
          </div>
          <p className="text-sm text-brand-slate mb-6 leading-relaxed">
            Professional cleaning services for homes and offices. Trusted by thousands of customers.
          </p>
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-brand-gray rounded-full flex items-center justify-center text-brand-slate hover:bg-brand-navy hover:text-white transition-all cursor-pointer">f</div>
            <div className="w-10 h-10 bg-brand-gray rounded-full flex items-center justify-center text-brand-slate hover:bg-brand-navy hover:text-white transition-all cursor-pointer">x</div>
            <div className="w-10 h-10 bg-brand-gray rounded-full flex items-center justify-center text-brand-slate hover:bg-brand-navy hover:text-white transition-all cursor-pointer">in</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-slate/60">
        <p>© 2024 GeauxCleanup. All rights reserved.</p>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-brand-navy transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-navy transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-navy transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'customer' | 'admin' | 'services' | 'pricing' | 'about' | 'login' | 'history' | 'support' | 'wallet' | 'referral'>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [rebookData, setRebookData] = useState<Booking | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        // If user logs out while in admin/customer view, redirect home
        if (currentView === 'admin' || currentView === 'customer') {
          setCurrentView('home');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [currentView]);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (data) {
      setUserRole(data.role);
    }
  };

  // Global Logout Handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserRole(null);
    setCurrentView('home');
    alert('You have been signed out.');
  };

  // Protected Route Handler
  const handleAdminAccess = () => {
    if (!session) {
      setCurrentView('login');
    } else if (userRole === 'admin') {
      setCurrentView('admin');
    } else {
      alert("Access denied. You don't have admin permissions.");
    }
  };

  if (currentView === 'login') {
    return (
      <Login
        onSuccess={() => {
          // After login, decide where to go based on role
          // We need to wait for role fetch, but for now we can default to home
          // The useEffect will pick up the session and fetch role
          setCurrentView('home');

          // Small delay to allow role fetch to complete then redirect if admin
          setTimeout(() => {
            supabase.auth.getUser().then(async ({ data: { user } }) => {
              if (user) {
                const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
                if (data?.role === 'admin') setCurrentView('admin');
                else if (data?.role === 'customer') setCurrentView('customer');
              }
            });
          }, 500);
        }}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'customer') {
    return (
      <>
        <CustomerDashboard
          onLogout={handleLogout}
          onNewBooking={() => setIsBookingOpen(true)}
          onHome={() => setCurrentView('home')}
          onNavigate={(page) => setCurrentView(page)}
        />
        {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} onSuccess={() => { setIsBookingOpen(false); setCurrentView('customer'); }} />}
      </>
    );
  }

  if (currentView === 'history') {
    return (
      <>
        <HistoryPage
          onBack={() => setCurrentView('customer')}
          onRebook={(booking) => {
            setRebookData(booking);
            setIsBookingOpen(true);
          }}
        />
        {isBookingOpen && <BookingWizard onClose={() => { setIsBookingOpen(false); setRebookData(null); }} onSuccess={() => { setIsBookingOpen(false); setRebookData(null); setCurrentView('customer'); }} />}
      </>
    );
  }

  if (currentView === 'support') {
    return (
      <SupportPage onBack={() => setCurrentView('customer')} />
    );
  }

  if (currentView === 'wallet') {
    return (
      <WalletPage onBack={() => setCurrentView('customer')} />
    );
  }

  if (currentView === 'referral') {
    return (
      <ReferralPage onBack={() => setCurrentView('customer')} />
    );
  }

  if (currentView === 'admin') {
    // Double check protection
    if (!session || userRole !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">You do not have permission to view this page.</p>
            <button
              onClick={() => setCurrentView('home')}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
    return (
      <AdminDashboard
        onBack={() => setCurrentView('home')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'services') {
    return (
      <div className="min-h-screen bg-brand-gray font-sans text-gray-900">
        <Navbar
          session={session}
          onLogout={handleLogout}
          onOpenBooking={() => setIsBookingOpen(true)}
          onNavigate={(page) => {
            if (page === 'admin') handleAdminAccess();
            else setCurrentView(page as any);
          }}
        />
        <ServicesPage onBook={() => setIsBookingOpen(true)} />
        <Footer />
        {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} onSuccess={() => { setIsBookingOpen(false); setCurrentView('customer'); }} />}
      </div>
    );
  }

  if (currentView === 'pricing') {
    return (
      <div className="min-h-screen bg-brand-gray font-sans text-gray-900">
        <Navbar
          session={session}
          onLogout={handleLogout}
          onOpenBooking={() => setIsBookingOpen(true)}
          onNavigate={(page) => {
            if (page === 'admin') handleAdminAccess();
            else setCurrentView(page as any);
          }}
        />
        <PricingPage onBook={() => setIsBookingOpen(true)} />
        <Footer />
        {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} onSuccess={() => { setIsBookingOpen(false); setCurrentView('customer'); }} />}
      </div>
    );
  }

  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-brand-gray font-sans text-gray-900">
        <Navbar
          session={session}
          onLogout={handleLogout}
          onOpenBooking={() => setIsBookingOpen(true)}
          onNavigate={(page) => {
            if (page === 'admin') handleAdminAccess();
            else setCurrentView(page as any);
          }}
        />
        <AboutPage onBook={() => setIsBookingOpen(true)} />
        <Footer />
        {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} onSuccess={() => { setIsBookingOpen(false); setCurrentView('customer'); }} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray font-sans text-gray-900">
      <Navbar
        session={session}
        onLogout={handleLogout}
        onOpenBooking={() => setIsBookingOpen(true)}
        onNavigate={(page) => {
          if (page === 'admin') handleAdminAccess();
          else setCurrentView(page as any);
        }}
      />

      <main>
        <Hero onStartBooking={() => setIsBookingOpen(true)} />

        <ServicesSection />
        <ImageGallery />
        <ProcessSection onBook={() => setIsBookingOpen(true)} />
        <Footer />
      </main>

      {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} onSuccess={() => { setIsBookingOpen(false); setCurrentView('customer'); }} />}
    </div>
  );
};

export default App;