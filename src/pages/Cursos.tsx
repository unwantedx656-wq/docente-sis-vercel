import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Curso } from '../lib/db/database';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { Plus, Book, Trash2, Edit2, LayoutGrid, ArrowRight, Sparkles } from 'lucide-react';
import { GRADOS, AREAS } from '../lib/utils/constants';
import { useNavigate } from 'react-router-dom';

const Cursos = () => {
  const navigate = useNavigate();
  const cursos = useLiveQuery(() => db.cursos.toArray()) ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<any>(null);
  const [formData, setFormData] = useState({ nombre: '', grado: GRADOS[0], seccion: '' });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCurso) {
      await db.cursos.update(editingCurso.id, formData);
    } else {
      await db.cursos.add(formData);
    }
    setIsModalOpen(false);
    setEditingCurso(null);
    setFormData({ nombre: '', grado: GRADOS[0], seccion: '' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este curso? Se perderán también sus unidades y sesiones.')) {
      await db.cursos.delete(id);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-accent-500/10 text-accent-400 rounded-xl">
              <LayoutGrid size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Gestión de Cursos</h1>
              <p className="text-slate-400 font-medium">Administra tus áreas curriculares.</p>
           </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-primary-500/10 font-bold">
          <Plus size={20} /> Nuevo Curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {cursos.map((curso: Curso) => (
          <CourseCard 
            key={curso.id} 
            curso={curso} 
            onEdit={() => {
              setEditingCurso(curso);
              setFormData({ nombre: curso.nombre, grado: curso.grado, seccion: curso.seccion || '' });
              setIsModalOpen(true);
            }}
            onDelete={() => handleDelete(curso.id!)}
            onClick={() => navigate(`/unidades?cursoId=${curso.id}`)}
          />
        ))}

        {cursos.length === 0 && (
          <div className="col-span-full py-24 text-center bg-primary-900/10 rounded-[2.5rem] border-2 border-dashed border-primary-800/50">
            <div className="w-20 h-20 bg-primary-800/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-700">
              <Book size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-300 italic">Sin cursos activos</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Comienza agregando tu primer curso del año académico para habilitar las unidades de aprendizaje.</p>
            <Button variant="primary" className="mt-8 font-bold" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Registrar primer curso
            </Button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCurso ? 'Editar Configuración del Curso' : 'Registrar Nuevo Curso'}
      >
        <form onSubmit={handleSave} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Área Curricular / Nombre</label>
            <select 
              required
              className="input-field appearance-none"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            >
              <option value="">Selecciona el área...</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Grado</label>
              <select 
                required
                className="input-field appearance-none"
                value={formData.grado}
                onChange={e => setFormData({...formData, grado: e.target.value})}
              >
                {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Sección</label>
              <input 
                type="text" 
                className="input-field"
                value={formData.seccion}
                placeholder="Ej: A, B o Única"
                onChange={e => setFormData({...formData, seccion: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1 font-bold shadow-lg shadow-primary-500/20">
              {editingCurso ? 'Guardar Cambios' : 'Activar Curso'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const CourseCard = ({ curso, onEdit, onDelete, onClick }: { curso: Curso, onEdit: () => void, onDelete: () => void, onClick: () => void }) => {
  const unidadesCount = useLiveQuery(() => db.unidades.where('cursoId').equals(curso.id!).count()) ?? 0;
  const alumnosCount = useLiveQuery(() => db.alumnos.where('grupoId').equals(curso.id!).count()) ?? 0;

  return (
    <Card className="group relative overflow-hidden bg-primary-900/30 border-primary-800/80 hover:border-accent-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-950">
      <div className="p-1">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 bg-accent-600/10 text-accent-400 rounded-2xl flex items-center justify-center border border-accent-500/20 group-hover:bg-accent-600 group-hover:text-white transition-all duration-500 shadow-inner">
            <Book size={24} />
          </div>
          <div className="flex gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 text-slate-500 hover:text-accent-400 rounded-lg hover:bg-white/5"><Edit2 size={16} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/5"><Trash2 size={16} /></button>
          </div>
        </div>
        
        <div className="cursor-pointer" onClick={onClick}>
           <h3 className="text-2xl font-black text-white leading-tight pr-4">{curso.nombre}</h3>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">{curso.grado} • Sección {curso.seccion || 'Única'}</p>
           
           <div className="flex gap-6 mt-8 py-4 border-t border-primary-800/50">
             <div>
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Unidades</p>
               <p className="text-xl font-black text-slate-200">{unidadesCount}</p>
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Estudiantes</p>
               <div className="flex items-baseline gap-1">
                 <p className="text-xl font-black text-emerald-500">{alumnosCount}</p>
                 <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Registrados</span>
               </div>
             </div>
           </div>
           
           <div className="mt-4 flex items-center gap-2 text-accent-500 group-hover:gap-3 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest">Ver planificación</span>
              <ArrowRight size={14} />
           </div>
        </div>
      </div>
    </Card>
  );
};

export default Cursos;

export default Cursos;
