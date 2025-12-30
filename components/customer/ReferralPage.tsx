import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import {
    ArrowLeft, Gift, Copy, Share2, Check, Users,
    DollarSign, ChevronRight, Sparkles, Mail, MessageCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Referral } from '../../types';

interface ReferralPageProps {
    onBack: () => void;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({ onBack }) => {
    const [referralCode, setReferralCode] = useState('');
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [totalEarned, setTotalEarned] = useState(0);

    useEffect(() => {
        fetchReferralData();
    }, []);

    const generateReferralCode = (userId: string) => {
        // Generate a friendly referral code from user ID
        const prefix = 'GEAUX';
        const suffix = userId.substring(0, 6).toUpperCase();
        return `${prefix}${suffix}`;
    };

    const fetchReferralData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if user has a referral code
            const { data: existingReferral } = await supabase
                .from('referrals')
                .select('referral_code')
                .eq('referrer_id', user.id)
                .limit(1)
                .single();

            if (existingReferral) {
                setReferralCode(existingReferral.referral_code);
            } else {
                // Generate and save new referral code
                const newCode = generateReferralCode(user.id);
                setReferralCode(newCode);

                // Create initial referral record
                await supabase
                    .from('referrals')
                    .insert({
                        referrer_id: user.id,
                        referral_code: newCode,
                        status: 'pending'
                    });
            }

            // Fetch all referrals
            const { data: referralsData } = await supabase
                .from('referrals')
                .select('*')
                .eq('referrer_id', user.id)
                .neq('referred_email', null)
                .order('created_at', { ascending: false });

            setReferrals(referralsData || []);

            // Calculate total earned
            const earned = (referralsData || [])
                .filter(r => r.status === 'reward_given')
                .reduce((sum, r) => sum + (r.reward_amount || 25), 0);
            setTotalEarned(earned);

        } catch (error) {
            console.error('Error fetching referral data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            const referralLink = `https://geauxcleanup.com/?ref=${referralCode}`;
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const shareVia = (method: 'email' | 'sms' | 'twitter') => {
        const referralLink = `https://geauxcleanup.com/?ref=${referralCode}`;
        const message = `Get $25 off your first cleaning with GeauxCleanup! Use my referral link: ${referralLink}`;

        switch (method) {
            case 'email':
                window.open(`mailto:?subject=Get $25 off GeauxCleanup!&body=${encodeURIComponent(message)}`);
                break;
            case 'sms':
                window.open(`sms:?body=${encodeURIComponent(message)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`);
                break;
        }
    };

    const statusColors = {
        pending: 'bg-gray-100 text-gray-600',
        signed_up: 'bg-blue-100 text-blue-700',
        first_booking: 'bg-yellow-100 text-yellow-700',
        reward_given: 'bg-green-100 text-green-700'
    };

    const statusLabels = {
        pending: 'Invited',
        signed_up: 'Signed Up',
        first_booking: 'Booked',
        reward_given: 'Earned!'
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
                            <h1 className="text-xl font-bold text-gray-900">Referral Program</h1>
                            <p className="text-sm text-gray-500">Invite friends, earn rewards</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-20">
                        <Gift size={200} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-4">
                            <Sparkles size={24} />
                            <span className="font-bold text-lg">Give $25, Get $25</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">
                            Share the clean with friends
                        </h2>
                        <p className="text-purple-100 max-w-md">
                            When your friend books their first cleaning, you both get $25 in credits.
                            There's no limit to how much you can earn!
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                        <div className="text-3xl font-bold text-gray-900">{referrals.length}</div>
                        <p className="text-sm text-gray-500">Friends Invited</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {referrals.filter(r => r.status === 'reward_given').length}
                        </div>
                        <p className="text-sm text-gray-500">Rewards Earned</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600">${totalEarned}</div>
                        <p className="text-sm text-gray-500">Total Earned</p>
                    </div>
                </div>

                {/* Share Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                    <h3 className="font-bold text-gray-900 mb-4">Your Referral Code</h3>

                    {/* Code Display */}
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Share this code</p>
                            <p className="text-2xl font-bold font-mono tracking-wider text-gray-900">
                                {loading ? '...' : referralCode}
                            </p>
                        </div>
                        <Button onClick={copyToClipboard} variant="outline">
                            {copied ? (
                                <>
                                    <Check size={16} className="mr-2 text-green-600" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={16} className="mr-2" />
                                    Copy Link
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Share Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => shareVia('email')}
                            className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            <Mail size={18} />
                            <span className="font-medium text-sm">Email</span>
                        </button>
                        <button
                            onClick={() => shareVia('sms')}
                            className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            <MessageCircle size={18} />
                            <span className="font-medium text-sm">Text</span>
                        </button>
                        <button
                            onClick={() => shareVia('twitter')}
                            className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            <Share2 size={18} />
                            <span className="font-medium text-sm">Share</span>
                        </button>
                    </div>
                </div>

                {/* How It Works */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                    <h3 className="font-bold text-gray-900 mb-6">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                                1
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Share Your Link</h4>
                            <p className="text-sm text-gray-500">
                                Send your unique referral link to friends and family
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                                2
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Friend Books</h4>
                            <p className="text-sm text-gray-500">
                                They sign up and book their first cleaning
                            </p>
                        </div>
                        <div className or="text-center">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                                3
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">You Both Earn</h4>
                            <p className="text-sm text-gray-500">
                                You each get $25 in credits to use on bookings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Referral History */}
                {referrals.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Your Referrals</h3>
                        <div className="space-y-3">
                            {referrals.map((referral) => (
                                <div
                                    key={referral.id}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Users size={18} className="text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {referral.referred_email || 'Pending invite'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(referral.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {referral.status === 'reward_given' && (
                                            <span className="text-green-600 font-bold">+$25</span>
                                        )}
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[referral.status]}`}>
                                            {statusLabels[referral.status]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
