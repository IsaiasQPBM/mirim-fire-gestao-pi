
import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-gray-50 border-t border-gray-200 py-4 px-6 text-center ${className}`}>
      <p className="text-sm text-gray-600">
        ETI - Corpo de Bombeiros Militar do Estado do Piauí
      </p>
    </footer>
  );
};

export default Footer;
