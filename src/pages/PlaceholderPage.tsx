
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title = 'Página em Desenvolvimento' }) => {
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title={title} userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-cbmepi-orange border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-cbmepi-black mb-2">{title}</h2>
        <p className="text-gray-600 max-w-md text-center mb-8">
          Esta funcionalidade está em desenvolvimento e será implementada em breve.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </main>
    </div>
  );
};

export default PlaceholderPage;
