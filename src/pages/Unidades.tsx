import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Curso, Unidad, Sesion } from '../lib/db/database';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import UnidadForm from '../components/forms/UnidadForm';
import SesionForm from '../components/forms/SesionForm';
import { 
  Plus, 
  BookOpen, 
  Trash2, 
  ArrowRight, 
  Book, 
  ChevronDown, 
  ChevronUp, 
  Edit2, 
  Calendar,
  Sparkles,
  FileText
} from 'lucide-react';

const Unidades = () => {
  const navigate = useNavigate();
  const cursos = useLiveQuery(() => db.cursos.toArray()) ?? [];
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  const [expandedUnidadId, setExpandedUnidadId] = useState<number | null>(null);
  
  const unidades = useLiveQuery(
    async () => {
      if (!selectedCursoId) return [] as Unidad[];
      return db.unidades.where('cursoId').equals(selectedCursoId).sortBy('orden');
    },
    [selectedCursoId]
  ) ?? [];

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingUnidad, setEditingUnidad] = useState<any>(null);
  const [targetUnidadId, setTargetUnidadId] = useState<number | null>(null);

  const handleDeleteUnidad = async (id: number) => {
    if (confirm('¿Eliminar esta unidad? Se perderán todas sus sesiones.')) {
      await db.unidades.delete(id);
      await db.sesiones.where('unidadId').equals(id).delete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Estructura Curricular</h1>
          <p className="text-slate-400 mt-1">Navega por tus cursos, unidades y sesiones dinámicamente.</p>
        </div>
        {selectedCursoId && (
          <Button onClick={() => setIsUnitModalOpen(true)} className="gap-2 shadow-lg shadow-primary-500/20">
            <Plus size={20} /> Nueva Unidad
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selector de Curso */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Tus Cursos</h3>
          <div className="space-y-2">
            {cursos.map((curso: Curso) => (
              <button
                key={curso.id}
                onClick={() => {
                  setSelectedCursoId(curso.id!);
                  setExpandedUnidadId(null);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-5 rounded-2xl border text-left transition-all duration-300",
                  selectedCursoId === curso.id 
                    ? "bg-accent-600/10 border-accent-500/50 text-accent-400 shadow-[0_0_20px_rgba(var(--accent-500-rgb),0.1)]" 
                    : "bg-primary-900/30 border-primary-800/50 text-slate-500 hover:border-primary-700 hover:text-slate-300"
                )}
              >
                <div className={cn("p-2 rounded-lg", selectedCursoId === curso.id ? "bg-accent-500/20" : "bg-primary-800")}>
                  <Book size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                   <span className="font-bold block truncate">{curso.nombre}</span>
                   <span className="text-[10px] opacity-60 uppercase">{curso.grado}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Listado Jerárquico de Unidades/Sesiones */}
        <div className="lg:col-span-3 space-y-4">
          {!selectedCursoId ? (
            <div className="h-[400px] flex flex-col items-center justify-center py-20 text-slate-600 bg-primary-900/10 rounded-[2.5rem] border-2 border-dashed border-primary-800/50">
              <div className="w-20 h-20 rounded-full bg-primary-800/30 flex items-center justify-center mb-6">
                <BookOpen size={40} className="opacity-20" />
              </div>
              <p className="text-lg font-medium opacity-50">Selecciona un curso para empezar la planificación</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {unidades.map((unidad: Unidad) => (
                <div key={unidad.id} className="group">
                  <div 
                    className={cn(
                      "flex items-stretch rounded-[1.5rem] border transition-all duration-300 cursor-pointer overflow-hidden",
                      expandedUnidadId === unidad.id 
                        ? "bg-primary-900/50 border-primary-700 shadow-xl" 
                        : "bg-primary-900/30 border-primary-800 hover:border-primary-700"
                    )}
                    onClick={() => setExpandedUnidadId(expandedUnidadId === unidad.id ? null : unidad.id!)}
                  >
                    <div className={cn(
                      "w-14 flex items-center justify-center text-lg font-black border-r transition-colors",
                      expandedUnidadId === unidad.id ? "bg-accent-600/20 text-accent-400 border-accent-500/20" : "bg-primary-800 text-slate-600 border-primary-800"
                    )}>
                      {unidad.orden}
                    </div>
                    <div className="flex-1 p-6">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className={cn("text-xl font-bold transition-colors", expandedUnidadId === unidad.id ? "text-white" : "text-slate-300 group-hover:text-white")}>
                               {unidad.titulo}
                             </h4>
                             <p className="text-sm text-slate-500 mt-1">{unidad.objetivo || 'Sin objetivo definido'}</p>
                          </div>
                          <div className="flex gap-2">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setEditingUnidad(unidad);
                                 setIsUnitModalOpen(true);
                               }}
                               className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                             >
                                <Edit2 size={18} />
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDeleteUnidad(unidad.id!);
                               }}
                               className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
                             >
                                <Trash2 size={18} />
                             </button>
                             <div className="ml-2 py-2 px-1">
                                {expandedUnidadId === unidad.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* VISTA ANIDADA DE SESIONES (ESTILO PLATZI) */}
                  {expandedUnidadId === unidad.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="ml-14 mt-2 p-6 bg-primary-950/40 border-l border-b border-r border-primary-800/50 rounded-b-[1.5rem] rounded-tr-[1.5rem] space-y-4"
                    >
                       <div className="flex justify-between items-center mb-4">
                          <h5 className="text-xs font-bold text-accent-500/70 uppercase tracking-widest flex items-center gap-2">
                             <FileText size={14} /> Contenido de la Unidad
                          </h5>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 border-accent-500/30 font-bold gap-2 rounded-xl"
                            onClick={() => {
                              setTargetUnidadId(unidad.id!);
                              setIsSessionModalOpen(true);
                            }}
                          >
                             <Plus size={16} /> Nueva Sesión
                          </Button>
                       </div>

                       <div className="space-y-3">
                          <SessionList unidadId={unidad.id!} />
                       </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <Modal 
        isOpen={isUnitModalOpen} 
        onClose={() => { setIsUnitModalOpen(false); setEditingUnidad(null); }} 
        title={editingUnidad ? 'Editar Unidad' : 'Nueva Unidad'}
      >
        <UnidadForm 
          cursoId={selectedCursoId!} 
          onSuccess={() => { setIsUnitModalOpen(false); setEditingUnidad(null); }}
          onCancel={() => { setIsUnitModalOpen(false); setEditingUnidad(null); }}
          initialData={editingUnidad}
        />
      </Modal>

      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Crear Sesión de Clase"
      >
        <SesionForm 
          unidadId={targetUnidadId!}
          onSuccess={() => setIsSessionModalOpen(false)}
          onCancel={() => setIsSessionModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// COMPONENTE PARA LA LISTA DE SESIONES
const SessionList = ({ unidadId }: { unidadId: number }) => {
  const navigate = useNavigate();
  const sesiones = useLiveQuery(
    () => db.sesiones.where('unidadId').equals(unidadId).toArray(),
    [unidadId]
  ) ?? [];

  const handleDeleteSession = async (id: number) => {
    if (confirm('¿Eliminar esta sesión de clase?')) {
      await db.sesiones.delete(id);
    }
  };

  if (sesiones.length === 0) {
    return (
      <div className="text-center py-8 bg-primary-900/10 rounded-2xl border border-dashed border-primary-800">
        <p className="text-sm text-slate-500 font-medium">No hay sesiones en esta unidad.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {sesiones.map((sesion: Sesion, i: number) => (
        <div key={sesion.id} className="flex items-center gap-4 p-4 rounded-xl bg-primary-900/40 border border-primary-800 hover:border-accent-500/30 transition-all group">
           <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center text-xs font-bold text-slate-500">
              {i + 1}
           </div>
           <div className="flex-1">
              <h6 className="text-[15px] font-semibold text-slate-200 group-hover:text-accent-400 transition-colors uppercase tracking-tight">
                {sesion.titulo}
              </h6>
              <div className="flex gap-3 mt-1 underline-none">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                   <Calendar size={10} /> {sesion.fecha}
                 </p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                   {sesion.duracion}
                 </p>
              </div>
           </div>
           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-2 text-accent-500 hover:bg-accent-500/10 rounded-lg"
                title="Diseñar con IA"
              >
                 <Sparkles size={16} />
              </button>
              <button 
                onClick={() => handleDeleteSession(sesion.id!)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                 <Trash2 size={16} />
              </button>
              <button 
                className="p-2 text-slate-300 hover:bg-white/10 rounded-lg ml-2"
                onClick={() => navigate('/sesiones')}
              >
                 <ArrowRight size={18} />
              </button>
           </div>
        </div>
      ))}
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import { useNavigate } from 'react-router-dom';

export default Unidades;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Unidades;
