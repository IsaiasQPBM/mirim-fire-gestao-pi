
import React from 'react';

interface CBMEPILogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
  logoUrl?: string; // Allow custom logo URL
}

const CBMEPILogo: React.FC<CBMEPILogoProps> = ({ 
  size = 'medium', 
  withText = true, 
  logoUrl 
}) => {
  const dimensions = {
    small: 'w-10 h-10',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg font-bold',
  };

  return (
    <div className={`flex flex-col items-center ${withText ? 'gap-3' : ''}`}>
      <div className={`${dimensions[size]} relative flex items-center justify-center rounded-full shadow-lg overflow-hidden`}>
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Logo Bombeiro Mirim" 
            className="w-full h-full object-cover rounded-full border-4 border-white"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] border-4 border-cbmepi-red rounded-full flex items-center justify-center">
            <div className="relative w-3/4 h-3/4">
              {/* Stylized representation of the CBMEPI emblem */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] flex items-center justify-center overflow-hidden">
                <div className="w-5/6 h-5/6 rounded-full bg-cbmepi-white flex items-center justify-center">
                  <div className="w-11/12 h-11/12 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8941A] flex items-center justify-center">
                    {/* Crossed axes */}
                    <div className="absolute w-1/2 h-1/2 rotate-45 bg-cbmepi-red rounded-sm transform -translate-y-1/4"></div>
                    <div className="absolute w-1/2 h-1/2 -rotate-45 bg-cbmepi-red rounded-sm transform -translate-y-1/4"></div>
                    
                    {/* Flames representation */}
                    <div className="absolute bottom-1/3 w-1/3 h-1/3">
                      <div className="w-full h-full bg-cbmepi-red rounded-t-full"></div>
                    </div>
                    
                    {/* The three palm trees representation */}
                    <div className="absolute top-1/4 flex space-x-1">
                      <div className="w-1 h-3 bg-cbmepi-black rounded-full"></div>
                      <div className="w-1 h-4 bg-cbmepi-black rounded-full"></div>
                      <div className="w-1 h-3 bg-cbmepi-black rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {withText && (
        <div className={`text-center font-bold text-cbmepi-red ${textSizes[size]}`}>
          <div className={size === 'large' ? 'text-xl' : size === 'medium' ? 'text-base' : 'text-sm'}>
            CORPO DE BOMBEIROS MILITAR
          </div>
          <div className={size === 'large' ? 'text-xl' : size === 'medium' ? 'text-base' : 'text-sm'}>
            DO ESTADO DO PIAUÍ
          </div>
          <div className="text-[#F5A623] font-extrabold mt-1">
            Projeto Bombeiro Mirim
          </div>
        </div>
      )}
    </div>
  );
};

export default CBMEPILogo;
