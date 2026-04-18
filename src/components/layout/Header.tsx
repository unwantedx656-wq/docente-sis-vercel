import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Resumen General';
    if (path.startsWith('/cursos')) return 'Mis Cursos';
    if (path.startsWith('/unidades')) return 'Planificación Curricular';
    if (path.startsWith('/sesiones')) return 'Sesiones de Clase';
    if (path.startsWith('/alumnos')) return 'Gestión de Alumnos';
    if (path.startsWith('/asistencia')) return 'Control de Asistencia';
    if (path.startsWith('/incidencias')) return 'Registro de Incidencias';
    if (path.startsWith('/ia')) return 'Asistente Digital';
    if (path.startsWith('/reportes')) return 'Análisis y Reportes';
    if (path.startsWith('/backup')) return 'Seguridad y Backup';
    if (path.startsWith('/ajustes')) return 'Configuración';
    return 'Docente SIS';
  };

  return (
    <header className="h-20 border-b border-primary-800 bg-primary-950/30 backdrop-blur-xl px-6 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center bg-primary-900/50 border border-primary-800 rounded-xl px-4 py-2 min-w-[200px] lg:min-w-[320px] focus-within:border-accent-500/50 transition-colors">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar en el sistema..." 
            className="bg-transparent border-none outline-none px-3 py-0.5 text-sm text-slate-200 w-full placeholder:text-slate-600"
          />
        </div>

        <button className="p-2.5 text-slate-400 hover:text-accent-400 hover:bg-accent-500/10 rounded-xl transition-all relative group">
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-primary-950 group-hover:animate-ping" />
        </button>

        <div className="h-8 w-px bg-primary-800 mx-1 md:mx-2" />

        <button className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-xl transition-all group border border-transparent hover:border-primary-800">
          <div className="w-9 h-9 bg-primary-800 rounded-lg flex items-center justify-center border border-primary-700 group-hover:border-accent-500/50 transition-colors shadow-inner">
            <User size={18} className="text-slate-400 group-hover:text-accent-400" />
          </div>
          <div className="hidden md:block text-left pr-2">
            <p className="text-sm font-bold text-white leading-none">M. Gutiérrez</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Premium</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
