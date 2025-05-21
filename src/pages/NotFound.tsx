
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CBMEPILogo from '@/components/CBMEPILogo';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <CBMEPILogo size="medium" />
        
        <h1 className="mt-8 text-6xl font-bold text-cbmepi-red">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-cbmepi-black">Página não encontrada</h2>
        
        <p className="mt-4 text-gray-600">
          A página que você está procurando não existe ou foi movida para outro local.
        </p>
        
        <div className="mt-8">
          <Button asChild className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
            <Link to="/">Voltar para a tela inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
