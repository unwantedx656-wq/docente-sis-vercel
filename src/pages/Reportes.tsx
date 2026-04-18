import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PDFExport from '../components/export/PDFExport';
import CSVExport from '../components/export/CSVExport';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db/database';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  PieChart, 
  ChevronRight,
  Download,
  FileSpreadsheet
} from 'lucide-react';

const Reportes = () => {
  const cursos = useLiveQuery(() => db.cursos.toArray()) ?? [];
  const alumnosCount = useLiveQuery(() => db.alumnos.count()) ?? 0;
  const sesionesCount = useLiveQuery(() => db.sesiones.count()) ?? 0;

  const reportTypes = [
    { title: 'Asistencia Consolidada', desc: 'Resumen mensual de asistencia por curso.', icon: BarChart3, color: 'text-accent-400' },
    { title: 'Progreso de Unidades', desc: 'Nivel de avance de las unidades didácticas.', icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'Reporte de Incidencias', desc: 'Bitácora detallada de comportamiento.', icon: FileText, color: 'text-red-400' },
    { title: 'Estadísticas del Aula', desc: 'Distribución por género y necesidades.', icon: PieChart, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Reportes y Exportación</h1>
        <p className="text-slate-400">Genera documentos oficiales y analiza el progreso de tus secciones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, i) => (
          <Card key={i} className="group hover:bg-white/5 cursor-pointer">
            <div className="flex gap-5">
              <div className={cn("w-14 h-14 rounded-2xl bg-primary-900 border border-primary-800 flex items-center justify-center shrink-0", report.color)}>
                <report.icon size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                  <ChevronRight size={20} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
                <p className="text-sm text-slate-500 mt-1">{report.desc}</p>
                <div className="flex gap-2 mt-4">
                  <PDFExport data={[]} title={report.title} fileName={report.title.toLowerCase().replace(/ /g, '_')} />
                  <CSVExport data={[]} fileName={report.title.toLowerCase().replace(/ /g, '_')} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest px-1">Resumen de Datos Actuales</h3>
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
           <div className="text-center">
              <p className="text-3xl font-bold text-white">{cursos.length}</p>
              <p className="text-xs text-slate-500 uppercase font-bold mt-1">Cursos</p>
           </div>
           <div className="text-center border-l border-r border-primary-900">
              <p className="text-3xl font-bold text-white">{alumnosCount}</p>
              <p className="text-xs text-slate-500 uppercase font-bold mt-1">Alumnos</p>
           </div>
           <div className="text-center">
              <p className="text-3xl font-bold text-white">{sesionesCount}</p>
              <p className="text-xs text-slate-500 uppercase font-bold mt-1">Sesiones</p>
           </div>
        </Card>
      </div>

      <div className="p-6 bg-accent-500/10 border border-accent-500/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h4 className="text-lg font-bold text-white">Descarga Completa (Raw JSON)</h4>
            <p className="text-sm text-accent-400/80">Descarga todos los datos para uso externo o bases de datos propias.</p>
         </div>
         <Button className="gap-2 shrink-0">
            <Download size={20} /> Exportar Toda la DB
         </Button>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Reportes;
