import React, { useState } from 'react';
import Button from '../ui/Button';
import { db } from '../../lib/db/database';

interface UnidadFormProps {
  cursoId: number;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const UnidadForm: React.FC<UnidadFormProps> = ({ cursoId, onSuccess, onCancel, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    orden: initialData?.orden || 1,
    objetivo: initialData?.objetivo || ''
  });

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Título de la Unidad</label>
        <input 
          type="text" 
          required 
          className="input-field"
          value={formData.titulo}
          onChange={e => setFormData({...formData, titulo: e.target.value})}
          placeholder="Ej: Unidad 1: Explorando la tecnología"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Orden / Número de Unidad</label>
        <input 
          type="number" 
          required 
          className="input-field"
          value={formData.orden}
          onChange={e => setFormData({...formData, orden: Number(e.target.value)})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Objetivo General</label>
        <textarea 
          className="input-field min-h-[100px]"
          value={formData.objetivo}
          onChange={e => setFormData({...formData, objetivo: e.target.value})}
          placeholder="Propósito principal de esta unidad..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
          {initialData ? 'Actualizar Unidad' : 'Crear Unidad'}
        </Button>
      </div>
    </form>
  );
};

export default UnidadForm;
