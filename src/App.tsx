import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Cursos from './pages/Cursos';
import Unidades from './pages/Unidades';
import Sesiones from './pages/Sesiones';
import Alumnos from './pages/Alumnos';
import Asistencia from './pages/Asistencia';
import Incidencias from './pages/Incidencias';
import Materiales from './pages/Materiales';
import ChatIA from './pages/ChatIA';
import Reportes from './pages/Reportes';
import Backup from './pages/Backup';
import Ajustes from './pages/Ajustes';
import PinSetup from './pages/PinSetup';
import PinLogin from './pages/PinLogin';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isAuthenticated, hasPinSet } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-primary-950 overflow-hidden">
        {!isAuthenticated ? (
          <div className="w-full h-full flex items-center justify-center p-4 overflow-y-auto">
            <Routes>
              {!hasPinSet ? (
                <Route path="*" element={<PinSetup />} />
              ) : (
                <Route path="*" element={<PinLogin />} />
              )}
            </Routes>
          </div>
        ) : (
          <>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className={cn(
              "flex-1 flex flex-col min-w-0 transition-all duration-300",
              isSidebarOpen ? "translate-x-64 lg:translate-x-0" : "translate-x-0"
            )}>
              <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/cursos" element={<Cursos />} />
                  <Route path="/unidades" element={<Unidades />} />
                  <Route path="/sesiones" element={<Sesiones />} />
                  <Route path="/alumnos" element={<Alumnos />} />
                  <Route path="/asistencia" element={<Asistencia />} />
                  <Route path="/incidencias" element={<Incidencias />} />
                  <Route path="/materiales" element={<Materiales />} />
                  <Route path="/ia" element={<ChatIA />} />
                  <Route path="/reportes" element={<Reportes />} />
                  <Route path="/backup" element={<Backup />} />
                  <Route path="/ajustes" element={<Ajustes />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              {isSidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

import { useState } from 'react';

export default App;
