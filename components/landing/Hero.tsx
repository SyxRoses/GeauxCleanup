import React from 'react';
import { Button } from '../ui/Button';
import { Calendar, FileText, Star, Sparkles, CheckCircle, Play } from 'lucide-react';

interface HeroProps {
  onStartBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBooking }) => {
  return (
    <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 bg-brand-gray overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-brand-navy/5 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-brand-navy text-xs font-bold uppercase tracking-widest mb-8">
              <Sparkles size={14} className="mr-2 text-brand-gold" />
              #1 Rated Cleaning Service
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl font-medium tracking-tight text-brand-navy mb-8 leading-[1.1]">
              Experience the <br />
              <span className="text-brand-navy relative">
                premium workspace.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-gold opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7501 5.51623 52.5159 0.43343 194.008 2.05441" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </h1>
            <p className="text-lg text-brand-slate mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              We handle the details so you can focus on business. Professional commercial cleaning with a 100% satisfaction guarantee.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button onClick={onStartBooking} size="lg" className="px-8 h-14 text-base w-full sm:w-auto shadow-glow hover:shadow-xl transition-all">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Cleaning
              </Button>
              <Button onClick={onStartBooking} variant="outline" size="lg" className="px-8 h-14 text-base w-full sm:w-auto bg-white hover:bg-gray-50">
                <FileText className="mr-2 h-5 w-5" />
                Get a Quote
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8">
              {[
                { label: 'Offices Served', value: '20+' },
                { label: 'Client Retention', value: '98%' },
                { label: 'Insured', value: '100%' }
              ].map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="font-serif font-bold text-3xl text-brand-navy">{stat.value}</span>
                  <span className="text-xs text-brand-slate/80 font-medium uppercase tracking-wide mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-6 relative perspective-1000">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-navy/20 bg-white aspect-[4/5] lg:aspect-auto lg:h-[700px] animate-float">
              {/* 
                 Hero Image: Professional cleaner with supplies
               */}
              <img
                src="/images/hero-cleaner.png"
                alt="Professional Cleaner with Supplies"
                className="w-full h-full object-cover"
              />

              {/* Decorative Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>

              {/* Trust Badge - Floating Card Style */}
              <div className="absolute bottom-10 left-8 right-8 bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-soft-xl border border-white/50 transform transition-transform hover:scale-105 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-brand-gold/10 p-2 rounded-full">
                      <CheckCircle size={20} className="text-brand-gold" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-navy text-sm">Verified Professional</p>
                      <p className="text-xs text-brand-slate">Top Rated Cleaner</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" className={i === 4 ? "text-gray-300" : ""} />
                    ))}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex -space-x-3">
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80" alt="User" />
                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=100&h=100&q=80" alt="User" />
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-navy flex items-center justify-center text-xs font-bold text-white">+2k</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-navy italic leading-snug">"Our office has never looked better. Highly professional team!"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements (Decorative) */}
            <div className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce delay-700 hidden lg:block">
              <Sparkles className="text-brand-gold w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};