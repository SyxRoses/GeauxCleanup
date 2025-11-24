import React from 'react';
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
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-2">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">GeauxCleanup</span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <button onClick={() => onNavigate('services')} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Services</button>
            <button onClick={() => onNavigate('pricing')} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Pricing</button>
            <button onClick={() => onNavigate('about')} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">About</button>
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center text-sm font-medium text-gray-400 hover:text-black transition-colors"
            >
              <Lock size={12} className="mr-1" />
              Admin
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                <button
                  onClick={onLogout}
                  className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-red-600 transition-colors flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
                <Button onClick={() => onNavigate('customer')} variant="outline" className="rounded-full px-6 flex items-center">
                  <User size={16} className="mr-2" />
                  My Account
                </Button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('customer')}
                className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-600 transition-colors"
              >
                Customer Login
              </button>
            )}
            <Button onClick={onOpenBooking} variant="primary" className="rounded-full px-6">Book now</Button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 shadow-lg px-4 py-6 space-y-4">
          <button onClick={() => { setIsOpen(false); onNavigate('services'); }} className="block text-lg font-medium text-gray-900">Services</button>
          <button onClick={() => { setIsOpen(false); onNavigate('pricing'); }} className="block text-lg font-medium text-gray-900">Pricing</button>
          {session ? (
            <>
              <button onClick={() => { setIsOpen(false); onNavigate('customer'); }} className="block text-lg font-medium text-gray-900">My Account</button>
              <button onClick={() => { setIsOpen(false); onLogout?.(); }} className="block text-lg font-medium text-red-600">Sign Out</button>
            </>
          ) : (
            <button onClick={() => onNavigate('customer')} className="block text-lg font-medium text-gray-900">Customer Login</button>
          )}
          <button onClick={() => onNavigate('admin')} className="block text-lg font-medium text-gray-500">Admin Portal</button>
          <Button onClick={onOpenBooking} fullWidth className="mt-4">Book now</Button>
        </div>
      )}
    </nav>
  );
};