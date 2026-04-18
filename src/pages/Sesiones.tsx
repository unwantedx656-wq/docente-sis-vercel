import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Curso, Sesion, Unidad } from '../lib/db/database';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import SesionForm from '../components/forms/SesionForm';
import { Plus, Calendar, BookOpen, Trash2, Search, Clock, MapPin } from 'lucide-react';

const Sesiones = () => {
  const cursos = useLiveQuery(() => db.cursos.toArray()) ?? [];
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  
  const unidades = useLiveQuery(
    async () => {
      if (!selectedCursoId) return [] as Unidad[];
      return db.unidades.where('cursoId').equals(selectedCursoId).sortBy('orden');
    },
    [selectedCursoId]
  ) ?? [];

  const [selectedUnidadId, setSelectedUnidadId] = useState<number | null>(null);
  
  const sesiones = useLiveQuery(
    async () => {
      if (!selectedUnidadId) return [] as Sesion[];
      return db.sesiones.where('unidadId').equals(selectedUnidadId).reverse().sortBy('fecha');
    },
    [selectedUnidadId]
  ) ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSesion, setEditingSesion] = useState<any>(null);

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar esta sesión de clase?')) {
      await db.sesiones.delete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Sesiones de Clase</h1>
          <p className="text-slate-400">Diseña tus sesiones de aprendizaje y actividades.</p>
        </div>
        {selectedUnidadId && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={20} /> Nueva Sesión
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selector de Curso/Unidad */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">Curso</h3>
            <select 
              className="input-field"
              value={selectedCursoId || ''}
              onChange={e => {
                const id = Number(e.target.value);
                setSelectedCursoId(id);
                setSelectedUnidadId(null);
              }}
            >
              <option value="">Selecciona un curso</option>
              {cursos.map((c: Curso) => <option key={c.id} value={c.id}>{c.nombre} - {c.grado}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">Unidad</h3>
            <div className="space-y-2">
              {unidades.map((u: Unidad) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUnidadId(u.id!)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all",
                    selectedUnidadId === u.id 
                      ? "bg-accent-600/10 border-accent-500/50 text-accent-400" 
                      : "bg-primary-900/50 border-primary-800 text-slate-400 hover:border-primary-700"
                  )}
                >
                  <BookOpen size={16} />
                  <span className="font-medium truncate">U{u.orden}: {u.titulo}</span>
                </button>
              ))}
              {selectedCursoId && unidades.length === 0 && (
                <p className="text-sm text-slate-600 italic px-2">Sin unidades registradas.</p>
              )}
              {!selectedCursoId && (
                <p className="text-xs text-slate-600 px-2 italic">Selecciona un curso primero.</p>
              )}
            </div>
          </div>
        </div>

        {/* Listado de Sesiones */}
        <div className="lg:col-span-3">
          {!selectedUnidadId ? (
            <div className="h-full flex flex-col items-center justify-center py-24 text-slate-600 bg-primary-900/10 rounded-3xl border border-dashed border-primary-800">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p>Selecciona un curso y una unidad para ver las sesiones.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sesiones.map((sesion: Sesion) => (
                <Card key={sesion.id} className="p-6 hover:border-primary-700 transition-all group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-accent-500/20 text-accent-400 rounded">Sesión</span>
                            <span className="text-xs text-slate-500">{new Date(sesion.fecha).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                          </div>
                          <h4 className="text-xl font-bold text-white group-hover:text-accent-400 transition-colors">
                            {sesion.titulo}
                          </h4>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingSesion(sesion);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg"
                          >
                            <Calendar size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(sesion.id!)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock size={16} className="text-slate-600" />
                          <span className="text-xs">{sesion.duracion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin size={16} className="text-slate-600" />
                          <span className="text-xs">Aula Regular</span>
                        </div>
                      </div>

                      <div className="p-4 bg-primary-900/50 rounded-xl border border-primary-800">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Propósito de aprendizaje</p>
                        <p className="text-sm text-slate-300 line-clamp-2">{sesion.objetivo}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {sesiones.length === 0 && (
                <div className="py-20 text-center bg-primary-900/30 rounded-3xl border border-primary-800">
                  <p className="text-slate-500">No hay sesiones registradas en esta unidad.</p>
                  <Button variant="ghost" className="mt-4" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Crear primera sesión de clase
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingSesion(null); }} 
        title={editingSesion ? 'Editar Sesión' : 'Nueva Sesión de Aprendizaje'}
      >
        <SesionForm 
          unidadId={selectedUnidadId!} 
          onSuccess={() => { setIsModalOpen(false); setEditingSesion(null); }}
          onCancel={() => { setIsModalOpen(false); setEditingSesion(null); }}
          initialData={editingSesion}
        />
      </Modal>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Sesiones;
