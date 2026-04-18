import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Curso } from '../lib/db/database';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { Plus, Book, Trash2, Edit2, LayoutGrid } from 'lucide-react';
import { GRADOS, AREAS } from '../lib/utils/constants';

const Cursos = () => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Cursos</h1>
          <p className="text-slate-400">Administra las asignaturas que dictas este año.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={20} /> Nuevo Curso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso: Curso) => (
          <Card key={curso.id} className="group relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-accent-500/10 rounded-xl">
                <Book className="text-accent-400" size={24} />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingCurso(curso);
                    setFormData({ nombre: curso.nombre, grado: curso.grado, seccion: curso.seccion || '' });
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(curso.id!)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{curso.nombre}</h3>
            <p className="text-accent-400 font-medium text-sm mb-4">{curso.grado} - {curso.seccion || 'A'}</p>
            
            <div className="flex gap-4 pt-4 border-t border-primary-900 mt-4">
              <div className="flex-1 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Unidades</p>
                <p className="text-lg font-bold text-slate-200">0</p>
              </div>
              <div className="w-px bg-primary-900" />
              <div className="flex-1 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Alumnos</p>
                <p className="text-lg font-bold text-slate-200">0</p>
              </div>
            </div>
          </Card>
        ))}

        {cursos.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-primary-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600 border border-primary-800">
              <LayoutGrid size={32} />
            </div>
            <h3 className="text-xl font-medium text-slate-300">No tienes cursos registrados</h3>
            <p className="text-slate-500 mt-2">Comienza agregando tu primer curso del año académico.</p>
            <Button variant="ghost" className="mt-6" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Registrar primer curso
            </Button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCurso ? 'Editar Curso' : 'Nuevo Curso'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Nombre del Curso / Área</label>
            <select 
              required
              className="input-field"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            >
              <option value="">Selecciona un área</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Grado</label>
              <select 
                required
                className="input-field"
                value={formData.grado}
                onChange={e => setFormData({...formData, grado: e.target.value})}
              >
                {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Sección</label>
              <input 
                type="text" 
                className="input-field"
                value={formData.seccion}
                placeholder="Ej: A"
                onChange={e => setFormData({...formData, seccion: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingCurso ? 'Guardar Cambios' : 'Registrar Curso'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Cursos;
