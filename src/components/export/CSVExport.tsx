import React from 'react';
import Button from '../ui/Button';
import { FileSpreadsheet } from 'lucide-react';
import { downloadCSV } from '../../lib/utils/export';

interface CSVExportProps {
  data: any[];
  fileName: string;
}

const CSVExport: React.FC<CSVExportProps> = ({ data, fileName }) => {
  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="gap-2" 
      onClick={() => downloadCSV(data, fileName)}
    >
      <FileSpreadsheet size={16} />
      Exportar CSV
    </Button>
  );
};

export default CSVExport;
