import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Curso } from '../lib/db/database';
import { decrypt, encrypt } from '../lib/crypto/encryption';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Check, X, Minus, Save, UserCheck } from 'lucide-react';

const Asistencia = () => {
  const { getSessionKey } = useAuth();
  const cursos = useLiveQuery(() => db.cursos.toArray()) ?? [];
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  const [selectedFecha, setSelectedFecha] = useState(new Date().toISOString().split('T')[0]);
  const [decryptedAlumnos, setDecryptedAlumnos] = useState<any[]>([]);
  const [asistencia, setAsistencia] = useState<Record<number, 'presente' | 'falta' | 'justificado'>>({});
  const [saving, setSaving] = useState(false);

  // Cargar y desencriptar alumnos cuando cambia el curso
  useEffect(() => {
    if (selectedCursoId) {
      loadAlumnos();
    } else {
      setDecryptedAlumnos([]);
    }
  }, [selectedCursoId]);

  const loadAlumnos = async () => {
    const key = getSessionKey();
    if (!key) return;

    const filtered = await db.alumnos.where('grupoId').equals(selectedCursoId!).toArray();
    
    const decrypted = await Promise.all(filtered.map(async (a) => {
      try {
        const nombre = await decrypt(a.nombreEnc, a.iv, key);
        const apellidos = await decrypt(a.apellidosEnc, a.iv, key);
        return {
          id: a.id,
          nombreCompleto: `${nombre} ${apellidos}`,
        };
      } catch (e) {
        return { id: a.id, nombreCompleto: '[Error de Decriptación]' };
      }
    }));
    
    setDecryptedAlumnos(decrypted);
    
    // Resetear/Cargar asistencia si ya existe para esta fecha
    const existing = await db.asistencia.where({ cursoId: selectedCursoId, fecha: selectedFecha }).first();
    if (existing) {
       // Decrypt existing records if needed
       // Por ahora inicializamos vacío
       setAsistencia({});
    } else {
       setAsistencia({});
    }
  };

  const handleSetStatus = (id: number, status: 'presente' | 'falta' | 'justificado') => {
    setAsistencia(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = async () => {
    if (!selectedCursoId) return;
    setSaving(true);
    
    const key = getSessionKey();
    if (!key) {
      alert('Sesión no válida.');
      setSaving(false);
      return;
    }

    try {
      const dataStr = JSON.stringify(asistencia);
      const { encrypted, iv } = await encrypt(dataStr, key);
      
      await db.asistencia.put({
        cursoId: selectedCursoId,
        fecha: selectedFecha,
        registrosEnc: encrypted,
        iv
      });
      
      alert('¡Asistencia guardada con éxito!');
    } catch (err) {
      console.error('Save Attendance Error:', err);
      alert('No se pudo guardar la asistencia.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <UserCheck size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Control de Asistencia</h1>
              <p className="text-slate-400 font-medium text-sm">Registro diario de puntualidad.</p>
           </div>
        </div>
        <Button 
          variant="primary" 
          className="gap-2 font-bold shadow-lg shadow-emerald-500/10" 
          disabled={!selectedCursoId || decryptedAlumnos.length === 0}
          onClick={handleSave}
          isLoading={saving}
        >
          <Save size={18} /> Guardar Registro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <Card className="p-6 bg-primary-900/30 border-primary-800/50">
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Seleccionar Curso</label>
                  <select 
                    className="input-field appearance-none cursor-pointer"
                    onChange={e => setSelectedCursoId(Number(e.target.value))}
                  >
                    <option value="">Selecciona un curso...</option>
                    {cursos.map((c: Curso) => <option key={c.id} value={c.id}>{c.nombre} - {c.grado}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Fecha del Registro</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={selectedFecha} 
                    onChange={e => setSelectedFecha(e.target.value)}
                  />
                </div>
                
                <div className="p-4 bg-primary-800/30 rounded-2xl border border-primary-800">
                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose">
                      Total Alumnos: <span className="text-white">{decryptedAlumnos.length}</span><br/>
                      Marcados: <span className="text-emerald-400">{Object.keys(asistencia).length}</span>
                   </p>
                </div>
             </div>
          </Card>
        </div>

        <div className="md:col-span-2">
           {!selectedCursoId ? (
             <div className="h-64 flex flex-col items-center justify-center bg-primary-900/10 rounded-[2.5rem] border-2 border-dashed border-primary-800/50 text-slate-600 gap-4">
                <Minus size={48} className="opacity-10" />
                <p className="font-medium">Selecciona un curso para iniciar la toma de asistencia.</p>
             </div>
           ) : decryptedAlumnos.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center bg-primary-900/10 rounded-[2.5rem] border-2 border-dashed border-primary-800/50 text-slate-600 gap-4">
                <X size={48} className="opacity-10" />
                <p className="font-medium">No hay alumnos registrados en este curso.</p>
             </div>
           ) : (
             <div className="space-y-3">
                {decryptedAlumnos.map((alumno) => (
                  <Card key={alumno.id} className="p-4 flex items-center justify-between group hover:border-accent-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary-800 border border-primary-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {alumno.nombreCompleto[0]}
                       </div>
                       <span className="font-bold text-sm text-slate-200 tracking-tight">{alumno.nombreCompleto}</span>
                    </div>
                    
                    <div className="flex gap-2 p-1 bg-primary-950/50 rounded-2xl border border-primary-800">
                      <button 
                        onClick={() => handleSetStatus(alumno.id, 'presente')}
                        title="Presente"
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          asistencia[alumno.id] === 'presente' 
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                            : "text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/5"
                        )}
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        onClick={() => handleSetStatus(alumno.id, 'falta')}
                        title="Falta"
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          asistencia[alumno.id] === 'falta' 
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
                            : "text-slate-500 hover:text-red-400 hover:bg-red-500/5"
                        )}
                      >
                        <X size={20} />
                      </button>
                      <button 
                        onClick={() => handleSetStatus(alumno.id, 'justificado')}
                        title="Tardanza/Justificado"
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          asistencia[alumno.id] === 'justificado' 
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                            : "text-slate-500 hover:text-amber-400 hover:bg-amber-500/5"
                        )}
                      >
                        <Minus size={20} />
                      </button>
                    </div>
                  </Card>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default Asistencia;
