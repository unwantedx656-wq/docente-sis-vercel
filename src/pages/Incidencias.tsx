import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, IncidenciaEncrypted } from '../lib/db/database';
import { decrypt } from '../lib/crypto/encryption';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import IncidenciaForm from '../components/forms/IncidenciaForm';
import { AlertCircle, Plus, Search, Calendar, User, Trash2 } from 'lucide-react';

const Incidencias = () => {
  const { getSessionKey } = useAuth();
  const rawIncidencias = useLiveQuery(() => db.incidencias.toArray()) ?? [];
  const rawAlumnos = useLiveQuery(() => db.alumnos.toArray()) ?? [];
  
  const [decryptedIncidencias, setDecryptedIncidencias] = useState<any[]>([]);
  const [decryptedAlumnos, setDecryptedAlumnos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<number | null>(null);

  useEffect(() => {
    decryptAlumnos();
  }, [rawAlumnos]);

  useEffect(() => {
    decryptIncidencias();
  }, [rawIncidencias, decryptedAlumnos]);

  const decryptAlumnos = async () => {
    const key = getSessionKey();
    if (!key || rawAlumnos.length === 0) return;
    
    try {
      const decrypted = await Promise.all(rawAlumnos.map(async (a) => {
        try {
          const nombre = await decrypt(a.nombreEnc, a.iv, key);
          const apellidos = await decrypt(a.apellidosEnc, a.iv, key);
          return { id: a.id, fullName: `${nombre} ${apellidos}` };
        } catch {
          return { id: a.id, fullName: 'Error de Decriptación' };
        }
      }));
      setDecryptedAlumnos(decrypted);
    } catch (e) {
      console.error('Alumnos Decryption Error:', e);
    }
  };

  const decryptIncidencias = async () => {
    const key = getSessionKey();
    if (!key || rawIncidencias.length === 0) return;

    try {
      const decrypted = await Promise.all(rawIncidencias.map(async (i) => {
        try {
          const descripcion = await decrypt(i.descripcionEnc, i.iv, key);
          const alumno = decryptedAlumnos.find(a => a.id === i.alumnoId);
          return { 
            ...i, 
            descripcion, 
            alumnoName: alumno?.fullName || `ID: ${i.alumnoId}`
          };
        } catch (e) {
          return { ...i, descripcion: '[Error de Decriptación]', alumnoName: '?' };
        }
      }));
      setDecryptedIncidencias(decrypted);
    } catch (e) {
      console.error('Incidencias Decryption Error:', e);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este registro de incidencia?')) {
      await db.incidencias.delete(id);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Bitácora de Incidencias</h1>
          <p className="text-slate-400">Registros confidenciales y seguimiento pedagógico.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-red-500/10">
          <Plus size={20} /> Nueva Incidencia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decryptedIncidencias.map((inc) => (
          <Card key={inc.id} className="border-l-4 border-l-red-500 bg-red-500/5 group hover:shadow-xl transition-all duration-300">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-red-500/80">
                  <AlertCircle size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em]">Reporte de Conducta</span>
                </div>
                <button onClick={() => handleDelete(inc.id!)} className="p-1 px-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
             </div>

             <div className="relative mb-6">
                <span className="absolute -left-2 -top-2 text-4xl text-red-500/10 font-serif">"</span>
                <p className="text-slate-200 text-sm leading-relaxed relative z-10 font-medium">
                  {inc.descripcion}
                </p>
             </div>

             <div className="flex items-center justify-between pt-4 border-t border-primary-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-800/80 rounded-full flex items-center justify-center text-[10px] text-accent-400 border border-primary-700">
                    {inc.alumnoName?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight">{inc.alumnoName}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-black">Estudiante</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-slate-400 justify-end">
                    <Calendar size={12} className="opacity-50" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{new Date(inc.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
             </div>
          </Card>
        ))}

        {decryptedIncidencias.length === 0 && (
          <div className="col-span-full py-24 text-center bg-primary-900/10 rounded-[2.5rem] border-2 border-dashed border-primary-800/50">
            <div className="w-16 h-16 bg-primary-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="opacity-20" />
            </div>
            <p className="text-slate-500 font-medium">No hay incidencias reportadas hoy.</p>
            <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-widest font-black">Todo bajo control</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Incidencia"
      >
        <div className="space-y-6 text-left">
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seleccionar Estudiante</label>
              <select 
                className="input-field appearance-none"
                onChange={e => setSelectedAlumnoId(Number(e.target.value))}
                value={selectedAlumnoId || ''}
              >
                <option value="">Selecciona un estudiante...</option>
                {decryptedAlumnos.map(al => (
                  <option key={al.id} value={al.id}>{al.fullName}</option>
                ))}
              </select>
           </div>
           
           {selectedAlumnoId ? (
             <div className="pt-2 border-t border-primary-800/50">
               <IncidenciaForm 
                 alumnoId={selectedAlumnoId} 
                 onSuccess={() => { setIsModalOpen(false); setSelectedAlumnoId(null); }} 
                 onCancel={() => { setIsModalOpen(false); setSelectedAlumnoId(null); }} 
               />
             </div>
           ) : (
             <div className="p-8 text-center bg-primary-900/10 rounded-2xl border border-dashed border-primary-800">
                <p className="text-xs text-slate-500">Selecciona un alumno para habilitar el formulario.</p>
             </div>
           )}
        </div>
      </Modal>
    </div>
  );
};

export default Incidencias;
