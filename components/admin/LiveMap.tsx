import React from 'react';
import { Car, MapPin } from 'lucide-react';

interface Marker {
  lat: number;
  lng: number;
  id: string;
  status: 'working' | 'driving' | 'offline';
  rotation?: number;
}

interface LiveMapProps {
  markers: Marker[];
  className?: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({ markers, className = '' }) => {
  return (
    <div className={`w-full h-full bg-[#F3F4F6] relative overflow-hidden group ${className}`}>
      {/* Abstract Map Background - Light Mode */}
      <div className="absolute inset-0 bg-[#E5E7EB]"></div>
      
      {/* Water / Parks Abstract Shapes */}
      <div className="absolute top-0 right-0 w-3/4 h-full bg-[#F9FAFB] transform -skew-x-12 origin-top-right"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white rounded-tr-[100px]"></div>
      
      {/* Road Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: 'linear-gradient(#9CA3AF 1px, transparent 1px), linear-gradient(90deg, #9CA3AF 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      ></div>

      {/* City Label */}
      <div className="absolute top-6 left-6 z-10">
        <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase">New Orleans, LA</h4>
      </div>

      {/* Markers */}
      {markers.map((marker, idx) => (
        <div
          key={marker.id}
          className="absolute flex flex-col items-center justify-center transform hover:scale-110 transition-transform cursor-pointer"
          style={{
            top: `${50 + (idx * 15) * (idx % 2 === 0 ? 0.8 : -0.8)}%`,
            left: `${50 + (idx * 12) * (idx % 2 === 0 ? -1 : 1)}%`,
          }}
        >
          {/* Status Ring Pulse */}
          {marker.status !== 'offline' && (
            <div className={`absolute w-12 h-12 rounded-full opacity-20 animate-ping ${
              marker.status === 'working' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
          )}
          
          {/* Vehicle Icon */}
          <div className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center border-2 border-white relative z-10 ${
            marker.status === 'working' ? 'bg-green-100 text-green-700' : 
            marker.status === 'driving' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-gray-100 text-gray-400'
          }`}>
             <Car size={14} fill="currentColor" className="transform" style={{ transform: `rotate(${marker.rotation || 0}deg)` }} />
          </div>
          
          {/* Tooltip */}
          <div className="mt-2 bg-white px-2 py-1 rounded text-[10px] font-bold text-gray-800 shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
            {marker.id}
          </div>
        </div>
      ))}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="w-8 h-8 bg-white text-gray-600 shadow-sm border border-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">+</button>
        <button className="w-8 h-8 bg-white text-gray-600 shadow-sm border border-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">-</button>
      </div>
    </div>
  );
};