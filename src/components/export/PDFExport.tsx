import React, { useState } from 'react';
import Button from '../ui/Button';
import { FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface PDFExportProps {
  data: any[];
  title: string;
  fileName: string;
}

const PDFExport: React.FC<PDFExportProps> = ({ data, title, fileName }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Estilos y Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Docente SIS', 20, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('REPORTE PEDAGÓGICO OFICIAL', pageWidth - 20, 25, { align: 'right' });
      
      // Título del Reporte
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.text(title.toUpperCase(), 20, 55);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 60, pageWidth - 20, 60);
      
      // Contenido
      doc.setFontSize(11);
      let y = 75;
      
      data.forEach((item, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${item.nombre || item.titulo || 'Registro'}`, 25, y);
        y += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        const detail = item.dni || item.grado || item.fecha || '';
        if (detail) {
          doc.text(`Detalle: ${detail}`, 30, y);
          y += 10;
        } else {
          y += 5;
        }
        
        doc.setTextColor(30, 41, 59);
        y += 5;
      });
      
      // Footer
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Generado por Docente SIS - ${new Date().toLocaleString()} - Página ${i} de ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Error al generar el PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="gap-2 font-bold bg-primary-900/50 border-primary-800" 
      onClick={handleExport}
      isLoading={loading}
    >
      <FileText size={16} />
      Exportar PDF
    </Button>
  );
};

export default PDFExport;
