
import React from 'react';
import { generatePDF } from '@/components/PDFGenerator';

interface ProfilePrintProps {
  student: any;
  onPrint: () => void;
}

const ProfilePrint: React.FC<ProfilePrintProps> = ({ student, onPrint }) => {
  
  const handlePrint = () => {
    const printContent = `
      <h2>Perfil do Aluno</h2>
      <table>
        <tr><td><strong>Nome:</strong></td><td>${student.name || 'N/A'}</td></tr>
        <tr><td><strong>Matrícula:</strong></td><td>${student.registrationNumber || 'N/A'}</td></tr>
        <tr><td><strong>Data de Nascimento:</strong></td><td>${student.birthDate ? new Date(student.birthDate).toLocaleDateString('pt-BR') : 'N/A'}</td></tr>
        <tr><td><strong>Telefone:</strong></td><td>${student.phone || 'N/A'}</td></tr>
        <tr><td><strong>Status:</strong></td><td>${student.status || 'N/A'}</td></tr>
        <tr><td><strong>Data de Matrícula:</strong></td><td>${student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString('pt-BR') : 'N/A'}</td></tr>
      </table>
      ${student.notes ? `<h3>Observações:</h3><p>${student.notes}</p>` : ''}
    `;

    generatePDF({
      title: `Perfil do Aluno - ${student.name}`,
      content: printContent,
      fileName: `perfil_${student.name?.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`
    });

    onPrint();
  };

  return (
    <div>
      <button onClick={handlePrint} className="print-button">
        Imprimir Perfil
      </button>
    </div>
  );
};

export default ProfilePrint;
