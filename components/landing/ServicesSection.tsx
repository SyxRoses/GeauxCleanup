import React from 'react';
import { Home, Building2, Leaf, ArrowRight, Sparkles } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <div className="py-32 bg-brand-navy relative overflow-hidden" id="services">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-gold blur-[100px] rounded-full"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-500 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-3 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6">Expert Commercial Solutions</h2>
          <p className="text-brand-slate/80 text-lg font-light leading-relaxed">From boardrooms to breakrooms, we ensure your business environment reflects your professionalism.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1: Janitorial */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-soft-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full border border-white/10">
            <div className="h-64 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Janitorial Services"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-brand-navy/90 backdrop-blur px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wide border border-white/20">
                Essential
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col relative">
              <div className="w-14 h-14 bg-brand-gray rounded-2xl flex items-center justify-center text-brand-navy mb-6 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors duration-300 shadow-sm border border-gray-100">
                <Building2 size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-3">Janitorial Services</h3>
              <p className="text-brand-slate text-sm leading-relaxed mb-8 flex-1">
                Daily or weekly office cleaning including trash removal, restroom sanitation, and workstation upkeep.
              </p>
              <a href="#" className="flex items-center text-sm font-bold text-brand-navy group-hover:text-brand-gold transition-colors mt-auto">
                <span className="border-b-2 border-brand-navy/10 group-hover:border-brand-gold pb-0.5 transition-all">Learn more</span>
                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 2: Floor Care */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-soft-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
            <div className="h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80"
                alt="Floor Care"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-brand-gray rounded-2xl flex items-center justify-center text-brand-navy mb-6 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors duration-300 shadow-sm border border-gray-100">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-3">Floor Care & Maintenance</h3>
              <p className="text-brand-slate text-sm leading-relaxed mb-8 flex-1">
                Professional stripping, waxing, buffing, and carpet extraction to keep your floors looking new.
              </p>
              <a href="#" className="flex items-center text-sm font-bold text-brand-navy group-hover:text-brand-gold transition-colors mt-auto">
                <span className="border-b-2 border-brand-navy/10 group-hover:border-brand-gold pb-0.5 transition-all">Learn more</span>
                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 3: Post-Construction */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-soft-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
            <div className="h-64 overflow-hidden">
              <img
                src="/images/service-post-construction.png"
                alt="Post-Construction"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="w-14 h-14 bg-brand-gray rounded-2xl flex items-center justify-center text-brand-navy mb-6 group-hover:bg-brand-navy group-hover:text-brand-gold transition-colors duration-300 shadow-sm border border-gray-100">
                <Leaf size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-3">Post-Construction</h3>
              <p className="text-brand-slate text-sm leading-relaxed mb-8 flex-1">
                Detailed cleanup after renovation or construction. We handle debris, fine dust, and final detailing.
              </p>
              <a href="#" className="flex items-center text-sm font-bold text-brand-navy group-hover:text-brand-gold transition-colors mt-auto">
                <span className="border-b-2 border-brand-navy/10 group-hover:border-brand-gold pb-0.5 transition-all">Learn more</span>
                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};