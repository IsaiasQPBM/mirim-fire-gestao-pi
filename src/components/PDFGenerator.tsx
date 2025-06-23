
import React from 'react';

interface PDFGeneratorProps {
  title: string;
  content: any;
  fileName: string;
}

export const generatePDF = ({ title, content, fileName }: PDFGeneratorProps) => {
  // Mock PDF generation function
  console.log(`Generating PDF: ${fileName}`);
  
  // Create a simple HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { width: 100px; height: 100px; margin: 0 auto 20px; }
        .content { margin: 20px 0; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ</h1>
        <h2>Projeto Bombeiro Mirim</h2>
        <h3>${title}</h3>
      </div>
      <div class="content">
        ${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </div>
      <div class="footer">
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        <p>CBMEPI - Projeto Bombeiro Mirim</p>
      </div>
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default generatePDF;
