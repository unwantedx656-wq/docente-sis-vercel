import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Curso } from '../lib/db/database';
import { decrypt } from '../lib/crypto/encryption';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Check, X, Minus, Filter, Save } from 'lucide-react';

const Asistencia = () => {
  const { getSessionKey } = useAuth();
  const cursos = useLiveQuery(() => db.cursos.toArray()) ?? [];
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  const [rawAlumnos, setRawAlumnos] = useState<any[]>([]);
  const [decryptedAlumnos, setDecryptedAlumnos] = useState<any[]>([]);
  const [asistencia, setAsistencia] = useState<Record<number, 'presente' | 'falta' | 'justificado'>>({});

  useEffect(() => {
    if (selectedCursoId) {
       // En un sistema real, los alumnos estarían vinculados a cursos. 
       // Aquí cargaremos todos para la demo de la funcionalidad.
       db.alumnos.toArray().then(setRawAlumnos);
    }
  }, [selectedCursoId]);

  useEffect(() => {
    decryptList();
  }, [rawAlumnos]);

  const decryptList = async () => {
    const key = getSessionKey();
    if (!key || rawAlumnos.length === 0) return;

    const decrypted = await Promise.all(rawAlumnos.map(async (a) => {
      try {
        return {
          id: a.id,
          nombreCompleto: `${await decrypt(a.nombreEnc, a.iv, key)} ${await decrypt(a.apellidosEnc, a.iv, key)}`,
        };
      } catch (e) {
        return { id: a.id, nombreCompleto: '[Error]' };
      }
    }));
    setDecryptedAlumnos(decrypted);
  };

  const handleSetStatus = (id: number, status: 'presente' | 'falta' | 'justificado') => {
    setAsistencia(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Control de Asistencia</h1>
          <p className="text-slate-400">Toma de asistencia diaria por curso.</p>
        </div>
        <Button className="gap-2" disabled={!selectedCursoId}>
          <Save size={18} /> Guardar Registro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="p-4 bg-primary-900 shadow-none border-primary-800">
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Seleccionar Curso</label>
                  <select 
                    className="input-field"
                    onChange={e => setSelectedCursoId(Number(e.target.value))}
                  >
                    <option value="">Selecciona...</option>
                    {cursos.map((c: Curso) => <option key={c.id} value={c.id}>{c.nombre} ({c.grado})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Fecha</label>
                  <input type="date" className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
             </div>
          </Card>
        </div>

        <div className="md:col-span-2">
           {!selectedCursoId ? (
             <div className="h-64 flex items-center justify-center bg-primary-900/20 rounded-3xl border border-dashed border-primary-800 text-slate-600">
                <p>Selecciona un curso para cargar la lista de alumnos.</p>
             </div>
           ) : (
             <div className="space-y-3">
                {decryptedAlumnos.map((alumno) => (
                  <Card key={alumno.id} className="p-4 flex items-center justify-between group hover:border-accent-500/30 transition-all">
                    <span className="font-medium text-slate-200">{alumno.nombreCompleto}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSetStatus(alumno.id, 'presente')}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          asistencia[alumno.id] === 'presente' 
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                            : "bg-primary-800 text-slate-500 hover:text-slate-200"
                        )}
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        onClick={() => handleSetStatus(alumno.id, 'falta')}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          asistencia[alumno.id] === 'falta' 
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
                            : "bg-primary-800 text-slate-500 hover:text-slate-200"
                        )}
                      >
                        <X size={20} />
                      </button>
                      <button 
                        onClick={() => handleSetStatus(alumno.id, 'justificado')}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          asistencia[alumno.id] === 'justificado' 
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                            : "bg-primary-800 text-slate-500 hover:text-slate-200"
                        )}
                      >
                        <Minus size={20} />
                      </button>
                    </div>
                  </Card>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Asistencia;
