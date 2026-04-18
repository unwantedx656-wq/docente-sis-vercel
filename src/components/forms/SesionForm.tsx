import React, { useState } from 'react';
import Button from '../ui/Button';
import { db } from '../../lib/db/database';
import { Sparkles, Wand2 } from 'lucide-react';
import { generateContent } from '../../lib/ai/gemini';

interface SesionFormProps {
  unidadId: number;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const SesionForm: React.FC<SesionFormProps> = ({ unidadId, onSuccess, onCancel, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
    duracion: initialData?.duracion || '90 min',
    objetivo: initialData?.objetivo || '',
    actividades: initialData?.actividades || ''
  });

  const handleIAFill = async () => {
    if (!formData.titulo) {
      alert('Por favor ingresa un título para la sesión primero.');
      return;
    }

    setAiLoading(true);
    try {
      const unidad = await db.unidades.get(unidadId);
      const curso = unidad ? await db.cursos.get(unidad.cursoId) : null;
      
      const context = `Curso: ${curso?.nombre || 'General'}, Grado: ${curso?.grado || 'Secundaria'}, Unidad: ${unidad?.titulo || ''}, Objetivo Unidad: ${unidad?.objetivo || ''}`;
      const prompt = `Genera un propósito de aprendizaje (máximo 3 líneas) y una secuencia didáctica (Inicio, Desarrollo, Cierre) para la sesión titulada: "${formData.titulo}". Formato: Texto plano estructurado.`;

      const result = await generateContent(prompt, context);
      
      if (result.content) {
        // Simple parsing: split by common headers or just append everything
        const parts = result.content.split('\n\n');
        setFormData(prev => ({
          ...prev,
          objetivo: parts[0] || '',
          actividades: parts.slice(1).join('\n\n') || result.content
        }));
      }
    } catch (err) {
      console.error('IA Generation Fail:', err);
      alert('No se pudo conectar con la IA en este momento.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sesionData = {
        ...formData,
        unidadId
      };

      if (initialData?.id) {
        await db.sesiones.update(initialData.id, sesionData);
      } else {
        await db.sesiones.add(sesionData);
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Título de la Sesión</label>
        <div className="relative group">
           <input 
            type="text" 
            required 
            className="input-field pr-12"
            value={formData.titulo}
            onChange={e => setFormData({...formData, titulo: e.target.value})}
            placeholder="Ej: Análisis de algoritmos de búsqueda"
          />
           <button 
             type="button"
             onClick={handleIAFill}
             disabled={aiLoading}
             className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 rounded-lg transition-all"
             title="Generar contenido con IA"
           >
             {aiLoading ? <div className="w-4 h-4 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" /> : <Sparkles size={18} />}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fecha</label>
          <input 
            type="date" 
            required 
            className="input-field"
            value={formData.fecha}
            onChange={e => setFormData({...formData, fecha: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duración</label>
          <input 
            type="text" 
            className="input-field"
            value={formData.duracion}
            onChange={e => setFormData({...formData, duracion: e.target.value})}
            placeholder="90 min"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Propósito de Aprendizaje</label>
           {aiLoading && <span className="text-[10px] text-accent-500 animate-pulse font-bold">IA redactando...</span>}
        </div>
        <textarea 
          required
          className="input-field min-h-[80px] text-sm leading-relaxed"
          value={formData.objetivo}
          onChange={e => setFormData({...formData, objetivo: e.target.value})}
          placeholder="¿Qué competencia logrará el estudiante?"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Secuencia Didáctica (Inicio, Desarrollo, Cierre)</label>
        <textarea 
          className="input-field min-h-[180px] text-sm leading-relaxed"
          value={formData.actividades}
          onChange={e => setFormData({...formData, actividades: e.target.value})}
          placeholder="Describe los momentos de la clase..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1 font-bold shadow-lg shadow-primary-500/20" isLoading={loading}>
          {initialData ? 'Actualizar Sesión' : 'Publicar Sesión'}
        </Button>
      </div>
    </form>
  );
};

export default SesionForm;

export default SesionForm;
