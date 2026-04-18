import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db/database';
import Card from '../components/ui/Card';
import { BookOpen, Users, Calendar, AlertCircle, ArrowUpRight, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const cursosCount = useLiveQuery(() => db.cursos.count()) ?? 0;
  const unidadesCount = useLiveQuery(() => db.unidades.count()) ?? 0;
  const alumnosCount = useLiveQuery(() => db.alumnos.count()) ?? 0;
  
  // Real count for TODAY
  const incidenciasHoy = useLiveQuery(() => 
    db.incidencias.where('fecha').equals(today).count()
  ) ?? 0;

  const sesionesRecientes = useLiveQuery(() => 
    db.sesiones.orderBy('fecha').reverse().limit(3).toArray()
  ) ?? [];

  const stats = [
    { label: 'Cursos Activos', value: cursosCount, icon: BookOpen, color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { label: 'Total Alumnos', value: alumnosCount, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Planificación', value: unidadesCount, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Alertas HOY', value: incidenciasHoy, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-10 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black text-white tracking-tight">Bienvenido, Docente</h1>
            <div className="px-2 py-0.5 bg-accent-500/20 text-accent-400 text-[10px] font-black uppercase rounded-full border border-accent-500/30 flex items-center gap-1">
              <Sparkles size={10} /> Online
            </div>
          </div>
          <p className="text-slate-400 font-medium">Panel de control y gestión pedagógica.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2 font-bold bg-primary-900/50 border-primary-800" onClick={() => navigate('/unidades')}>
            <Plus size={18} /> Nueva Sesión
          </Button>
          <Button variant="primary" className="gap-2 font-bold shadow-lg shadow-primary-500/20" onClick={() => navigate('/alumnos')}>
            <Plus size={18} /> Registrar Alumno
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:border-primary-700 cursor-default group transition-all duration-300 hover:shadow-2xl hover:shadow-primary-950/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                 <stat.icon size={80} className={stat.color} />
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <ArrowUpRight className="text-slate-700 group-hover:text-accent-500 transition-colors" size={20} />
              </div>
              <div className="mt-4 relative z-10">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-white mt-1">{stat.value}</p>
                  {stat.value === 0 && <span className="text-[10px] text-slate-700 font-bold italic">Sin registros</span>}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Sesiones Recientes</h3>
              <p className="text-xs text-slate-500 font-medium">Tus últimas clases planificadas.</p>
            </div>
            <button className="text-xs font-black uppercase tracking-widest text-accent-500 hover:text-accent-400 transition-colors" onClick={() => navigate('/unidades')}>
              Gestionar Todo
            </button>
          </div>
          <div className="space-y-4">
            {sesionesRecientes.length > 0 ? sesionesRecientes.map(sesion => (
              <div key={sesion.id} className="flex items-center gap-4 p-4 rounded-2xl bg-primary-900/30 border border-primary-800 hover:border-accent-500/30 transition-all cursor-pointer group" onClick={() => navigate('/unidades')}>
                <div className="w-12 h-12 rounded-xl bg-primary-800 flex flex-col items-center justify-center border border-primary-700 text-center leading-none group-hover:bg-accent-600/20 group-hover:border-accent-500/50 transition-colors">
                  <span className="text-[10px] uppercase font-black text-slate-500 group-hover:text-accent-400">{new Date(sesion.fecha).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}</span>
                  <span className="text-xl font-black text-white">{new Date(sesion.fecha).getDate()}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors">{sesion.titulo}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{sesion.duracion} • Creado recientemente</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-accent-500 shadow-lg shadow-accent-500/50 group-hover:scale-150 transition-transform" />
              </div>
            )) : (
              <div className="p-12 text-center border-2 border-dashed border-primary-800/50 rounded-3xl bg-primary-950/20">
                <div className="w-12 h-12 bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Calendar className="text-slate-700" size={24} />
                </div>
                <p className="text-slate-500 text-sm font-medium">No hay sesiones en el historial.</p>
                <button onClick={() => navigate('/unidades')} className="text-[10px] text-accent-500 font-black uppercase tracking-widest mt-4 hover:underline">Empieza a planificar</button>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Incidencias Críticas</h3>
              <p className="text-xs text-slate-500 font-medium">Alertas de comportamiento de hoy.</p>
            </div>
            <button className="text-xs font-black uppercase tracking-widest text-accent-500 hover:text-accent-400" onClick={() => navigate('/incidencias')}>
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
             <div className="p-12 text-center border-2 border-dashed border-primary-800/50 rounded-3xl bg-primary-950/20 py-16">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="text-emerald-500/50" size={32} />
                </div>
                <p className="text-white text-base font-bold">¡Todo Excelente!</p>
                <p className="text-slate-500 text-sm mt-1">No hay incidencias reportadas el día de hoy.</p>
                <div className="mt-6 flex justify-center">
                   <div className="px-3 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10 text-[9px] font-black text-emerald-500 uppercase tracking-widest">Estado: Normal</div>
                </div>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;
