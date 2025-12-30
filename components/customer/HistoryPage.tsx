import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import {
    ArrowLeft, Calendar, MapPin, Star, Clock, ChevronRight,
    RotateCcw, Receipt, MessageSquare, Sparkles, Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Booking, Review } from '../../types';

interface HistoryPageProps {
    onBack: () => void;
    onRebook: (booking: Booking) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, onRebook }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [reviews, setReviews] = useState<Record<string, Review>>({});
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch completed and cancelled bookings
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select('*, services(*)')
                .eq('customer_id', user.id)
                .in('status', ['completed', 'cancelled'])
                .order('scheduled_at', { ascending: false });

            if (bookingsError) throw bookingsError;
            setBookings(bookingsData || []);

            // Fetch reviews for these bookings
            const { data: reviewsData } = await supabase
                .from('reviews')
                .select('*')
                .eq('customer_id', user.id);

            if (reviewsData) {
                const reviewMap: Record<string, Review> = {};
                reviewsData.forEach(review => {
                    reviewMap[review.booking_id] = review;
                });
                setReviews(reviewMap);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Booking History</h1>
                                <p className="text-sm text-gray-500">{bookings.length} past bookings</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="text-sm border-0 bg-transparent text-gray-600 font-medium focus:ring-0 cursor-pointer"
                            >
                                <option value="all">All Bookings</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading your history...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No History Yet</h3>
                        <p className="text-gray-500 mb-6">Your completed bookings will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <BookingHistoryCard
                                key={booking.id}
                                booking={booking}
                                review={reviews[booking.id]}
                                onRebook={() => onRebook(booking)}
                                onReview={() => {
                                    setSelectedBooking(booking);
                                    setShowReviewModal(true);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedBooking && (
                <ReviewModal
                    booking={selectedBooking}
                    onClose={() => {
                        setShowReviewModal(false);
                        setSelectedBooking(null);
                    }}
                    onSubmit={async (rating, comment) => {
                        try {
                            const { data: { user } } = await supabase.auth.getUser();
                            if (!user) return;

                            const { error } = await supabase
                                .from('reviews')
                                .insert({
                                    booking_id: selectedBooking.id,
                                    customer_id: user.id,
                                    cleaner_id: selectedBooking.cleaner_id,
                                    rating,
                                    comment
                                });

                            if (error) throw error;

                            // Refresh reviews
                            await fetchHistory();
                            setShowReviewModal(false);
                            setSelectedBooking(null);
                        } catch (error) {
                            console.error('Error submitting review:', error);
                        }
                    }}
                />
            )}
        </div>
    );
};

// Booking Card Component
interface BookingHistoryCardProps {
    booking: Booking;
    review?: Review;
    onRebook: () => void;
    onReview: () => void;
}

const BookingHistoryCard: React.FC<BookingHistoryCardProps> = ({
    booking, review, onRebook, onReview
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${booking.status === 'completed'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">
                            {booking.services?.name || 'Cleaning Service'}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <Calendar size={14} />
                            <span>{formatDate(booking.scheduled_at)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <MapPin size={14} />
                            <span className="truncate max-w-xs">{booking.address}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${booking.total_price}</div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${booking.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {booking.status}
                    </span>
                </div>
            </div>

            {/* Review Section */}
            {booking.status === 'completed' && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                    {review ? (
                        <div className="flex items-center space-x-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < review.rating ? 'currentColor' : 'none'}
                                        className={i < review.rating ? '' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                {review.comment ? `"${review.comment}"` : 'Review submitted'}
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={onReview}
                            className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            <Star size={16} />
                            <span>Leave a Review</span>
                        </button>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700">
                    <Receipt size={16} />
                    <span>View Receipt</span>
                </button>
                {booking.status === 'completed' && (
                    <Button
                        onClick={onRebook}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                    >
                        <RotateCcw size={14} />
                        <span>Rebook</span>
                    </Button>
                )}
            </div>
        </div>
    );
};

// Review Modal Component
interface ReviewModalProps {
    booking: Booking;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async () => {
        setSubmitting(true);
        await onSubmit(rating, comment);
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Rate Your Experience</h2>
                <p className="text-gray-500 text-sm mb-6">
                    How was your {booking.services?.name || 'cleaning'} on {new Date(booking.scheduled_at).toLocaleDateString()}?
                </p>

                {/* Star Rating */}
                <div className="flex justify-center space-x-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="p-1 transition-transform hover:scale-110"
                        >
                            <Star
                                size={32}
                                fill={(hoveredRating || rating) >= star ? '#facc15' : 'none'}
                                className={(hoveredRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}
                            />
                        </button>
                    ))}
                </div>

                {/* Comment */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience (optional)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                />

                {/* Actions */}
                <div className="flex space-x-3 mt-6">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </div>

                <p className="text-xs text-center text-gray-400 mt-4">
                    Your review will be kept internal and helps us improve.
                </p>
            </div>
        </div>
    );
};
