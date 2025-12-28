import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Menu, X, Sparkles, Lock, LogOut, User } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface NavbarProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
  session?: Session | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onNavigate, session, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-soft-xl py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center transition-all duration-300">

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center group" onClick={() => onNavigate('home')}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-colors ${scrolled ? 'bg-brand-navy' : 'bg-white shadow-lg'}`}>
              <Sparkles className={`w-5 h-5 ${scrolled ? 'text-brand-gold' : 'text-brand-navy'}`} />
            </div>
            <span className={`font-serif font-bold text-2xl tracking-tight transition-colors ${scrolled ? 'text-brand-navy' : 'text-brand-navy'}`}>
              GeauxCleanup
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Services', 'Pricing', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item.toLowerCase())}
                className="relative text-sm font-medium text-brand-slate hover:text-brand-navy transition-colors group py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center text-sm font-medium text-brand-slate/60 hover:text-brand-navy transition-colors"
            >
              <Lock size={12} className="mr-1" />
              Admin
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <button
                  onClick={onLogout}
                  className="text-sm font-semibold text-brand-navy hover:text-red-600 transition-colors flex items-center mr-2"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
                <Button onClick={() => onNavigate('customer')} variant="outline" size="sm" className="hidden lg:flex">
                  <User size={16} className="mr-2" />
                  My Account
                </Button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('customer')}
                className="text-sm font-semibold text-brand-navy hover:text-brand-gold transition-colors mr-2"
              >
                Login
              </button>
            )}
            <Button onClick={onOpenBooking} variant="primary" className="px-8 shadow-glow">Book Now</Button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-brand-navy hover:bg-gray-100 rounded-full transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 shadow-soft-xl px-4 py-8 space-y-6 animate-fade-in-up">
          <div className="space-y-4">
            {['Services', 'Pricing', 'About'].map((item) => (
              <button key={item} onClick={() => { setIsOpen(false); onNavigate(item.toLowerCase()); }} className="block text-2xl font-serif font-medium text-brand-navy">
                {item}
              </button>
            ))}
          </div>
          <hr className="border-gray-100" />
          <div className="space-y-4">
            {session ? (
              <>
                <button onClick={() => { setIsOpen(false); onNavigate('customer'); }} className="flex items-center text-lg font-medium text-brand-navy">
                  <User size={20} className="mr-3" /> My Account
                </button>
                <button onClick={() => { setIsOpen(false); onLogout?.(); }} className="flex items-center text-lg font-medium text-red-600">
                  <LogOut size={20} className="mr-3" /> Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => onNavigate('customer')} className="block text-lg font-medium text-brand-navy">Customer Login</button>
            )}
            <button onClick={() => onNavigate('admin')} className="block text-base font-medium text-gray-400">Admin Portal</button>
          </div>
          <Button onClick={onOpenBooking} fullWidth size="lg">Book Now</Button>
        </div>
      )}
    </nav>
  );
};