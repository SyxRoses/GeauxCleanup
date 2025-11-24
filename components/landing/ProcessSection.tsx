
import React from 'react';
import { MapPin, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProcessSectionProps {
  onBook: () => void;
}

// High-quality professional cleaning image from Unsplash
const CLEANING_CREW_IMAGE_PATH = '/images/hero-cleaner.png';

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onBook }) => {
  return (
    <div className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="mb-12 lg:mb-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Simple booking process</h2>
            <p className="text-gray-500 text-lg mb-12">Get your space cleaned in three easy steps.</p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex group">
                <div className="flex-shrink-0 mr-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-black transition-colors">
                    <MapPin size={24} className="text-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Choose your location</h3>
                  <p className="text-gray-500 leading-relaxed max-w-sm">Enter your address and select the type of cleaning you need.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex group">
                <div className="flex-shrink-0 mr-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-black transition-colors">
                    <Calendar size={24} className="text-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Pick your time</h3>
                  <p className="text-gray-500 leading-relaxed max-w-sm">Schedule for any day of the week, including same-day availability.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex group">
                <div className="flex-shrink-0 mr-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-black transition-colors">
                    <Sparkles size={24} className="text-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">We clean, you relax</h3>
                  <p className="text-gray-500 leading-relaxed max-w-sm">Licensed, insured team arrives with supplies. Come home to a sparkling space.</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Button onClick={onBook} size="lg" className="rounded-full px-8">
                Book service
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[500px] bg-gray-100">
              <img
                src={CLEANING_CREW_IMAGE_PATH}
                alt="Professional cleaning team at work"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-50 max-w-xs hidden md:block">
              <h4 className="font-bold text-gray-900 mb-2">Professional equipment</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                We bring all supplies and equipment—from HEPA vacuums to microfiber cloths.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
