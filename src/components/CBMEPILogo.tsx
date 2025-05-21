
import React from 'react';

interface CBMEPILogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

const CBMEPILogo: React.FC<CBMEPILogoProps> = ({ size = 'medium', withText = true }) => {
  const dimensions = {
    small: 'w-10 h-10',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
  };

  return (
    <div className={`flex flex-col items-center ${withText ? 'gap-2' : ''}`}>
      <div className={`${dimensions[size]} relative flex items-center justify-center rounded-full bg-cbmepi-orange border-4 border-cbmepi-red`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-3/4 h-3/4">
            {/* Stylized representation of the CBMEPI emblem */}
            <div className="absolute inset-0 rounded-full bg-cbmepi-orange flex items-center justify-center overflow-hidden">
              <div className="w-5/6 h-5/6 rounded-full bg-cbmepi-white flex items-center justify-center">
                <div className="w-11/12 h-11/12 rounded-full bg-cbmepi-orange flex items-center justify-center">
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
      </div>
      
      {withText && (
        <div className={`text-center font-bold text-cbmepi-red ${size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base'}`}>
          <div>CORPO DE BOMBEIROS MILITAR</div>
          <div>DO ESTADO DO PIAUÍ</div>
          <div className="text-cbmepi-orange">1944</div>
        </div>
      )}
    </div>
  );
};

export default CBMEPILogo;
