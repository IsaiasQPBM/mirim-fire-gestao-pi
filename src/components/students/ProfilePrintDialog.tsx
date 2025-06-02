
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Student } from '@/data/studentTypes';
import { X, FileText, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfilePrintDialogProps {
  student: Student;
  onClose: () => void;
}

const ProfilePrintDialog: React.FC<ProfilePrintDialogProps> = ({ student, onClose }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Perfil do Aluno - ${student.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #F5A623; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { color: #F5A623; font-size: 24px; font-weight: bold; }
            .student-name { font-size: 28px; margin: 10px 0; color: #333; }
            .section { margin-bottom: 25px; }
            .section-title { background: #F5A623; color: white; padding: 8px; font-weight: bold; margin-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { margin-bottom: 8px; }
            .label { font-weight: bold; color: #666; }
            .value { margin-left: 10px; }
            .full-width { grid-column: 1 / -1; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ</div>
            <div style="color: #666; margin: 5px 0;">Projeto Bombeiro Mirim</div>
            <div class="student-name">${student.fullName}</div>
          </div>

          <div class="section">
            <div class="section-title">DADOS PESSOAIS</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Nome Completo:</span>
                <span class="value">${student.fullName}</span>
              </div>
              <div class="info-item">
                <span class="label">Matrícula:</span>
                <span class="value">${student.registrationNumber}</span>
              </div>
              <div class="info-item">
                <span class="label">Data de Nascimento:</span>
                <span class="value">${formatDate(student.birthDate)}</span>
              </div>
              <div class="info-item">
                <span class="label">Data de Matrícula:</span>
                <span class="value">${formatDate(student.enrollmentDate)}</span>
              </div>
              <div class="info-item">
                <span class="label">Status:</span>
                <span class="value">${student.status === 'active' ? 'Ativo' : student.status === 'inactive' ? 'Inativo' : 'Em licença'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">CONTATO</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">${student.email}</span>
              </div>
              <div class="info-item">
                <span class="label">Telefone:</span>
                <span class="value">${student.phone}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">ENDEREÇO</div>
            <div class="info-grid">
              <div class="info-item full-width">
                <span class="label">Logradouro:</span>
                <span class="value">${student.address.street}, ${student.address.number}${student.address.complement ? `, ${student.address.complement}` : ''}</span>
              </div>
              <div class="info-item">
                <span class="label">Bairro:</span>
                <span class="value">${student.address.neighborhood}</span>
              </div>
              <div class="info-item">
                <span class="label">Cidade/Estado:</span>
                <span class="value">${student.address.city}/${student.address.state}</span>
              </div>
              <div class="info-item">
                <span class="label">CEP:</span>
                <span class="value">${student.address.zipCode}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">RESPONSÁVEIS</div>
            ${student.guardians.map(guardian => `
              <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd;">
                <div class="info-item">
                  <span class="label">Nome:</span>
                  <span class="value">${guardian.name}</span>
                </div>
                <div class="info-item">
                  <span class="label">Parentesco:</span>
                  <span class="value">${guardian.relationship}</span>
                </div>
                <div class="info-item">
                  <span class="label">Telefone:</span>
                  <span class="value">${guardian.phone}</span>
                </div>
                <div class="info-item">
                  <span class="label">Email:</span>
                  <span class="value">${guardian.email}</span>
                </div>
                ${guardian.isEmergencyContact ? '<div style="color: #F5A623; font-weight: bold;">Contato de emergência</div>' : ''}
              </div>
            `).join('')}
          </div>

          ${student.notes ? `
            <div class="section">
              <div class="section-title">ANOTAÇÕES</div>
              <div style="padding: 10px; background: #f9f9f9; border-left: 4px solid #F5A623;">
                ${student.notes}
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
            Documento gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = () => {
    // Esta funcionalidade seria implementada com uma biblioteca como jsPDF ou html2pdf
    alert('Funcionalidade de download em PDF será implementada em breve');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="mr-2" size={20} />
            Imprimir Perfil
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="font-medium mb-2">{student.fullName}</h3>
            <p className="text-sm text-gray-600">Matrícula: {student.registrationNumber}</p>
          </div>

          <div className="border-t pt-4 space-y-3">
            <p className="text-sm text-gray-600">
              Escolha uma das opções abaixo para gerar o relatório do perfil do aluno:
            </p>
            
            <Button 
              className="w-full gap-2" 
              onClick={handlePrint}
              variant="outline"
            >
              <Eye size={16} />
              Visualizar e Imprimir
            </Button>
            
            <Button 
              className="w-full gap-2 bg-cbmepi-orange hover:bg-cbmepi-orange/90" 
              onClick={handleDownloadPDF}
            >
              <Download size={16} />
              Baixar como PDF
            </Button>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePrintDialog;
