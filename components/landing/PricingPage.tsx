import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Check, HelpCircle, Calculator, ArrowRight, Home, Building2 } from 'lucide-react';

interface PricingPageProps {
    onBook: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBook }) => {
    // Estimator State
    const [serviceType, setServiceType] = useState<'residential' | 'commercial'>('residential');
    const [sqFt, setSqFt] = useState(1500);
    const [bedrooms, setBedrooms] = useState(3);
    const [bathrooms, setBathrooms] = useState(2);
    const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'onetime'>('biweekly');
    const [addons, setAddons] = useState({
        fridge: false,
        oven: false,
        windows: false,
        deepClean: false
    });
    const [estimatedPrice, setEstimatedPrice] = useState(0);

    // Calculate Estimate
    useEffect(() => {
        let base = 0;

        if (serviceType === 'residential') {
            // Base calculation: $0.08 per sqft + $20 per bed + $30 per bath
            base = (sqFt * 0.08) + (bedrooms * 20) + (bathrooms * 30);
        } else {
            // Commercial: $0.12 per sqft (simplified)
            base = sqFt * 0.12;
        }

        // Add-ons
        if (addons.fridge) base += 35;
        if (addons.oven) base += 40;
        if (addons.windows) base += 50; // Flat rate for demo
        if (addons.deepClean) base *= 1.5;

        // Frequency Discounts
        if (frequency === 'weekly') base *= 0.80; // 20% off
        if (frequency === 'biweekly') base *= 0.85; // 15% off
        if (frequency === 'monthly') base *= 0.90; // 10% off
        // One-time is full price

        // Minimums
        const minPrice = serviceType === 'residential' ? 120 : 200;
        setEstimatedPrice(Math.max(Math.round(base), minPrice));
    }, [serviceType, sqFt, bedrooms, bathrooms, frequency, addons]);

    return (
        <div className="pt-20 pb-24 bg-white">
            {/* Header */}
            <div className="bg-gray-900 text-white py-20 mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Transparent Pricing</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        No hidden fees. No surprises. Just honest rates for exceptional service.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {/* Card 1: Standard */}
                    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                                Most Popular
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Regular Clean</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-bold text-gray-900">$120</span>
                            <span className="text-gray-500 ml-2">/ visit</span>
                        </div>
                        <p className="text-gray-500 mb-8 flex-1">Perfect for keeping your home consistently fresh and tidy.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Kitchen & Bathrooms
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Dusting & Vacuuming
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Mopping Floors
                            </li>
                        </ul>
                        <Button onClick={onBook} variant="secondary" fullWidth>Book Standard</Button>
                    </div>

                    {/* Card 2: Deep Clean */}
                    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Deep Clean</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-gray-500 text-lg mr-1">from</span>
                            <span className="text-4xl font-bold text-gray-900">$250</span>
                        </div>
                        <p className="text-gray-500 mb-8 flex-1">A thorough top-to-bottom refresh for homes that haven't been cleaned professionally in a while.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Everything in Standard
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Baseboards & Vents
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Inside Appliances
                            </li>
                        </ul>
                        <Button onClick={onBook} variant="primary" fullWidth>Book Deep Clean</Button>
                    </div>

                    {/* Card 3: Move In/Out */}
                    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Move In/Out</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-gray-500 text-lg mr-1">from</span>
                            <span className="text-4xl font-bold text-gray-900">$350</span>
                        </div>
                        <p className="text-gray-500 mb-8 flex-1">Ensure your deposit return or start fresh in your new home.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Inside Cabinets/Drawers
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Spot Clean Walls
                            </li>
                            <li className="flex items-center text-sm text-gray-600">
                                <Check size={16} className="text-green-500 mr-3" /> Heavy Duty Scrubbing
                            </li>
                        </ul>
                        <Button onClick={onBook} variant="secondary" fullWidth>Book Move Clean</Button>
                    </div>
                </div>

                {/* Estimator Section */}
                <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-16" id="estimator">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6">
                            <Calculator className="text-blue-600 w-6 h-6" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get an Instant Estimate</h2>
                        <p className="text-gray-500">Customize your service to see what it might cost.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Controls */}
                        <div className="lg:col-span-7 space-y-8">

                            {/* Service Type Toggle */}
                            <div className="flex p-1 bg-white rounded-xl border border-gray-200">
                                <button
                                    onClick={() => setServiceType('residential')}
                                    className={`flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold transition-all ${serviceType === 'residential' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <Home size={16} className="mr-2" /> Residential
                                </button>
                                <button
                                    onClick={() => setServiceType('commercial')}
                                    className={`flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-bold transition-all ${serviceType === 'commercial' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <Building2 size={16} className="mr-2" /> Commercial
                                </button>
                            </div>

                            {/* Sliders & Inputs */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Square Footage: <span className="text-blue-600">{sqFt.toLocaleString()} sq ft</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="500"
                                        max="10000"
                                        step="100"
                                        value={sqFt}
                                        onChange={(e) => setSqFt(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                </div>

                                {serviceType === 'residential' && (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">Bedrooms</label>
                                            <div className="flex items-center space-x-3">
                                                <button onClick={() => setBedrooms(Math.max(0, bedrooms - 1))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200">-</button>
                                                <span className="font-bold text-xl w-8 text-center">{bedrooms}</span>
                                                <button onClick={() => setBedrooms(bedrooms + 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200">+</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">Bathrooms</label>
                                            <div className="flex items-center space-x-3">
                                                <button onClick={() => setBathrooms(Math.max(0, bathrooms - 1))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200">-</button>
                                                <span className="font-bold text-xl w-8 text-center">{bathrooms}</span>
                                                <button onClick={() => setBathrooms(bathrooms + 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200">+</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">Frequency</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { id: 'weekly', label: 'Weekly', discount: '20% off' },
                                            { id: 'biweekly', label: 'Bi-Weekly', discount: '15% off' },
                                            { id: 'monthly', label: 'Monthly', discount: '10% off' },
                                            { id: 'onetime', label: 'One-Time', discount: null },
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

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">Add-ons</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input type="checkbox" checked={addons.deepClean} onChange={(e) => setAddons({ ...addons, deepClean: e.target.checked })} className="w-5 h-5 text-black rounded focus:ring-black" />
                                            <span className="ml-3 font-medium text-gray-900">Deep Clean Upgrade</span>
                                            <span className="ml-auto text-sm text-gray-500">1.5x</span>
                                        </label>
                                        <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input type="checkbox" checked={addons.fridge} onChange={(e) => setAddons({ ...addons, fridge: e.target.checked })} className="w-5 h-5 text-black rounded focus:ring-black" />
                                            <span className="ml-3 font-medium text-gray-900">Inside Fridge</span>
                                            <span className="ml-auto text-sm text-gray-500">+$35</span>
                                        </label>
                                        <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input type="checkbox" checked={addons.oven} onChange={(e) => setAddons({ ...addons, oven: e.target.checked })} className="w-5 h-5 text-black rounded focus:ring-black" />
                                            <span className="ml-3 font-medium text-gray-900">Inside Oven</span>
                                            <span className="ml-auto text-sm text-gray-500">+$40</span>
                                        </label>
                                        <label className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input type="checkbox" checked={addons.windows} onChange={(e) => setAddons({ ...addons, windows: e.target.checked })} className="w-5 h-5 text-black rounded focus:ring-black" />
                                            <span className="ml-3 font-medium text-gray-900">Interior Windows</span>
                                            <span className="ml-auto text-sm text-gray-500">+$50</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Result Card */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24 bg-black text-white rounded-[2rem] p-8 md:p-10 shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold">Estimated Total</h3>
                                    <HelpCircle size={20} className="text-gray-500" />
                                </div>

                                <div className="mb-8">
                                    <span className="text-6xl font-bold tracking-tight">${estimatedPrice}</span>
                                    <span className="text-xl text-gray-500 ml-2">/ {frequency === 'onetime' ? 'visit' : 'month'}</span>
                                </div>

                                <div className="space-y-4 mb-8 border-t border-gray-800 pt-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Service Type</span>
                                        <span className="font-bold capitalize">{serviceType}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Size</span>
                                        <span className="font-bold">{sqFt.toLocaleString()} sq ft</span>
                                    </div>
                                    {serviceType === 'residential' && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Layout</span>
                                            <span className="font-bold">{bedrooms} Bed, {bathrooms} Bath</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Frequency</span>
                                        <span className="font-bold capitalize">{frequency}</span>
                                    </div>
                                </div>

                                <Button onClick={onBook} fullWidth size="lg" className="bg-white text-black hover:bg-gray-200 border-none h-14 text-lg">
                                    Book this Estimate <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <p className="text-xs text-gray-500 text-center mt-4">
                                    *Final price may vary based on on-site inspection.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
