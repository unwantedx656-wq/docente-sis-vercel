import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  AlertCircle, 
  MessageSquare, 
  FolderOpen, 
  Settings, 
  Database,
  Layers,
  LogOut,
  X,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Resumen', path: '/' },
    { icon: Layers, label: 'Mis Cursos', path: '/cursos' },
    { icon: BookOpen, label: 'Planificación', path: '/unidades' },
    { icon: Users, label: 'Alumnos', path: '/alumnos' },
    { icon: Calendar, label: 'Asistencia', path: '/asistencia' },
    { icon: AlertCircle, label: 'Incidencias', path: '/incidencias' },
    { icon: FolderOpen, label: 'Materiales', path: '/materiales' },
    { icon: MessageSquare, label: 'Asistente IA', path: '/ia' },
    { icon: BarChart3, label: 'Reportes', path: '/reportes' },
  ];

  const secondaryMenu = [
    { icon: Database, label: 'Seguridad', path: '/backup' },
    { icon: Settings, label: 'Ajustes', path: '/ajustes' },
  ];

  const closeSidebar = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-primary-950 border-r border-primary-800 transition-all duration-300 transform lg:relative lg:translate-x-0 lg:flex lg:flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-600/30">
                <BookOpen className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-black text-white italic tracking-tighter">
                DOCENTE<span className="text-accent-500">SIS</span>
              </h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-hide">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Principal</p>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-accent-600/10 text-accent-400 font-bold border border-accent-500/20" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={20} className={cn("transition-colors group-hover:scale-110")} />
                <span className="text-sm">{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div layoutId="active-nav-indicator" className="absolute left-0 w-1 h-6 bg-accent-500 rounded-r-full" />
                )}
              </NavLink>
            ))}

            <div className="pt-6 pb-2">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Sistema</p>
            </div>
            {secondaryMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-accent-600/10 text-accent-400 font-bold border border-accent-500/20" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-primary-900">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

import { useAuth } from '../../hooks/useAuth';

export default Sidebar;
