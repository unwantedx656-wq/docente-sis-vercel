import React, { useState } from 'react';
import Button from '../ui/Button';
import { db } from '../../lib/db/database';
import { encrypt } from '../../lib/crypto/encryption';
import { useAuth } from '../../hooks/useAuth';

interface IncidenciaFormProps {
  alumnoId: number;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const IncidenciaForm: React.FC<IncidenciaFormProps> = ({ alumnoId, onSuccess, onCancel, initialData }) => {
  const { getSessionKey } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    descripcion: initialData?.descripcion || '',
    fecha: initialData?.fecha || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const key = getSessionKey();
    if (!key) {
      setError('Sesión no autorizada. Ingresa tu PIN.');
      setLoading(false);
      return;
    }

    try {
      const encDesc = await encrypt(formData.descripcion, key);

      const incidenciaData = {
        alumnoId,
        descripcionEnc: encDesc.encrypted,
        fecha: formData.fecha,
        iv: encDesc.iv
      };

      if (initialData?.id) {
        await db.incidencias.update(initialData.id, incidenciaData);
      } else {
        await db.incidencias.add(incidenciaData);
      }

      onSuccess();
    } catch (err) {
      setError('Error al encriptar incidencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Fecha del incidente</label>
        <input 
          type="date" 
          required 
          className="input-field"
          value={formData.fecha}
          onChange={e => setFormData({...formData, fecha: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Descripción detallada (Encriptada)</label>
        <textarea 
          required
          className="input-field min-h-[200px]"
          value={formData.descripcion}
          onChange={e => setFormData({...formData, descripcion: e.target.value})}
          placeholder="Describe lo ocurrido..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
          {initialData ? 'Actualizar Registro' : 'Guardar Incidencia'}
        </Button>
      </div>
    </form>
  );
};

export default IncidenciaForm;
