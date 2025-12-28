import React from 'react';
import { Button } from '../ui/Button';
import { Users, Heart, Shield, Clock, ArrowRight, Star } from 'lucide-react';

interface AboutPageProps {
    onBook: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBook }) => {
    return (
        <div className="pt-20 pb-24 bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="/images/hero-cleaner.png"
                        alt="Our Team"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        More than just a <br /> cleaning company.
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        We are a team of dedicated professionals committed to bringing efficiency, cleanliness, and sparkle back into your workspace.
                    </p>
                </div>
            </div>

            {/* Our Story */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
                                Our Story
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Built on trust, driven by excellence.</h2>
                            <div className="prose prose-lg text-gray-500">
                                <p className="mb-4">
                                    GeauxCleanup started with a simple mission: to provide a cleaning service that treats every business like our own. What began as a small operation has grown into a trusted partner for hundreds of offices and commercial facilities in the area.
                                </p>
                                <p className="mb-4">
                                    We understand that inviting someone into your office requires a great deal of trust. That's why we don't just hire cleaners; we hire people of integrity who take pride in their work. Every member of our team undergoes rigorous background checks and comprehensive training to ensure they meet our high standards.
                                </p>
                                <p>
                                    Today, we are proud to be the highest-rated cleaning service in the region, but our core values remain the same. We aren't satisfied until you are.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="/images/cleaning-crew.jpg"
                                    onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1581578731117-10d52143b1e8?q=80&w=2070&auto=format&fit=crop"}
                                    alt="The GeauxCleanup Team Cleaning a Commercial Building"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Stat Card */}
                            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-50 max-w-xs hidden md:block">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Star className="text-yellow-400 fill-current" size={24} />
                                    <span className="text-3xl font-bold text-gray-900">4.9/5</span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Average customer rating across 20+ reviews.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-gray-500 text-lg">The principles that guide every scrub, wipe, and polish.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
                            <p className="text-gray-500 leading-relaxed">We do what we say we'll do. Honest pricing, reliable scheduling, and transparent communication.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Care</h3>
                            <p className="text-gray-500 leading-relaxed">We treat your office, your equipment, and your employees with the utmost respect and care.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                            <p className="text-gray-500 leading-relaxed">We are locally owned and operated. We support local charities and pay living wages.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Reliability</h3>
                            <p className="text-gray-500 leading-relaxed">We show up on time, every time. You can set your watch by our arrival.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us / Stats */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-black rounded-[3rem] overflow-hidden relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                            <div className="p-12 text-center">
                                <span className="block text-5xl font-bold text-white mb-2">100%</span>
                                <span className="text-gray-400 font-medium">Satisfaction Guarantee</span>
                            </div>
                            <div className="p-12 text-center">
                                <span className="block text-5xl font-bold text-white mb-2">50+</span>
                                <span className="text-gray-400 font-medium">Cleanings Completed</span>
                            </div>
                            <div className="p-12 text-center">
                                <span className="block text-5xl font-bold text-white mb-2">5+</span>
                                <span className="text-gray-400 font-medium">Professional Staff</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to meet the team?</h2>
                <p className="text-gray-500 text-lg mb-10">
                    Book your first cleaning today and see why GeauxCleanup is the preferred choice for local businesses.
                </p>
                <Button onClick={onBook} size="lg" className="rounded-full px-10 h-14 text-base">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
