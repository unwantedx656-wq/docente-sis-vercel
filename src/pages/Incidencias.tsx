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
  const [decryptedIncidencias, setDecryptedIncidencias] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<number | null>(null);

  useEffect(() => {
    decryptAll();
  }, [rawIncidencias]);

  const decryptAll = async () => {
    const key = getSessionKey();
    if (!key || rawIncidencias.length === 0) return;

    const decrypted = await Promise.all(rawIncidencias.map(async (i: IncidenciaEncrypted) => {
      try {
        // En un sistema real, buscaríamos el nombre del alumno.
        // Simulamos búsqueda por ahora.
        return {
          ...i,
          descripcion: await decrypt(i.descripcionEnc, i.iv, key)
        };
      } catch (e) {
        return { ...i, descripcion: '[Error de Decriptación]' };
      }
    }));
    setDecryptedIncidencias(decrypted);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este registro de incidencia?')) {
      await db.incidencias.delete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Libro de Incidencias</h1>
          <p className="text-slate-400">Registros disciplinarios y observaciones confidenciales.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={20} /> Nueva Incidencia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decryptedIncidencias.map((inc) => (
          <Card key={inc.id} className="border-l-4 border-l-red-500 bg-red-500/5 group">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Reporte Disciplinario</span>
                </div>
                <button onClick={() => handleDelete(inc.id!)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
             </div>

             <p className="text-slate-200 text-sm leading-relaxed mb-6">
               "{inc.descripcion}"
             </p>

             <div className="flex items-center justify-between pt-4 border-t border-primary-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-800 rounded-full flex items-center justify-center text-[10px] text-slate-400">
                    <User size={12} />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Alumno ID: {inc.alumnoId}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar size={12} />
                  <span className="text-[10px] uppercase font-bold">{new Date(inc.fecha).toLocaleDateString()}</span>
                </div>
             </div>
          </Card>
        ))}

        {decryptedIncidencias.length === 0 && (
          <div className="col-span-full py-24 text-center bg-primary-900/10 rounded-3xl border border-dashed border-primary-800">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-slate-500">No hay incidencias reportadas recientemente.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nueva Incidencia"
      >
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-400">Seleccionar Alumno</label>
          <select 
            className="input-field"
            onChange={e => setSelectedAlumnoId(Number(e.target.value))}
          >
            <option value="">Selecciona un alumno...</option>
            {/* Aquí poblaríamos con alumnos reales */}
            <option value="1">Demo Alumno A</option>
            <option value="2">Demo Alumno B</option>
          </select>
          {selectedAlumnoId && (
            <IncidenciaForm 
              alumnoId={selectedAlumnoId} 
              onSuccess={() => setIsModalOpen(false)} 
              onCancel={() => setIsModalOpen(false)} 
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Incidencias;
