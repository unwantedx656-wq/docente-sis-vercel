import React, { useState } from 'react';
import Button from '../ui/Button';
import { db } from '../../lib/db/database';

interface SesionFormProps {
  unidadId: number;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const SesionForm: React.FC<SesionFormProps> = ({ unidadId, onSuccess, onCancel, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
    duracion: initialData?.duracion || '90 min',
    objetivo: initialData?.objetivo || '',
    actividades: initialData?.actividades || ''
  });

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Título de la Sesión</label>
        <input 
          type="text" 
          required 
          className="input-field"
          value={formData.titulo}
          onChange={e => setFormData({...formData, titulo: e.target.value})}
          placeholder="Ej: Introducción a los algoritmos"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Fecha</label>
          <input 
            type="date" 
            required 
            className="input-field"
            value={formData.fecha}
            onChange={e => setFormData({...formData, fecha: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Duración</label>
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
        <label className="text-sm font-medium text-slate-400">Propósito / Objetivo</label>
        <textarea 
          required
          className="input-field min-h-[100px]"
          value={formData.objetivo}
          onChange={e => setFormData({...formData, objetivo: e.target.value})}
          placeholder="Describe qué lograrán los estudiantes..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Secuencia de Actividades</label>
        <textarea 
          className="input-field min-h-[150px]"
          value={formData.actividades}
          onChange={e => setFormData({...formData, actividades: e.target.value})}
          placeholder="Inicio, Desarrollo y Cierre..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
          {initialData ? 'Actualizar Sesión' : 'Crear Sesión'}
        </Button>
      </div>
    </form>
  );
};

export default SesionForm;
