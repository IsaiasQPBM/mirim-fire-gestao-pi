
import React from 'react';
import { Student } from '@/data/studentTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfilePrintProps {
  student: Student;
}

const ProfilePrint: React.FC<ProfilePrintProps> = ({ student }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'on_leave': return 'Em licença';
      default: return status;
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Perfil do Aluno - ${student.fullName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #F5A623;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 10px;
              background: linear-gradient(135deg, #F5A623, #E8941A);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            h1 {
              color: #D32F2F;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            .section-title {
              background: #F5A623;
              color: white;
              padding: 8px 12px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #666;
            }
            .info-value {
              margin-left: 5px;
            }
            .guardians {
              margin-top: 10px;
            }
            .guardian-item {
              border: 1px solid #ddd;
              padding: 10px;
              margin-bottom: 10px;
              border-radius: 4px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div>
      <button 
        onClick={handlePrint}
        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white px-4 py-2 rounded mb-4 no-print"
      >
        Imprimir Perfil
      </button>
      
      <div id="print-content">
        <div className="header">
          <div className="logo">CBM</div>
          <h1>CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ</h1>
          <h2>Projeto Bombeiro Mirim</h2>
          <h3>Perfil do Aluno</h3>
        </div>

        <div className="section">
          <div className="section-title">Dados Pessoais</div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nome Completo:</span>
              <span className="info-value">{student.fullName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Matrícula:</span>
              <span className="info-value">{student.registrationNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data de Nascimento:</span>
              <span className="info-value">{formatDate(student.birthDate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data de Matrícula:</span>
              <span className="info-value">{formatDate(student.enrollmentDate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">{getStatusLabel(student.status)}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Contato</div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{student.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Telefone:</span>
              <span className="info-value">{student.phone}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Endereço</div>
          <div className="info-item">
            <span className="info-label">Logradouro:</span>
            <span className="info-value">
              {student.address.street}, {student.address.number}
              {student.address.complement && `, ${student.address.complement}`}
            </span>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Bairro:</span>
              <span className="info-value">{student.address.neighborhood}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Cidade/Estado:</span>
              <span className="info-value">{student.address.city}/{student.address.state}</span>
            </div>
            <div className="info-item">
              <span className="info-label">CEP:</span>
              <span className="info-value">{student.address.zipCode}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Responsáveis</div>
          <div className="guardians">
            {student.guardians.map(guardian => (
              <div key={guardian.id} className="guardian-item">
                <div className="info-item">
                  <span className="info-label">Nome:</span>
                  <span className="info-value">{guardian.name}</span>
                  {guardian.isEmergencyContact && <span style={{color: 'red'}}> (Contato de Emergência)</span>}
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Parentesco:</span>
                    <span className="info-value">{guardian.relationship}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Telefone:</span>
                    <span className="info-value">{guardian.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{guardian.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {student.notes && (
          <div className="section">
            <div className="section-title">Observações</div>
            <div className="info-item">
              <span className="info-value">{student.notes}</span>
            </div>
          </div>
        )}

        <div style={{marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#666'}}>
          <p>Documento gerado em {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
          <p>Sistema de Gestão - Projeto Bombeiro Mirim - CBMEPI</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePrint;
