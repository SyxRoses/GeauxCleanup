import React, { useState, useEffect } from 'react';
import { Navbar } from './components/landing/Navbar';
import { Hero } from './components/landing/Hero';
import { ServicesSection } from './components/landing/ServicesSection';
import { ProcessSection } from './components/landing/ProcessSection';
import { ImageGallery } from './components/landing/ImageGallery';
import { BookingWizard } from './components/booking/BookingWizard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ServicesPage } from './components/landing/ServicesPage';
import { PricingPage } from './components/landing/PricingPage';
import { AboutPage } from './components/landing/AboutPage';
import { Login } from './components/auth/Login';
import { Sparkles } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

const TrustedBy = () => (
  <div className="py-12 bg-white border-b border-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-semibold tracking-wider text-gray-400 uppercase mb-8">Trusted by leading cleaning professionals</p>
      <div className="flex justify-center items-center flex-wrap gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        {/* Simple text logos for demo */}
        <h3 className="text-2xl font-black font-sans tracking-tight">BRIND</h3>
        <h3 className="text-2xl font-serif italic">nexus</h3>
        <h3 className="text-2xl font-black italic tracking-widest">BRIST</h3>
        <h3 className="text-3xl font-cursive">Velum</h3>
        <h3 className="text-2xl font-extrabold lowercase">bide</h3>
        <h3 className="text-2xl font-black tracking-tighter">BLUST</h3>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-16 pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-black">Residential Cleaning</a></li>
            <li><a href="#" className="hover:text-black">Office Cleaning</a></li>
            <li><a href="#" className="hover:text-black">Deep Cleaning</a></li>
            <li><a href="#" className="hover:text-black">Move-in/Move-out</a></li>
            <li><a href="#" className="hover:text-black">Post-Construction</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-black">About Us</a></li>
            <li><a href="#" className="hover:text-black">Careers</a></li>
            <li><a href="#" className="hover:text-black">Service Areas</a></li>
            <li><a href="#" className="hover:text-black">Reviews</a></li>
            <li><a href="#" className="hover:text-black">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>(555) 123-4567</li>
            <li>hello@geauxcleanup.com</li>
            <li>123 Main Street<br />San Francisco, CA 94102</li>
          </ul>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl">GeauxCleanup</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Professional cleaning services for homes and offices. Trusted by thousands of customers.
          </p>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500">f</div>
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500">x</div>
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500">in</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <p>© 2024 GeauxCleanup. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'customer' | 'admin' | 'services' | 'pricing' | 'about' | 'login'>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

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
      <CustomerDashboard
        onLogout={handleLogout}
        onNewBooking={() => setIsBookingOpen(true)}
        onHome={() => setCurrentView('home')}
      />
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
      <div className="min-h-screen bg-white font-sans text-gray-900">
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
        {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} />}
      </div>
    );
  }

  if (currentView === 'pricing') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900">
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
        {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} />}
      </div>
    );
  }

  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900">
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
        {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
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
        <TrustedBy />
        <ServicesSection />
        <ImageGallery />
        <ProcessSection onBook={() => setIsBookingOpen(true)} />
        <Footer />
      </main>

      {isBookingOpen && <BookingWizard onClose={() => setIsBookingOpen(false)} />}
    </div>
  );
};

export default App;