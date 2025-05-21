
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    // Set page title based on route
    const path = location.pathname.slice(1); // Remove leading slash
    const formattedTitle = path.charAt(0).toUpperCase() + path.slice(1);
    setTitle(formattedTitle);
  }, [location.pathname, navigate]);

  if (!userRole) return null; // Don't render until we have user role

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title={title} userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-cbmepi-black">{title}</h2>
            <p className="text-gray-600 mb-8 text-center">
              Esta página está em desenvolvimento e será implementada em breve.
            </p>
            <div className="w-24 h-24 rounded-full bg-cbmepi-orange/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-cbmepi-orange/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-cbmepi-orange"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceholderPage;
