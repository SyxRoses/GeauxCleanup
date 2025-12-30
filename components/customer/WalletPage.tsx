import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import {
    ArrowLeft, CreditCard, Plus, Trash2, Check, Gift,
    DollarSign, Clock, ChevronRight, Sparkles, Copy, Share2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PaymentMethod, UserCredit, PromoCode } from '../../types';

interface WalletPageProps {
    onBack: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ onBack }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [credits, setCredits] = useState<UserCredit[]>([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'payment' | 'credits' | 'promo'>('payment');
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch payment methods
            const { data: paymentData } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false });

            setPaymentMethods(paymentData || []);

            // Fetch credits
            const { data: creditsData } = await supabase
                .from('user_credits')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setCredits(creditsData || []);

            // Calculate total valid credits
            const total = (creditsData || [])
                .filter(c => !c.expires_at || new Date(c.expires_at) > new Date())
                .reduce((sum, c) => sum + c.amount, 0);
            setTotalCredits(total);

        } catch (error) {
            console.error('Error fetching wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        setPromoError('');
        setPromoSuccess('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if promo code exists and is valid
            const { data: promo, error } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', promoCode.toUpperCase())
                .eq('is_active', true)
                .single();

            if (error || !promo) {
                setPromoError('Invalid promo code');
                return;
            }

            // Check expiration
            if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
                setPromoError('This promo code has expired');
                return;
            }

            // Check max uses
            if (promo.max_uses && promo.current_uses >= promo.max_uses) {
                setPromoError('This promo code has reached its limit');
                return;
            }

            // Add credit to user
            const creditAmount = promo.discount_type === 'percentage'
                ? promo.discount_value // For percentage, we'll apply at booking
                : promo.discount_value;

            await supabase
                .from('user_credits')
                .insert({
                    user_id: user.id,
                    amount: creditAmount,
                    source: 'promo',
                    description: `Promo code: ${promoCode.toUpperCase()}`
                });

            // Increment promo usage
            await supabase
                .from('promo_codes')
                .update({ current_uses: promo.current_uses + 1 })
                .eq('id', promo.id);

            setPromoSuccess(`$${creditAmount} credit added to your account!`);
            setPromoCode('');
            await fetchWalletData();

        } catch (error) {
            console.error('Error applying promo:', error);
            setPromoError('Something went wrong. Please try again.');
        }
    };

    const getCardIcon = (brand: string) => {
        const brandColors: Record<string, string> = {
            visa: 'text-blue-600',
            mastercard: 'text-orange-600',
            amex: 'text-blue-800',
            discover: 'text-orange-500'
        };
        return brandColors[brand.toLowerCase()] || 'text-gray-600';
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
                            <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
                            <p className="text-sm text-gray-500">Payment & Credits</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Credits Summary Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10">
                        <Sparkles size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm mb-1">Available Credits</p>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-bold">${totalCredits.toFixed(2)}</span>
                            {totalCredits > 0 && (
                                <span className="text-green-400 text-sm">Ready to use</span>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm mt-4">
                            Credits are automatically applied at checkout
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payment'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <CreditCard size={16} className="inline mr-2" />
                        Payment Methods
                    </button>
                    <button
                        onClick={() => setActiveTab('credits')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'credits'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <DollarSign size={16} className="inline mr-2" />
                        Credit History
                    </button>
                    <button
                        onClick={() => setActiveTab('promo')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === 'promo'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Gift size={16} className="inline mr-2" />
                        Promo Code
                    </button>
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Payment Methods Tab */}
                        {activeTab === 'payment' && (
                            <div className="space-y-4">
                                {paymentMethods.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CreditCard size={32} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Payment Methods</h3>
                                        <p className="text-gray-500 mb-6">Add a card to make booking easier.</p>

                                        {/* Stripe placeholder notice */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                            <p className="text-blue-700 text-sm">
                                                <strong>Coming Soon:</strong> Stripe payment integration will be enabled here.
                                                For now, pay at checkout.
                                            </p>
                                        </div>

                                        <Button disabled>
                                            <Plus size={16} className="mr-2" />
                                            Add Payment Method
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-xl bg-gray-50 ${getCardIcon(method.card_brand)}`}>
                                                        <CreditCard size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-bold text-gray-900 capitalize">
                                                                {method.card_brand}
                                                            </span>
                                                            <span className="text-gray-500">•••• {method.card_last4}</span>
                                                            {method.is_default && (
                                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            Expires {method.card_exp_month}/{method.card_exp_year}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        <Button variant="outline" className="w-full" disabled>
                                            <Plus size={16} className="mr-2" />
                                            Add Another Card
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Credits History Tab */}
                        {activeTab === 'credits' && (
                            <div className="space-y-4">
                                {credits.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <DollarSign size={32} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Credits Yet</h3>
                                        <p className="text-gray-500">
                                            Earn credits through referrals or promo codes!
                                        </p>
                                    </div>
                                ) : (
                                    credits.map((credit) => (
                                        <div
                                            key={credit.id}
                                            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-3 rounded-xl ${credit.source === 'referral'
                                                        ? 'bg-purple-50 text-purple-600'
                                                        : credit.source === 'promo'
                                                            ? 'bg-green-50 text-green-600'
                                                            : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {credit.source === 'referral' ? <Share2 size={20} /> : <Gift size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 capitalize">
                                                        {credit.source.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {credit.description || `Credit from ${credit.source}`}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(credit.created_at).toLocaleDateString()}
                                                        {credit.expires_at && (
                                                            <> • Expires {new Date(credit.expires_at).toLocaleDateString()}</>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xl font-bold text-green-600">
                                                +${credit.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Promo Code Tab */}
                        {activeTab === 'promo' && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-2">Have a Promo Code?</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Enter your promo code below to add credits to your account.
                                </p>

                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => {
                                            setPromoCode(e.target.value.toUpperCase());
                                            setPromoError('');
                                            setPromoSuccess('');
                                        }}
                                        placeholder="Enter code"
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl uppercase tracking-wider font-mono focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                    <Button onClick={handleApplyPromo} disabled={!promoCode.trim()}>
                                        Apply
                                    </Button>
                                </div>

                                {promoError && (
                                    <p className="mt-3 text-red-600 text-sm">{promoError}</p>
                                )}
                                {promoSuccess && (
                                    <p className="mt-3 text-green-600 text-sm flex items-center">
                                        <Check size={16} className="mr-1" />
                                        {promoSuccess}
                                    </p>
                                )}

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h4 className="font-medium text-gray-900 mb-3">How it works</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start space-x-2">
                                            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Credits are automatically applied at checkout</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Some promo codes may have expiration dates</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Credits cannot be exchanged for cash</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
