import { Student } from '@/data/studentTypes';

// Serviço para geração de PDFs reais
export class PDFService {
  static generateStudentBulletin(student: Student): void {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Boletim Individual - ${student.fullName}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #f39c12; 
            padding-bottom: 20px; 
          }
          .logo { 
            color: #f39c12; 
            font-size: 24px; 
            font-weight: bold; 
          }
          .content { 
            margin: 20px 0; 
          }
          .section { 
            margin: 20px 0; 
            padding: 15px; 
            border: 1px solid #ddd; 
            border-radius: 5px; 
          }
          .section h3 { 
            color: #f39c12; 
            margin-top: 0; 
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
          }
          .footer { 
            text-align: center; 
            margin-top: 50px; 
            font-size: 12px; 
            color: #666; 
            border-top: 1px solid #ddd; 
            padding-top: 20px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 10px 0; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #f5f5f5; 
            color: #f39c12; 
          }
          .status-active { 
            color: #27ae60; 
            font-weight: bold; 
          }
          .status-inactive { 
            color: #e74c3c; 
            font-weight: bold; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ</div>
          <h2>Projeto Bombeiro Mirim</h2>
          <h3>Boletim Individual do Aluno</h3>
        </div>
        
        <div class="content">
          <div class="section">
            <h3>Dados Pessoais</h3>
            <div class="info-grid">
              <div>
                <strong>Nome:</strong> ${student.fullName}<br>
                <strong>Matrícula:</strong> ${student.registrationNumber}<br>
                <strong>Data de Nascimento:</strong> ${new Date(student.birthDate).toLocaleDateString('pt-BR')}<br>
                <strong>Status:</strong> <span class="status-${student.status}">${student.status === 'active' ? 'Ativo' : 'Inativo'}</span>
              </div>
              <div>
                <strong>Email:</strong> ${student.email}<br>
                <strong>Telefone:</strong> ${student.phone}<br>
                <strong>Data de Matrícula:</strong> ${new Date(student.enrollmentDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Endereço</h3>
            <p>
              ${student.address.street}, ${student.address.number}
              ${student.address.complement ? `, ${student.address.complement}` : ''}<br>
              ${student.address.neighborhood} - ${student.address.city}/${student.address.state}<br>
              CEP: ${student.address.zipCode}
            </p>
          </div>

          <div class="section">
            <h3>Responsáveis</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Parentesco</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Emergência</th>
                </tr>
              </thead>
              <tbody>
                ${student.guardians.map(guardian => `
                  <tr>
                    <td>${guardian.name}</td>
                    <td>${guardian.relationship}</td>
                    <td>${guardian.phone}</td>
                    <td>${guardian.email}</td>
                    <td>${guardian.isEmergencyContact ? 'Sim' : 'Não'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          ${student.notes ? `
            <div class="section">
              <h3>Observações</h3>
              <p>${student.notes}</p>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Documento gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>CBMEPI - Projeto Bombeiro Mirim</p>
        </div>
      </body>
      </html>
    `;

    this.downloadPDF(content, `boletim_${student.fullName.replace(/\s+/g, '_').toLowerCase()}`);
  }

  static generateAttendanceReport(): void {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Frequência</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f39c12; padding-bottom: 20px; }
          .logo { color: #f39c12; font-size: 24px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; color: #f39c12; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ</div>
          <h2>Projeto Bombeiro Mirim</h2>
          <h3>Relatório de Frequência</h3>
        </div>
        
        <div class="content">
          <p><strong>Período:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Turma</th>
                <th>Presenças</th>
                <th>Faltas</th>
                <th>% Frequência</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>João Silva</td>
                <td>Turma A</td>
                <td>18</td>
                <td>2</td>
                <td>90%</td>
                <td>Adequado</td>
              </tr>
              <tr>
                <td>Maria Santos</td>
                <td>Turma A</td>
                <td>20</td>
                <td>0</td>
                <td>100%</td>
                <td>Excelente</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>CBMEPI - Projeto Bombeiro Mirim</p>
        </div>
      </body>
      </html>
    `;

    this.downloadPDF(content, 'relatorio_frequencia');
  }

  static generateClassPerformanceReport(): void {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Desempenho por Turma</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f39c12; padding-bottom: 20px; }
          .logo { color: #f39c12; font-size: 24px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; color: #f39c12; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ</div>
          <h2>Projeto Bombeiro Mirim</h2>
          <h3>Relatório de Desempenho por Turma</h3>
        </div>
        
        <div class="content">
          <table>
            <thead>
              <tr>
                <th>Turma</th>
                <th>Total Alunos</th>
                <th>Média Geral</th>
                <th>Aprovados</th>
                <th>Reprovados</th>
                <th>% Aprovação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Turma A - Manhã</td>
                <td>25</td>
                <td>8.5</td>
                <td>23</td>
                <td>2</td>
                <td>92%</td>
              </tr>
              <tr>
                <td>Turma B - Tarde</td>
                <td>20</td>
                <td>7.8</td>
                <td>18</td>
                <td>2</td>
                <td>90%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>CBMEPI - Projeto Bombeiro Mirim</p>
        </div>
      </body>
      </html>
    `;

    this.downloadPDF(content, 'desempenho_turma');
  }

  static generateApprovalStatsReport(): void {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Estatísticas de Aprovação</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f39c12; padding-bottom: 20px; }
          .logo { color: #f39c12; font-size: 24px; font-weight: bold; }
          .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .stat-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; text-align: center; }
          .stat-number { font-size: 2em; color: #f39c12; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; color: #f39c12; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ</div>
          <h2>Projeto Bombeiro Mirim</h2>
          <h3>Estatísticas de Aprovação</h3>
        </div>
        
        <div class="content">
          <div class="stats">
            <div class="stat-box">
              <div class="stat-number">91%</div>
              <div>Taxa de Aprovação Geral</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">120</div>
              <div>Total de Alunos</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">109</div>
              <div>Alunos Aprovados</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">11</div>
              <div>Alunos Reprovados</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Total Alunos</th>
                <th>Aprovados</th>
                <th>Reprovados</th>
                <th>% Aprovação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Primeiros Socorros</td>
                <td>120</td>
                <td>115</td>
                <td>5</td>
                <td>96%</td>
              </tr>
              <tr>
                <td>Prevenção de Incêndios</td>
                <td>120</td>
                <td>110</td>
                <td>10</td>
                <td>92%</td>
              </tr>
              <tr>
                <td>Educação Ambiental</td>
                <td>120</td>
                <td>118</td>
                <td>2</td>
                <td>98%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>CBMEPI - Projeto Bombeiro Mirim</p>
        </div>
      </body>
      </html>
    `;

    this.downloadPDF(content, 'estatisticas_aprovacao');
  }

  static generateComparativeReport(): void {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Análise Comparativa</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f39c12; padding-bottom: 20px; }
          .logo { color: #f39c12; font-size: 24px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; color: #f39c12; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ</div>
          <h2>Projeto Bombeiro Mirim</h2>
          <h3>Análise Comparativa de Desempenho</h3>
        </div>
        
        <div class="content">
          <h4>Comparativo por Períodos</h4>
          <table>
            <thead>
              <tr>
                <th>Período</th>
                <th>Total Alunos</th>
                <th>Média Geral</th>
                <th>Taxa Aprovação</th>
                <th>Taxa Frequência</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024.1</td>
                <td>115</td>
                <td>8.2</td>
                <td>89%</td>
                <td>92%</td>
              </tr>
              <tr>
                <td>2024.2</td>
                <td>120</td>
                <td>8.5</td>
                <td>91%</td>
                <td>94%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>CBMEPI - Projeto Bombeiro Mirim</p>
        </div>
      </body>
      </html>
    `;

    this.downloadPDF(content, 'analise_comparativa');
  }

  static generateGradesReport(student: any, grades: any[]) {
    const content = `
      <h3>Relatório de Notas - ${student.fullName}</h3>
      <p><strong>Matrícula:</strong> ${student.registrationNumber}</p>
      <p><strong>Data de Geração:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      
      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Avaliação</th>
            <th>Nota</th>
            <th>Nota Máxima</th>
            <th>Data</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          ${grades.map(grade => 
            grade.assessments.map(assessment => `
              <tr>
                <td>${grade.disciplineName}</td>
                <td>${assessment.name}</td>
                <td>${assessment.grade}</td>
                <td>${assessment.maxGrade}</td>
                <td>${new Date(assessment.date).toLocaleDateString('pt-BR')}</td>
                <td>${(assessment.weight * 100)}%</td>
              </tr>
            `).join('')
          ).join('')}
        </tbody>
      </table>
      
      <h4>Resumo por Disciplina</h4>
      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Média Final</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${grades.map(grade => `
            <tr>
              <td>${grade.disciplineName}</td>
              <td>${grade.finalGrade}</td>
              <td>${grade.status === 'approved' ? 'Aprovado' : grade.status === 'recovery' ? 'Recuperação' : 'Reprovado'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    generatePDF({
      title: `Relatório de Notas - ${student.fullName}`,
      content,
      fileName: `relatorio_notas_${student.fullName.replace(/\s+/g, '_').toLowerCase()}`
    });
  }

  static generateScheduleReport(student: any, schedule: any[], events: any[]) {
    const content = `
      <h3>Cronograma - ${student.fullName}</h3>
      <p><strong>Matrícula:</strong> ${student.registrationNumber}</p>
      <p><strong>Data de Geração:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      
      <h4>Cronograma Semanal</h4>
      <table>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Horário</th>
            <th>Disciplina</th>
            <th>Instrutor</th>
            <th>Local</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          ${schedule.map(day => 
            day.classes.map(cls => `
              <tr>
                <td>${day.day}</td>
                <td>${cls.time}</td>
                <td>${cls.subject}</td>
                <td>${cls.instructor}</td>
                <td>${cls.room}</td>
                <td>${cls.type}</td>
              </tr>
            `).join('')
          ).join('')}
        </tbody>
      </table>
      
      <h4>Próximos Eventos</h4>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Evento</th>
            <th>Horário</th>
            <th>Local</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          ${events.map(event => `
            <tr>
              <td>${new Date(event.date).toLocaleDateString('pt-BR')}</td>
              <td>${event.title}</td>
              <td>${event.time}</td>
              <td>${event.location}</td>
              <td>${event.type}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    generatePDF({
      title: `Cronograma - ${student.fullName}`,
      content,
      fileName: `cronograma_${student.fullName.replace(/\s+/g, '_').toLowerCase()}`
    });
  }

  static generateCompleteStudentReport(student: any, grades: any[], schedule: any[], events: any[]) {
    const gradesAverage = grades.reduce((acc, grade) => acc + grade.finalGrade, 0) / grades.length;
    
    const content = `
      <h3>Relatório Completo do Aluno</h3>
      <p><strong>Nome:</strong> ${student.fullName}</p>
      <p><strong>Matrícula:</strong> ${student.registrationNumber}</p>
      <p><strong>Email:</strong> ${student.email}</p>
      <p><strong>Telefone:</strong> ${student.phone}</p>
      <p><strong>Status:</strong> ${student.status === 'active' ? 'Ativo' : 'Inativo'}</p>
      <p><strong>Data de Matrícula:</strong> ${new Date(student.enrollmentDate).toLocaleDateString('pt-BR')}</p>
      <p><strong>Data de Geração:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      
      <h4>Resumo Acadêmico</h4>
      <p><strong>Média Geral:</strong> ${gradesAverage.toFixed(2)}</p>
      <p><strong>Total de Disciplinas:</strong> ${grades.length}</p>
      <p><strong>Disciplinas Aprovadas:</strong> ${grades.filter(g => g.status === 'approved').length}</p>
      <p><strong>Taxa de Aprovação:</strong> ${((grades.filter(g => g.status === 'approved').length / grades.length) * 100).toFixed(1)}%</p>
      
      <h4>Notas por Disciplina</h4>
      <table>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Média Final</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${grades.map(grade => `
            <tr>
              <td>${grade.disciplineName}</td>
              <td>${grade.finalGrade}</td>
              <td>${grade.status === 'approved' ? 'Aprovado' : grade.status === 'recovery' ? 'Recuperação' : 'Reprovado'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h4>Cronograma Atual</h4>
      <table>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Horário</th>
            <th>Disciplina</th>
            <th>Instrutor</th>
          </tr>
        </thead>
        <tbody>
          ${schedule.map(day => 
            day.classes.map(cls => `
              <tr>
                <td>${day.day}</td>
                <td>${cls.time}</td>
                <td>${cls.subject}</td>
                <td>${cls.instructor}</td>
              </tr>
            `).join('')
          ).join('')}
        </tbody>
      </table>
    `;

    generatePDF({
      title: `Relatório Completo - ${student.fullName}`,
      content,
      fileName: `relatorio_completo_${student.fullName.replace(/\s+/g, '_').toLowerCase()}`
    });
  }

  private static downloadPDF(htmlContent: string, fileName: string): void {
    // Criar um iframe oculto para imprimir
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Escrever o conteúdo no iframe
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      // Aguardar o carregamento e então imprimir
      iframe.onload = () => {
        iframe.contentWindow?.print();
        
        // Remover o iframe após um tempo
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }
  }
}
