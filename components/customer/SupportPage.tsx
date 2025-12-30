import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import {
    ArrowLeft, MessageSquare, Phone, Mail, ChevronDown, ChevronUp,
    Clock, CheckCircle, AlertCircle, Send, HelpCircle, Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SupportTicket } from '../../types';

interface SupportPageProps {
    onBack: () => void;
}

// FAQ Data
const faqs = [
    {
        question: "How do I reschedule a booking?",
        answer: "You can reschedule a booking up to 24 hours before your scheduled time. Go to 'My Bookings', find the booking you want to change, and click 'Reschedule'. Select a new date and time that works for you."
    },
    {
        question: "What is your cancellation policy?",
        answer: "We offer free cancellation up to 24 hours before your scheduled cleaning. Cancellations within 24 hours may be subject to a cancellation fee of 50% of the booking total."
    },
    {
        question: "What cleaning supplies do I need to provide?",
        answer: "Our cleaners bring all necessary supplies and equipment! This includes eco-friendly cleaning products, microfiber cloths, vacuums, mops, and more. If you have specific products you'd like us to use, just leave a note in your booking."
    },
    {
        question: "How do I add a tip for my cleaner?",
        answer: "You can add a tip after your cleaning is complete. Go to your booking history, find the completed booking, and click 'Add Tip'. Tips go directly to your cleaner."
    },
    {
        question: "What if I'm not satisfied with the cleaning?",
        answer: "Your satisfaction is our priority! If you're not happy with any aspect of your cleaning, contact us within 24 hours and we'll send a cleaner back to make it right at no extra charge."
    },
    {
        question: "Are your cleaners insured and background checked?",
        answer: "Yes! All GeauxCleanup professionals are fully insured, bonded, and have passed comprehensive background checks. Your home and belongings are in safe hands."
    },
    {
        question: "How do referral credits work?",
        answer: "Share your referral code with friends. When they complete their first booking, you both get $25 in credits! Credits are automatically applied to your next booking."
    }
];

export const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'help' | 'tickets'>('help');
    const [showContactForm, setShowContactForm] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('support_tickets')
                .select('*')
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTickets(data || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
                            <p className="text-sm text-gray-500">We're here to help</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Quick Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <a
                        href="tel:+15551234567"
                        className="bg-white rounded-xl p-6 border border-gray-100 hover:border-black hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-50 p-3 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Call Us</h3>
                                <p className="text-sm text-gray-500">(555) 123-4567</p>
                            </div>
                        </div>
                    </a>

                    <a
                        href="mailto:support@geauxcleanup.com"
                        className="bg-white rounded-xl p-6 border border-gray-100 hover:border-black hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Email Us</h3>
                                <p className="text-sm text-gray-500">Quick response</p>
                            </div>
                        </div>
                    </a>

                    <button
                        onClick={() => setShowContactForm(true)}
                        className="bg-white rounded-xl p-6 border border-gray-100 hover:border-black hover:shadow-lg transition-all group text-left"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-50 p-3 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Send Message</h3>
                                <p className="text-sm text-gray-500">Create a ticket</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveTab('help')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'help'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <HelpCircle size={16} className="inline mr-2" />
                        FAQs
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tickets'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MessageSquare size={16} className="inline mr-2" />
                        My Tickets {tickets.length > 0 && `(${tickets.length})`}
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'help' ? (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {faqs.map((faq, index) => (
                                <div key={index} className="group">
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                                        {expandedFaq === index ? (
                                            <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading tickets...</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Support Tickets</h3>
                                <p className="text-gray-500 mb-6">You haven't contacted support yet.</p>
                                <Button onClick={() => setShowContactForm(true)}>
                                    Create a Ticket
                                </Button>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Contact Form Modal */}
            {showContactForm && (
                <ContactFormModal
                    onClose={() => setShowContactForm(false)}
                    onSubmit={async (subject, message) => {
                        try {
                            const { data: { user } } = await supabase.auth.getUser();
                            if (!user) return;

                            const { error } = await supabase
                                .from('support_tickets')
                                .insert({
                                    customer_id: user.id,
                                    subject,
                                    message,
                                    status: 'open',
                                    priority: 'normal'
                                });

                            if (error) throw error;
                            await fetchTickets();
                            setShowContactForm(false);
                            setActiveTab('tickets');
                        } catch (error) {
                            console.error('Error creating ticket:', error);
                        }
                    }}
                />
            )}
        </div>
    );
};

// Ticket Card Component
const TicketCard: React.FC<{ ticket: SupportTicket }> = ({ ticket }) => {
    const statusColors = {
        open: 'bg-yellow-100 text-yellow-700',
        in_progress: 'bg-blue-100 text-blue-700',
        resolved: 'bg-green-100 text-green-700',
        closed: 'bg-gray-100 text-gray-700'
    };

    const statusIcons = {
        open: <Clock size={14} />,
        in_progress: <AlertCircle size={14} />,
        resolved: <CheckCircle size={14} />,
        closed: <CheckCircle size={14} />
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${statusColors[ticket.status]}`}>
                    {statusIcons[ticket.status]}
                    <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">{ticket.message}</p>
        </div>
    );
};

// Contact Form Modal
interface ContactFormModalProps {
    onClose: () => void;
    onSubmit: (subject: string, message: string) => Promise<void>;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ onClose, onSubmit }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        setSubmitting(true);
        await onSubmit(subject, message);
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Support</h2>
                <p className="text-gray-500 text-sm mb-6">
                    We typically respond within 2-4 hours during business hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="What can we help with?"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe your issue or question..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={submitting || !subject.trim() || !message.trim()}
                        >
                            {submitting ? (
                                'Sending...'
                            ) : (
                                <>
                                    <Send size={16} className="mr-2" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
