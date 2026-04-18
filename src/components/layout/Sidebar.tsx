import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  AlertCircle, 
  MessageSquare, 
  FileBox, 
  Settings, 
  Database,
  Layers,
  LogOut
} from 'lucide-react';
import { cn } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Layers, label: 'Cursos', path: '/cursos' },
    { icon: BookOpen, label: 'Unidades', path: '/unidades' },
    { icon: Calendar, label: 'Sesiones', path: '/sesiones' },
    { icon: Users, label: 'Alumnos', path: '/alumnos' },
    { icon: AlertCircle, label: 'Incidencias', path: '/incidencias' },
    { icon: MessageSquare, label: 'Chat IA', path: '/ia' },
    { icon: FileBox, label: 'Reportes', path: '/reportes' },
    { icon: Database, label: 'Backup', path: '/backup' },
    { icon: Settings, label: 'Ajustes', path: '/ajustes' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-primary-950 border-r border-primary-800 p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center">
          <BookOpen className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Docente SIS
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              isActive 
                ? "bg-accent-600/10 text-accent-400 border border-accent-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} className={cn("transition-colors group-hover:scale-110")} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-primary-900">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
