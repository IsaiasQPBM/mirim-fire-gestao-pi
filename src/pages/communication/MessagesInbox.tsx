
import React from 'react';

const MessagesInbox: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-cbmepi-black mb-4">
          Sistema de Mensagens - Teste
        </h1>
        <p>Se você está vendo esta mensagem, a rota está funcionando!</p>
        <p>User ID: {localStorage.getItem('userId')}</p>
        <p>User Role: {localStorage.getItem('userRole')}</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MessagesInbox;
