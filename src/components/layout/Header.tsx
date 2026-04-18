import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/cursos': return 'Mis Cursos';
      case '/unidades': return 'Unidades Didácticas';
      case '/sesiones': return 'Sesiones de Clase';
      case '/alumnos': return 'Gestión de Alumnos';
      case '/asistencia': return 'Control de Asistencia';
      case '/incidencias': return 'Incidencias';
      case '/ia': return 'Asistente IA';
      case '/reportes': return 'Reportes';
      case '/backup': return 'Backup y Restauración';
      case '/ajustes': return 'Configuración';
      default: return 'Docente SIS';
    }
  };

  return (
    <header className="h-20 border-b border-primary-800 bg-primary-950/50 backdrop-blur-md px-6 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-slate-400 hover:text-white">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-white">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center bg-primary-900 border border-primary-800 rounded-xl px-3 py-1.5 min-w-[200px] lg:min-w-[300px]">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-transparent border-none outline-none px-3 py-1 text-sm text-slate-200 w-full"
          />
        </div>

        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-primary-950" />
        </button>

        <div className="h-8 w-px bg-primary-800 mx-1 md:mx-2" />

        <button className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-xl transition-all group">
          <div className="w-9 h-9 bg-primary-800 rounded-lg flex items-center justify-center border border-primary-700 group-hover:border-accent-500/50 transition-colors">
            <User size={18} className="text-slate-400 group-hover:text-accent-400" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-white">M. Gutiérrez</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Docente</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
