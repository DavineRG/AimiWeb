import React from 'react';
import { Rabbit } from 'lucide-react';

const GardenWindow: React.FC = () => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Window frame */}
      <div className="relative bg-[#FFC0CB]/20 rounded-t-xl border-[6px] border-[#A67B5B] p-4 overflow-hidden">
        {/* Window arch */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-[#A67B5B] rounded-t-lg" />
        
        {/* Sky background */}
        <div className="relative pt-8 pb-20 px-4 bg-gradient-to-b from-sky-300 to-sky-100 rounded-lg overflow-hidden">
          {/* Clouds */}
          <div className="absolute top-12 left-5 w-16 h-6 bg-white rounded-full opacity-80" />
          <div className="absolute top-16 left-12 w-12 h-4 bg-white rounded-full opacity-70" />
          <div className="absolute top-10 right-8 w-20 h-8 bg-white rounded-full opacity-80" />
          
          {/* Garden elements */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#8BC34A]" />
          <div className="absolute bottom-10 left-1/4 w-1 h-16 bg-[#A67B5B]">
            <div className="absolute -top-6 -left-5 w-10 h-10 bg-[#FF69B4] rounded-full" />
          </div>
          <div className="absolute bottom-10 right-1/4 w-1 h-20 bg-[#A67B5B]">
            <div className="absolute -top-8 -left-6 w-12 h-12 bg-[#FFC0CB] rounded-full" />
          </div>
          
          {/* Plank with Aimi text */}
          <div className="relative mx-auto mt-2 w-40 h-12 bg-[#A67B5B] rounded-lg flex items-center justify-center transform -rotate-2">
            <span className="text-white font-bold text-xl tracking-wide">Aimi</span>
          </div>
          
          {/* Animated bunny */}
          <div className="absolute bottom-2 right-8 animate-bounce">
            <div className="relative">
              <Rabbit size={48} className="text-[#FFC0CB] fill-[#FFC0CB]" />
              {/* Waving hand animation */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-[#FFC0CB] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Window sill */}
      <div className="w-full h-4 bg-[#A67B5B] rounded-b-lg shadow-md" />
    </div>
  );
};

export default GardenWindow;