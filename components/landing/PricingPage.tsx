import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Check, HelpCircle, Calculator, ArrowRight, Home, Building2, Sparkles } from 'lucide-react';

interface PricingPageProps {
    onBook: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBook }) => {
    // Estimator State
    const [serviceType] = useState<'commercial'>('commercial');
    const [sqFt, setSqFt] = useState(2500);
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
    const [addons, setAddons] = useState({
        fridge: false,
        windows: false,
        carpet: false,
        supplies: false
    });
    const [estimatedPrice, setEstimatedPrice] = useState(0);

    // Calculate Estimate
    useEffect(() => {
        let base = 0;

        if (serviceType === 'commercial') {
            // Commercial: $0.10 per sqft basis
            base = sqFt * 0.10;
        }

        // Add-ons
        if (addons.fridge) base += 50; // Breakroom fridge
        if (addons.windows) base += (sqFt * 0.02); // Window surcharge
        if (addons.carpet) base += (sqFt * 0.03); // Carpet care
        if (addons.supplies) base += 100; // Restocking fee

        // Frequency Discounts
        if (frequency === 'daily') base *= 0.70; // 30% off for daily
        if (frequency === 'weekly') base *= 0.85; // 15% off
        if (frequency === 'biweekly') base *= 0.90; // 10% off
        if (frequency === 'monthly') base *= 0.95; // 5% off

        // Minimums
        const minPrice = 200;
        setEstimatedPrice(Math.max(Math.round(base), minPrice));
    }, [serviceType, sqFt, frequency, addons]);

    return (
        <div className="pt-20 pb-24 bg-brand-gray">
            {/* Header */}
            <div className="bg-brand-navy text-white py-24 mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-3 block">Simple & Clear</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Transparent Pricing</h1>
                    <p className="text-xl text-brand-slate/40 max-w-2xl mx-auto font-light">
                        No hidden fees. No surprises. Just honest rates for exceptional service.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {/* Card 1: Office Maintenance */}
                    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                                Most Popular
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Office Basic</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-bold text-gray-900">$200</span>
                            <span className="text-gray-500 ml-2">/ visit</span>
                        </div>
                        <p className="text-gray-500 mb-8 flex-1">Essential cleaning for small to medium offices. Keeps your workspace professional.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Trash Removal & Relining
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Vacuuming & Mopping
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Restroom Sanitation
                            </li>
                        </ul>
                        <Button onClick={onBook} variant="secondary" fullWidth>Book Basic</Button>
                    </div>

                    {/* Card 2: Corporate Suite */}
                    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Corporate Suite</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-gray-500 text-lg mr-1">from</span>
                            <span className="text-4xl font-bold text-gray-900">$450</span>
                        </div>
                        <p className="text-gray-500 mb-8 flex-1">Comprehensive care for larger offices or high-traffic commercial spaces.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Includes Office Basic
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Breakroom Deep Clean
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Interior Window Sills
                            </li>
                        </ul>
                        <Button onClick={onBook} variant="primary" fullWidth>Book Corporate</Button>
                    </div>

                    {/* Card 3: Enterprise / Custom */}
                    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Enterprise</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-bold text-gray-900">Custom</span>
                        </div>
                        <p className="text-gray-500 mb-8 flex-1">Tailored solutions for multi-floor buildings or specialized facilities.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Day Porter Services
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Floor Strip & Waxing
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Consolidated Billing
                            </li>
                        </ul>
                        <Button onClick={onBook} variant="secondary" fullWidth>Contact Sales</Button>
                    </div>
                </div>

                {/* Estimator Section */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-soft-xl border border-gray-100 relative overflow-hidden" id="estimator">
                    <div className="text-center mb-16 relative z-10">
                        <div className="inline-flex items-center justify-center p-4 bg-brand-navy/5 rounded-2xl mb-6">
                            <Calculator className="text-brand-navy w-8 h-8" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-navy mb-4">Get an Instant Estimate</h2>
                        <p className="text-brand-slate">Customize your service to see what it might cost.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">

                        {/* Controls */}
                        <div className="lg:col-span-7 space-y-10">

                            {/* Service Type Indicator */}
                            <div className="flex p-4 bg-blue-50 rounded-xl border border-blue-100 items-start">
                                <Building2 className="text-blue-600 mt-1 mr-3" size={20} />
                                <div>
                                    <h4 className="font-bold text-blue-900">Commercial Quote</h4>
                                    <p className="text-sm text-blue-700">Estimate based on standard office cleaning rates.</p>
                                </div>
                            </div>

                            {/* Sliders & Inputs */}
                            <div className="space-y-10">
                                <div>
                                    <label className="flex justify-between text-sm font-bold text-brand-navy mb-4">
                                        <span>Square Footage</span>
                                        <span className="text-brand-gold bg-brand-navy px-3 py-1 rounded-full text-xs">{sqFt.toLocaleString()} sq ft</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="500"
                                        max="50000"
                                        step="500"
                                        value={sqFt}
                                        onChange={(e) => setSqFt(parseInt(e.target.value))}
                                        className="w-full h-3 bg-brand-gray rounded-full appearance-none cursor-pointer accent-brand-navy"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-brand-navy mb-4">Frequency</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { id: 'daily', label: 'Daily', discount: '30% off' },
                                            { id: 'weekly', label: 'Weekly', discount: '15% off' },
                                            { id: 'biweekly', label: 'Bi-Weekly', discount: '10% off' },
                                            { id: 'monthly', label: 'Monthly', discount: '5% off' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setFrequency(opt.id as any)}
                                                className={`py-3 px-2 rounded-xl text-sm border transition-all flex flex-col items-center justify-center ${frequency === opt.id ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                            >
                                                <span className="font-bold">{opt.label}</span>
                                                {opt.discount && <span className={`text-[10px] mt-1 ${frequency === opt.id ? 'text-gray-300' : 'text-green-600'}`}>{opt.discount}</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-brand-navy mb-4">Add-ons</label>
                                <div className="space-y-3">
                                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="checkbox" checked={addons.fridge} onChange={(e) => setAddons({ ...addons, fridge: e.target.checked })} className="w-5 h-5 text-black rounded focus:ring-black" />
                                        <span className="ml-3 font-medium text-gray-900">Breakroom Fridge</span>
                                        <span className="ml-auto text-sm text-gray-500">+$50</span>
                                    </label>
                                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="checkbox" checked={addons.windows} onChange={(e) => setAddons({ ...addons, windows: e.target.checked })} className="w-5 h-5 text-black rounded focus:ring-black" />
                                        <span className="ml-3 font-medium text-gray-900">Window Sills</span>
                                        <span className="ml-auto text-sm text-gray-500">Var</span>
                                    </label>
                                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="checkbox" checked={addons.carpet} onChange={(e) => setAddons({ ...addons, carpet: e.target.checked })} className="w-5 h-5 text-black rounded focus:ring-black" />
                                        <span className="ml-3 font-medium text-gray-900">Spot Clean Carpet</span>
                                        <span className="ml-auto text-sm text-gray-500">Var</span>
                                    </label>
                                    <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="checkbox" checked={addons.supplies} onChange={(e) => setAddons({ ...addons, supplies: e.target.checked })} className="w-5 h-5 text-black rounded focus:ring-black" />
                                        <span className="ml-3 font-medium text-gray-900">Restock Supplies</span>
                                        <span className="ml-auto text-sm text-gray-500">+$100</span>
                                    </label>
                                </div>
                            </div>

                        </div>

                        {/* Result Card */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24 bg-brand-navy text-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-bold font-serif">Estimated Total</h3>
                                        <HelpCircle size={20} className="text-brand-slate" />
                                    </div>

                                    <div className="mb-10">
                                        <span className="text-7xl font-serif font-bold tracking-tight text-white">${estimatedPrice}</span>
                                        <span className="text-xl text-brand-slate ml-2">/ {frequency === 'onetime' ? 'visit' : 'month'}</span>
                                    </div>

                                    <div className="space-y-6 mb-10 border-t border-white/10 pt-10">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-brand-slate">Service Type</span>
                                            <span className="font-bold capitalize text-white">{serviceType}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-brand-slate">Size</span>
                                            <span className="font-bold text-white">{sqFt.toLocaleString()} sq ft</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-brand-slate">Frequency</span>
                                            <span className="font-bold capitalize text-white">{frequency}</span>
                                        </div>
                                    </div>

                                    <Button onClick={onBook} fullWidth size="lg" className="bg-white text-black hover:bg-gray-100 hover:text-black border-none h-16 text-lg font-bold shadow-lg">
                                        Book this Estimate <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    <p className="text-xs text-brand-slate text-center mt-6 opacity-60">
                                        *Final price may vary based on on-site inspection.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
