import React from 'react';
import BackupRestore from '../components/export/BackupRestore';
import { Database } from 'lucide-react';

const Backup = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Database className="text-accent-400" /> Respaldo de Información
        </h1>
        <p className="text-slate-400 mt-1">
          Gestiona tus copias de seguridad locales y asegura la portabilidad de tus datos.
        </p>
      </div>

      <BackupRestore />
      
      <div className="mt-12 p-6 rounded-3xl bg-primary-900/10 border border-primary-800">
        <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-widest">Preguntas Frecuentes</h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-200">¿Mis datos están seguros en el ZIP?</p>
            <p className="text-xs text-slate-500 mt-1">Sí, los campos sensibles (estudiantes, incidencias) permanecen encriptados con AES-256 dentro del archivo exportado.</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">¿Puedo abrir el backup en otro dispositivo?</p>
            <p className="text-xs text-slate-500 mt-1">Sí, siempre y cuando instales Docente SIS en el nuevo dispositivo y uses EL MISMO PIN maestro.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;
