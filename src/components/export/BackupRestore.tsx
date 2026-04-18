import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { exportProjectBackup, restoreProjectBackup } from '../../lib/db/backupManager';

const BackupRestore = () => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportProjectBackup();
    } catch (err) {
      alert('Error al exportar backup');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('¡ADVERTENCIA! Restaurar un backup SOBREESCRIBIRÁ todos los datos actuales. ¿Deseas continuar?')) {
      return;
    }

    setLoading(true);
    try {
      await restoreProjectBackup(file);
      alert('Backup restaurado con éxito. La página se recargará.');
      window.location.reload();
    } catch (err) {
      alert('Error al restaurar backup: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent-500/20 bg-accent-500/5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-accent-600/20 rounded-2xl flex items-center justify-center text-accent-400">
            <Download size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">Exportar Copia de Seguridad</h3>
            <p className="text-slate-400 text-sm mt-1">
              Descarga todos tus datos (cursos, alumnos encriptados, sesiones) en un archivo ZIP seguro.
            </p>
          </div>
          <Button onClick={handleExport} isLoading={loading}>
            Descargar ZIP
          </Button>
        </div>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-amber-600/20 rounded-2xl flex items-center justify-center text-amber-400">
            <Upload size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">Restaurar Copia de Seguridad</h3>
            <p className="text-slate-400 text-sm mt-1">
              Sube un archivo ZIP previamente exportado para recuperar tus datos.
            </p>
          </div>
          <input 
            type="file" 
            accept=".zip" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleRestore}
          />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} isLoading={loading}>
            Seleccionar Archivo
          </Button>
        </div>
      </Card>

      <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
        <AlertTriangle size={20} className="shrink-0" />
        <p>
          Los backups contienen datos encriptados. Necesitarás el MISMO PIN maestro 
          que usaste al momento de crear el backup para poder acceder a los datos de los alumnos tras la restauración.
        </p>
      </div>
    </div>
  );
};

export default BackupRestore;
