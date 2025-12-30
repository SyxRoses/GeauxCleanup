import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Clock, MapPin, Calendar, Star, ChevronRight, Home, CreditCard, MessageSquare, Plus, Sparkles, AlertCircle, Gift } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { Booking } from '../../types';
import { supabase } from '../../lib/supabase';

interface CustomerDashboardProps {
  onLogout: () => void;
  onNewBooking: () => void;
  onHome: () => void;
  onNavigate: (page: 'history' | 'support' | 'wallet' | 'referral') => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onLogout, onNewBooking, onHome, onNavigate }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Customer');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(' ')[0]);
      }

      const data = await supabaseService.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeBooking = bookings.find(b => ['in_progress', 'en_route'].includes(b.status)) || bookings.find(b => b.status === 'confirmed');
  const upcomingBookings = bookings.filter(b => b.id !== activeBooking?.id && ['pending', 'confirmed'].includes(b.status));

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onHome}>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">GeauxCleanup</span>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={onHome} className="text-sm font-medium text-gray-500 hover:text-black">Home</button>
          <button onClick={() => onNavigate('history')} className="text-sm font-medium text-gray-500 hover:text-black">My Bookings</button>
          <button onClick={() => onNavigate('wallet')} className="text-sm font-medium text-gray-500 hover:text-black">Wallet</button>
          <button onClick={() => onNavigate('support')} className="text-sm font-medium text-gray-500 hover:text-black">Support</button>
          <button onClick={() => onNavigate('referral')} className="text-sm font-medium text-purple-600 hover:text-purple-800 font-bold">Refer & Earn</button>
          <button onClick={onLogout} className="text-sm font-medium text-red-500 hover:text-red-700">Sign Out</button>
          <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden cursor-pointer" onClick={onLogout}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Good morning, {userName}</h1>
            <p className="text-gray-500 mt-1">Welcome back to your dashboard.</p>
          </div>
          <Button onClick={onNewBooking}>
            <Plus size={18} className="mr-2" />
            New Booking
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column (Active Status) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Active Booking Card */}
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Loading your bookings...</div>
            ) : activeBooking ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Home size={120} />
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${activeBooking.status === 'in_progress' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {activeBooking.status.replace('_', ' ')}
                      </span>
                      <span className="text-gray-400 text-sm">• {formatTime(activeBooking.scheduled_at)}</span>
                    </div>
                    <h2 className="text-2xl font-bold">{activeBooking.services?.name || 'Cleaning Service'}</h2>
                    <p className="text-gray-500">{activeBooking.address}</p>
                  </div>
                  <div className="text-right">
                    {activeBooking.status === 'pending' ? (
                      <div className="text-xl font-bold text-gray-500">Pending Quote</div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold">${activeBooking.total_price}</div>
                        <div className="text-sm text-gray-400">total</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Visual (Mock for now as we don't have real-time progress) */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>Service Status</span>
                    <span>{activeBooking.status === 'in_progress' ? '50%' : '0%'}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`bg-black h-full rounded-full relative transition-all duration-1000 ${activeBooking.status === 'in_progress' ? 'w-1/2' : 'w-2'
                      }`}>
                      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white/20 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Cleaner Info */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Cleaner" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{activeBooking.cleaner_id ? 'Assigned Cleaner' : 'Pending Assignment'}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Star size={12} className="text-yellow-400 fill-current mr-1" />
                        4.9 • Verified Pro
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                      <MessageSquare size={20} />
                    </button>
                    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                      <MapPin size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Bookings</h3>
                <p className="text-gray-500 mb-6">You don't have any cleanings scheduled right now.</p>
                <Button onClick={onNewBooking}>Book a Clean</Button>
              </div>
            )}

            {/* Upcoming Bookings */}
            <div>
              <h3 className="text-lg font-bold mb-4">Upcoming</h3>
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                {upcomingBookings.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">No upcoming bookings.</div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-3 rounded-lg text-gray-600">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.services?.name || 'Cleaning'}</p>
                          <p className="text-sm text-gray-500">{formatTime(booking.scheduled_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                          {booking.status}
                        </span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all text-center flex flex-col items-center justify-center space-y-2 group" onClick={onNewBooking}>
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-black group-hover:text-white transition-colors">
                    <Home size={20} />
                  </div>
                  <span className="text-sm font-medium">Book Clean</span>
                </button>
                <button className="p-4 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all text-center flex flex-col items-center justify-center space-y-2 group" onClick={() => onNavigate('support')}>
                  <div className="bg-purple-50 p-2 rounded-lg text-purple-600 group-hover:bg-black group-hover:text-white transition-colors">
                    <MessageSquare size={20} />
                  </div>
                  <span className="text-sm font-medium">Support</span>
                </button>
                <button className="p-4 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all text-center flex flex-col items-center justify-center space-y-2 group" onClick={() => onNavigate('history')}>
                  <div className="bg-orange-50 p-2 rounded-lg text-orange-600 group-hover:bg-black group-hover:text-white transition-colors">
                    <Clock size={20} />
                  </div>
                  <span className="text-sm font-medium">History</span>
                </button>
                <button className="p-4 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all text-center flex flex-col items-center justify-center space-y-2 group" onClick={() => onNavigate('wallet')}>
                  <div className="bg-green-50 p-2 rounded-lg text-green-600 group-hover:bg-black group-hover:text-white transition-colors">
                    <CreditCard size={20} />
                  </div>
                  <span className="text-sm font-medium">Wallet</span>
                </button>
              </div>

              {/* Referral Banner */}
              <button
                onClick={() => onNavigate('referral')}
                className="mt-4 w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white text-left hover:from-purple-700 hover:to-purple-900 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Gift size={24} />
                    <div>
                      <p className="font-bold">Refer & Earn $25</p>
                      <p className="text-sm text-purple-200">Share with friends</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="bg-black text-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold mb-6">Your Impact</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-blue-400">187</div>
                  <div className="text-sm text-gray-400">Hours saved this year</div>
                </div>
                <div className="h-px bg-gray-800"></div>
                <div>
                  <div className="text-3xl font-bold text-green-400">15</div>
                  <div className="text-sm text-gray-400">Trees planted via eco-clean</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};