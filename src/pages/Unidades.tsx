import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Curso, Unidad } from '../lib/db/database';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import UnidadForm from '../components/forms/UnidadForm';
import { Plus, BookOpen, Trash2, ArrowRight, Book } from 'lucide-react';

const Unidades = () => {
  const cursos = useLiveQuery(() => db.cursos.toArray()) ?? [];
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  
  const unidades = useLiveQuery(
    async () => {
      if (!selectedCursoId) return [] as Unidad[];
      return db.unidades.where('cursoId').equals(selectedCursoId).sortBy('orden');
    },
    [selectedCursoId]
  ) ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnidad, setEditingUnidad] = useState<any>(null);

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar esta unidad? Se perderán todas sus sesiones.')) {
      await db.unidades.delete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Unidades Didácticas</h1>
          <p className="text-slate-400">Planifica la estructura macro de tus cursos.</p>
        </div>
        {selectedCursoId && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={20} /> Nueva Unidad
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selector de Curso */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">Seleccionar Curso</h3>
          <div className="space-y-2">
            {cursos.map((curso: Curso) => (
              <button
                key={curso.id}
                onClick={() => setSelectedCursoId(curso.id!)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                  selectedCursoId === curso.id 
                    ? "bg-accent-600/10 border-accent-500/50 text-accent-400" 
                    : "bg-primary-900/50 border-primary-800 text-slate-400 hover:border-primary-700"
                )}
              >
                <Book size={18} />
                <span className="font-medium truncate">{curso.nombre}</span>
              </button>
            ))}
            {cursos.length === 0 && (
              <p className="text-sm text-slate-600 italic px-2">Registra un curso primero.</p>
            )}
          </div>
        </div>

        {/* Listado de Unidades */}
        <div className="lg:col-span-3 space-y-4">
          {!selectedCursoId ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-slate-600 bg-primary-900/20 rounded-3xl border border-dashed border-primary-800">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p>Selecciona un curso de la izquierda para ver sus unidades.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {unidades.map((unidad: Unidad, index: number) => (
                <Card key={unidad.id} className="p-0 overflow-hidden group">
                  <div className="flex items-stretch">
                    <div className="w-16 bg-primary-900 flex items-center justify-center text-slate-500 font-bold border-r border-primary-800">
                      {unidad.orden}
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-white group-hover:text-accent-400 transition-colors">
                            {unidad.titulo}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1">{unidad.objetivo || 'Sin descripción'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingUnidad(unidad);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-white"
                          >
                            <Plus size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(unidad.id!)}
                            className="p-2 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 bg-accent-600/5 hover:bg-accent-600 group-hover:bg-accent-600 text-accent-500 group-hover:text-white transition-all flex items-center justify-center">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </Card>
              ))}

              {unidades.length === 0 && (
                <div className="py-16 text-center bg-primary-900/30 rounded-3xl border border-primary-800/50">
                  <p className="text-slate-500">Este curso no tiene unidades registradas todavía.</p>
                  <Button variant="ghost" className="mt-4" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Agregar primera unidad
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingUnidad(null); }} 
        title={editingUnidad ? 'Editar Unidad' : 'Nueva Unidad'}
      >
        <UnidadForm 
          cursoId={selectedCursoId!} 
          onSuccess={() => { setIsModalOpen(false); setEditingUnidad(null); }}
          onCancel={() => { setIsModalOpen(false); setEditingUnidad(null); }}
          initialData={editingUnidad}
        />
      </Modal>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Unidades;
