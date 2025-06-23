
import React from 'react';

interface CBMEPILogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
  logoUrl?: string;
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

  // Usar o logo oficial do CBMEPI
  const officialLogoUrl = '/lovable-uploads/ea2da570-3d73-4c06-9dd2-2251355190c7.png';

  return (
    <div className={`flex flex-col items-center ${withText ? 'gap-3' : ''}`}>
      <div className={`${dimensions[size]} relative flex items-center justify-center rounded-full overflow-hidden border-4 border-cbmepi-red shadow-lg bg-white`}>
        <img 
          src={logoUrl || officialLogoUrl} 
          alt="Logo Corpo de Bombeiros Militar do Estado do Piauí" 
          className="w-full h-full object-contain p-1"
        />
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
