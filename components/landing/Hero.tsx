import React from 'react';
import { Button } from '../ui/Button';
import { Calendar, FileText, Star, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBooking }) => {
  return (
    <div className="relative pt-32 pb-16 lg:pt-40 lg:pb-32 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
              <Sparkles size={12} className="mr-2" />
              #1 Rated Cleaning Service
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Experience the <br />
              <span className="text-gray-900">joy of clean.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              We scrub, mop, and polish so you don't have to. Professional residential and commercial cleaning with a 100% satisfaction guarantee.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button onClick={onStartBooking} size="lg" className="rounded-full px-8 h-14 text-base w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Cleaning
              </Button>
              <Button onClick={onStartBooking} variant="secondary" size="lg" className="rounded-full px-8 h-14 text-base w-full sm:w-auto bg-white border border-gray-200 text-gray-900 hover:bg-gray-50">
                <FileText className="mr-2 h-5 w-5" />
                Get a Quote
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 border-t border-gray-100 pt-8">
              <div className="flex flex-col">
                <span className="font-bold text-3xl text-gray-900">2k+</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Homes Cleaned</span>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="font-bold text-3xl text-gray-900">4.9</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Star Rating</span>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="font-bold text-3xl text-gray-900">100%</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Insured</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 aspect-[4/5] lg:aspect-auto lg:h-[700px]">
              {/* 
                 Hero Image: Professional cleaner with supplies
               */}
              <img
                src="/images/hero-cleaner.png"
                alt="Professional Cleaner with Supplies"
                className="w-full h-full object-cover"
              />

              {/* Decorative Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

              {/* Trust Badge */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+2k</div>
                  </div>
                  <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-800 italic">"The best cleaning service we've ever used. Our home feels brand new!"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};