import React from 'react';
import { Button } from '../ui/Button';
import { Check, Home, Building2, Sparkles, ArrowRight } from 'lucide-react';

interface ServicesPageProps {
    onBook: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onBook }) => {
    return (
        <div className="pt-20 pb-24 bg-white">
            {/* Header */}
            <div className="bg-gray-50 py-16 mb-16 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Commercial Services</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Professional cleaning solutions for modern businesses. We handle the details so you can focus on your work.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">



                {/* Commercial Services */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
                    <div className="order-last lg:order-first relative h-[500px] rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                            alt="Commercial Cleaning"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <Building2 size={12} className="mr-2" />
                            Commercial
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Business & Office</h2>
                        <p className="text-gray-500 text-lg mb-8">
                            A clean workspace boosts productivity and leaves a lasting impression on clients.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Check size={14} className="text-purple-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-gray-900">Office Cleaning</h3>
                                    <p className="text-gray-500 mt-1">Workstations, conference rooms, break rooms, and restrooms. Scheduled after hours for minimal disruption.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Check size={14} className="text-purple-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-gray-900">Retail & Showroom</h3>
                                    <p className="text-gray-500 mt-1">Floor care, window display cleaning, and fitting room sanitization to keep your store inviting.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Check size={14} className="text-purple-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-gray-900">Janitorial Services</h3>
                                    <p className="text-gray-500 mt-1">Daily maintenance, trash removal, and restocking of supplies.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specialized Services */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <Sparkles size={12} className="mr-2" />
                            Specialized
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Specialty Services</h2>
                        <p className="text-gray-500 text-lg mb-8">
                            For those tough jobs that require specific equipment and expertise.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Check size={14} className="text-yellow-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-gray-900">Carpet & Upholstery</h3>
                                    <p className="text-gray-500 mt-1">Hot water extraction to remove deep-seated dirt, stains, and allergens.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Check size={14} className="text-yellow-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-gray-900">Window Washing</h3>
                                    <p className="text-gray-500 mt-1">Interior and exterior window cleaning for a streak-free shine.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Check size={14} className="text-yellow-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-gray-900">Post-Construction</h3>
                                    <p className="text-gray-500 mt-1">Removing dust, debris, and stickers after a renovation or new build.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src="/images/service-specialized.png"
                            alt="Specialized Cleaning"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-black rounded-[2.5rem] p-12 md:p-24 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to experience the difference?</h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Book your service today and let us handle the dirty work. Your satisfaction is guaranteed.
                    </p>
                    <Button onClick={onBook} size="lg" className="rounded-full px-10 h-14 text-base bg-white text-black hover:bg-gray-100 border-none">
                        Book Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>

            </div>
        </div>
    );
};
