import React, { useState } from 'react';
import Button from '../ui/Button';
import { db } from '../../lib/db/database';
import { Sparkles } from 'lucide-react';
import { generateContent } from '../../lib/ai/gemini';

interface UnidadFormProps {
  cursoId: number;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const UnidadForm: React.FC<UnidadFormProps> = ({ cursoId, onSuccess, onCancel, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    orden: initialData?.orden || 1,
    objetivo: initialData?.objetivo || ''
  });

  const handleIAFill = async () => {
    if (!formData.titulo) {
      alert('Ingresa un título para la unidad.');
      return;
    }
    setAiLoading(true);
    try {
      const curso = await db.cursos.get(cursoId);
      const context = `Curso: ${curso?.nombre || 'General'}, Grado: ${curso?.grado || 'Secundaria'}`;
      const prompt = `Genera un objetivo pedagógico general (máximo 4 líneas) para una UNIDAD DIDÁCTICA titulada: "${formData.titulo}". Debe estar alineado al currículo MINEDU.`;
      
      const result = await generateContent(prompt, context);
      if (result.content) {
        setFormData(prev => ({ ...prev, objetivo: result.content }));
      }
    } catch (err) {
      console.error('IA Fail:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const unidadData = {
        ...formData,
        cursoId,
        orden: Number(formData.orden)
      };

      if (initialData?.id) {
        await db.unidades.update(initialData.id, unidadData);
      } else {
        await db.unidades.add(unidadData);
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving unit:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Título de la Unidad</label>
        <div className="relative">
          <input 
            type="text" 
            required 
            className="input-field pr-12"
            value={formData.titulo}
            onChange={e => setFormData({...formData, titulo: e.target.value})}
            placeholder="Ej: Unidad 1: Bases de la Programación"
          />
          <button 
             type="button"
             onClick={handleIAFill}
             disabled={aiLoading}
             className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 rounded-lg transition-all"
             title="Generar objetivo con IA"
           >
             {aiLoading ? <div className="w-4 h-4 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" /> : <Sparkles size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Orden de la Unidad</label>
        <input 
          type="number" 
          required 
          className="input-field"
          value={formData.orden}
          onChange={e => setFormData({...formData, orden: Number(e.target.value)})}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Objetivo General</label>
          {aiLoading && <span className="text-[10px] text-accent-400 animate-pulse font-bold">IA redactando...</span>}
        </div>
        <textarea 
          required
          className="input-field min-h-[120px] text-sm leading-relaxed"
          value={formData.objetivo}
          onChange={e => setFormData({...formData, objetivo: e.target.value})}
          placeholder="¿Qué aprenderán los alumnos en esta unidad?"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1 font-bold shadow-lg shadow-primary-500/20" isLoading={loading}>
          {initialData ? 'Actualizar Unidad' : 'Guardar Unidad'}
        </Button>
      </div>
    </form>
  );
};

export default UnidadForm;

export default UnidadForm;
