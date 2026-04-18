import React, { useState } from 'react';
import Button from '../ui/Button';
import { db } from '../../lib/db/database';
import { encrypt } from '../../lib/crypto/encryption';
import { useAuth } from '../../hooks/useAuth';
import { validateDNI } from '../../lib/utils/validators';

interface AlumnoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

const AlumnoForm: React.FC<AlumnoFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const { getSessionKey } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    apellidos: initialData?.apellidos || '',
    dni: initialData?.dni || '',
    alergias: initialData?.alergias || '',
    condiciones: initialData?.condiciones || '',
    grupoId: initialData?.grupoId || 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateDNI(formData.dni)) {
      setError('El DNI debe tener 8 dígitos');
      setLoading(false);
      return;
    }

    const key = getSessionKey();
    if (!key) {
      setError('Sesión no autorizada');
      setLoading(false);
      return;
    }

    try {
      // Encriptar cada campo sensible
      const encNombre = await encrypt(formData.nombre, key);
      const encApellidos = await encrypt(formData.apellidos, key);
      const encDni = await encrypt(formData.dni, key);
      const encAlergias = formData.alergias ? await encrypt(formData.alergias, key) : { encrypted: '', iv: '' };
      const encCondiciones = formData.condiciones ? await encrypt(formData.condiciones, key) : { encrypted: '', iv: '' };

      const alumnoData = {
        grupoId: Number(formData.grupoId),
        nombreEnc: encNombre.encrypted,
        apellidosEnc: encApellidos.encrypted,
        dniEnc: encDni.encrypted,
        alergiasEnc: encAlergias.encrypted,
        condicionesEnc: encCondiciones.encrypted,
        iv: encNombre.iv // Usamos el IV del nombre como base o guardamos por campo si es necesario. Para simplicidad usamos uno por registro.
      };

      if (initialData?.id) {
        await db.alumnos.update(initialData.id, alumnoData);
      } else {
        await db.alumnos.add(alumnoData);
      }

      onSuccess();
    } catch (err) {
      setError('Error al guardar datos encriptados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Nombre</label>
          <input 
            type="text" 
            required 
            className="input-field"
            value={formData.nombre}
            onChange={e => setFormData({...formData, nombre: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Apellidos</label>
          <input 
            type="text" 
            required 
            className="input-field"
            value={formData.apellidos}
            onChange={e => setFormData({...formData, apellidos: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">DNI (8 dígitos)</label>
        <input 
          type="text" 
          required 
          maxLength={8}
          className="input-field"
          value={formData.dni}
          onChange={e => setFormData({...formData, dni: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Alergias / Restricciones alimentarias</label>
        <textarea 
          className="input-field min-h-[80px]"
          value={formData.alergias}
          onChange={e => setFormData({...formData, alergias: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Condiciones médicas especiales</label>
        <textarea 
          className="input-field min-h-[80px]"
          value={formData.condiciones}
          onChange={e => setFormData({...formData, condiciones: e.target.value})}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
          {initialData ? 'Actualizar Alumno' : 'Registrar Alumno'}
        </Button>
      </div>
    </form>
  );
};

export default AlumnoForm;
