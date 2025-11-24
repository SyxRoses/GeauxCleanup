import React from 'react';
import { Home, Building2, Leaf, ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <div className="py-24 bg-gray-50" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Cleaning for every need</h2>
          <p className="text-gray-500 text-lg">Whether it's your home, office, or a specialized deep clean, our trained professionals have the right tools for the job.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1: Residential */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="h-64 overflow-hidden relative">
              <img
                src="/images/service-residential.png"
                alt="Residential Cleaning"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Home size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Residential Cleaning</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                From dusting baseboards to scrubbing showers, we handle the dirty work. Weekly, bi-weekly, or monthly plans available.
              </p>
              <a href="#" className="flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Learn more <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          </div>

          {/* Card 2: Office/Commercial */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="h-64 overflow-hidden">
              <img
                src="/images/gallery-living-room.png"
                alt="Office Cleaning"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Commercial & Office</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                Create a pristine work environment for your team. We offer after-hours cleaning to minimize disruption to your business.
              </p>
              <a href="#" className="flex items-center text-sm font-bold text-gray-900 hover:text-purple-600 transition-colors">
                Learn more <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          </div>

          {/* Card 3: Deep/Eco */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="h-64 overflow-hidden">
              <img
                src="/images/gallery-vacuum.png"
                alt="Deep Cleaning"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deep & Eco Clean</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                A thorough top-to-bottom refresh using certified green products that are safe for pets, children, and the planet.
              </p>
              <a href="#" className="flex items-center text-sm font-bold text-gray-900 hover:text-green-600 transition-colors">
                Learn more <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};