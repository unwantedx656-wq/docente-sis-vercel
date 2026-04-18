import React, { useState } from 'react';
import Button from '../ui/Button';
import { FileText } from 'lucide-react';

interface PDFExportProps {
  data: any;
  title: string;
  fileName: string;
}

const PDFExport: React.FC<PDFExportProps> = ({ data, title, fileName }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    // Simulación de exportación PDF (Se recomienda usar jsPDF en un entorno real)
    // Para este prompt, simularemos la descarga exitosa
    setTimeout(() => {
      console.log('Generando PDF para:', title, data);
      alert(`Generando PDF: ${fileName}.pdf\n(En un entorno real aquí se usaría jsPDF)`);
      setLoading(false);
    }, 1500);
  };

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="gap-2" 
      onClick={handleExport}
      isLoading={loading}
    >
      <FileText size={16} />
      Exportar PDF
    </Button>
  );
};

export default PDFExport;
