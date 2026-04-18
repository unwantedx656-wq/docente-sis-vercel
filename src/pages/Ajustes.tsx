import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/db/database';
import { User, Lock, Bell, Globe, Trash2, ShieldAlert } from 'lucide-react';

const Ajustes = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClearData = async () => {
    if (confirm('¿ESTÁS ABSOLUTAMENTE SEGURO? Esta acción eliminará permanentemente todos tus datos, cursos, alumnos y configuraciones de este dispositivo.')) {
      setLoading(true);
      await db.delete();
      alert('Datos eliminados. La aplicación se reiniciará.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white">Configuración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
           <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-accent-600/10 text-accent-400 rounded-xl border border-accent-500/20 text-sm font-medium">
                <User size={18} /> Perfil del Docente
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl text-sm font-medium transition-all">
                <Lock size={18} /> Seguridad y PIN
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl text-sm font-medium transition-all">
                <Bell size={18} /> Notificaciones
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 rounded-xl text-sm font-medium transition-all">
                <Globe size={18} /> Idioma y Región
              </button>
           </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
           <Card title="Perfil del Docente">
              <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Nombres</label>
                       <input type="text" className="input-field" defaultValue="Marcial" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Apellidos</label>
                       <input type="text" className="input-field" defaultValue="Gutiérrez" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Institución Educativa</label>
                    <input type="text" className="input-field" defaultValue="I.E. Emblemática" />
                 </div>
                 <Button className="w-fit px-8">Guardar Perfil</Button>
              </div>
           </Card>

           <Card className="border-red-500/20 bg-red-500/5">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                    <ShieldAlert size={24} />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">Zona de Peligro</h4>
                    <p className="text-sm text-red-400/70 mt-1">
                       Las siguientes acciones son irreversibles y afectarán tu base de datos local.
                    </p>

                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                       <Button variant="danger" className="gap-2" onClick={handleClearData} isLoading={loading}>
                          <Trash2 size={18} /> Borrar todos los datos
                       </Button>
                       <Button variant="secondary" className="border-red-500/20 hover:bg-red-500/10 text-red-400" onClick={logout}>
                          Cerrar sesión actual
                       </Button>
                    </div>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default Ajustes;
