import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Layers, BookOpen, Calendar, Users, AlertCircle, MessageSquare, FileBox, Database, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-950/90 backdrop-blur-md"
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-primary-900 border-r border-primary-800 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-white">Docente SIS</h1>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-4 py-4 rounded-xl transition-all",
                    isActive 
                      ? "bg-accent-600/10 text-accent-400 border border-accent-500/20 shadow-lg shadow-accent-500/5" 
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <item.icon size={22} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
