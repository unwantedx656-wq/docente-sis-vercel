import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, AlumnoEncrypted } from '../lib/db/database';
import { decrypt } from '../lib/crypto/encryption';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import AlumnoForm from '../components/forms/AlumnoForm';
import Table from '../components/ui/Table';
import { Users, Plus, Search, Trash2, Edit2, Shield, AlertCircle } from 'lucide-react';

const Alumnos = () => {
  const { getSessionKey } = useAuth();
  const rawAlumnos = useLiveQuery(() => db.alumnos.toArray()) ?? [];
  const [decryptedAlumnos, setDecryptedAlumnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    decryptAll();
  }, [rawAlumnos]);

  const decryptAll = async () => {
    const key = getSessionKey();
    if (!key || rawAlumnos.length === 0) {
      setDecryptedAlumnos([]);
      return;
    }

    setLoading(true);
    try {
      const decrypted = await Promise.all(rawAlumnos.map(async (a: AlumnoEncrypted) => {
        try {
          return {
            id: a.id,
            nombre: await decrypt(a.nombreEnc, a.iv, key),
            apellidos: await decrypt(a.apellidosEnc, a.iv, key),
            dni: await decrypt(a.dniEnc, a.iv, key),
            alergias: a.alergiasEnc ? await decrypt(a.alergiasEnc, a.iv, key) : '',
            condiciones: a.condicionesEnc ? await decrypt(a.condicionesEnc, a.iv, key) : '',
            grupoId: a.grupoId
          };
        } catch (e) {
          return { id: a.id, nombre: '[Error de Decriptación]', apellidos: '', dni: '' };
        }
      }));
      setDecryptedAlumnos(decrypted);
    } catch (err) {
      console.error('Master Decryption Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar registro de alumno?')) {
      await db.alumnos.delete(id);
    }
  };

  const filtered = decryptedAlumnos.filter(a => 
    `${a.nombre} ${a.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.dni.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alumnos</h1>
          <p className="text-slate-400">Toda la información sensible está encriptada localmente.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={20} /> Registrar Alumno
        </Button>
      </div>

      <div className="flex gap-4 p-4 bg-primary-900/50 border border-primary-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o DNI..." 
            className="input-field pl-10 h-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-10 px-3 flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 text-accent-400 rounded-xl text-xs font-medium">
          <Shield size={14} /> AES-256 ACTIVO
        </div>
      </div>

      <Card className="p-0">
        <Table headers={['Nombre y Apellidos', 'DNI', 'Observaciones', 'Acciones']}>
          {filtered.map((alumno) => (
            <tr key={alumno.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center text-slate-400 font-bold border border-primary-700">
                    {alumno.nombre[0]}{alumno.apellidos[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{alumno.nombre} {alumno.apellidos}</p>
                    <p className="text-xs text-slate-500">ID: {alumno.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-300 font-mono text-sm">{alumno.dni}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {alumno.alergias && <div className="p-1 px-2 bg-red-500/10 text-red-500 rounded text-[10px] uppercase font-bold">Alergias</div>}
                  {alumno.condiciones && <div className="p-1 px-2 bg-amber-500/10 text-amber-500 rounded text-[10px] uppercase font-bold">Medica</div>}
                  {!alumno.alergias && !alumno.condiciones && <span className="text-slate-600 text-xs">-</span>}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingAlumno(alumno);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(alumno.id!)}
                    className="p-2 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan={4} className="py-20 text-center">
                <div className="inline-block w-8 h-8 border-2 border-slate-700 border-t-accent-500 rounded-full animate-spin" />
                <p className="mt-2 text-slate-500 text-sm">Desencriptando datos...</p>
              </td>
            </tr>
          )}
          {!loading && filtered.length === 0 && (
            <tr>
              <td colSpan={4} className="py-20 text-center text-slate-600">
                <Users size={48} className="mx-auto mb-4 opacity-10" />
                No se encontraron alumnos registrados.
              </td>
            </tr>
          )}
        </Table>
      </Card>

      <div className="flex items-start gap-4 p-5 bg-primary-900/10 border border-primary-800 rounded-3xl">
        <AlertCircle className="text-slate-500 shrink-0" size={24} />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Protocolo de Privacidad</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Los datos de esta lista se desencriptan en memoria RAM cada vez que abres esta vista. Nunca se guardan sin encriptar en el disco. Al cerrar la pestaña o cerrar sesión, la clave se borra definitivamente de la memoria.
          </p>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingAlumno(null); }} 
        title={editingAlumno ? 'Modificar Datos de Alumno' : 'Registrar Nuevo Alumno'}
      >
        <AlumnoForm 
          onSuccess={() => { setIsModalOpen(false); setEditingAlumno(null); }}
          onCancel={() => { setIsModalOpen(false); setEditingAlumno(null); }}
          initialData={editingAlumno}
        />
      </Modal>
    </div>
  );
};

export default Alumnos;
