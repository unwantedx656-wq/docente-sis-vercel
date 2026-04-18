import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db/database';
import Card from '../components/ui/Card';
import { BookOpen, Users, Calendar, AlertCircle, ArrowUpRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const cursosCount = useLiveQuery(() => db.cursos.count()) ?? 0;
  const unidadesCount = useLiveQuery(() => db.unidades.count()) ?? 0;
  const alumnosCount = useLiveQuery(() => db.alumnos.count()) ?? 0;
  const incidenciasCount = useLiveQuery(() => db.incidencias.count()) ?? 0;

  const stats = [
    { label: 'Cursos Activos', value: cursosCount, icon: BookOpen, color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { label: 'Total Alumnos', value: alumnosCount, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Unidades', value: unidadesCount, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Incidencias HOY', value: incidenciasCount, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">¡Hola, Marcial!</h1>
          <p className="text-slate-400 mt-1">Aquí tienes un resumen de tu actividad hoy.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Plus size={18} /> Nueva Sesión
          </Button>
          <Button variant="primary" className="gap-2">
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
            <Card className="hover:border-primary-700 cursor-default group">
              <div className="flex items-start justify-between">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <ArrowUpRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={20} />
              </div>
              <div className="mt-4">
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="mt-4 w-full h-1 bg-primary-900 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: '60%' }} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Próximas Sesiones">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Sesiones de Hoy</h3>
            <button className="text-sm text-accent-400 hover:text-accent-300">Ver calendario</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-primary-900/50 border border-primary-800 hover:border-primary-700 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-primary-800 flex flex-col items-center justify-center border border-primary-700 text-center leading-none">
                  <span className="text-[10px] uppercase font-bold text-slate-500">ABR</span>
                  <span className="text-lg font-bold text-white">{17 + i}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white group-hover:text-accent-400 transition-colors">Sesión de Algoritmos {i}</h4>
                  <p className="text-xs text-slate-500">5to Secundaria • 08:30 AM</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent-500 shadow-lg shadow-accent-500/50" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Incidencias Recientes</h3>
            <button className="text-sm text-accent-400 hover:text-accent-300">Ver todas</button>
          </div>
          <div className="space-y-4">
             <div className="p-4 rounded-2xl bg-primary-900/50 border border-primary-800 text-center flex flex-col items-center justify-center py-10">
                <div className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center mb-3">
                  <AlertCircle className="text-slate-600" size={24} />
                </div>
                <p className="text-slate-500 text-sm">No hay incidencias reportadas hoy.</p>
                <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">Todo bajo control</p>
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
