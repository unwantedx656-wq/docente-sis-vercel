import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { setupMasterPin } from '../lib/crypto/pinManager';
import { useAuth } from '../hooks/useAuth';

const PinSetup = () => {
  const { refreshPinStatus } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length !== 6) {
      setError('El PIN debe tener 6 dígitos');
      return;
    }

    if (pin !== confirmPin) {
      setError('Los PINs no coinciden');
      return;
    }

    setLoading(true);
    try {
      await setupMasterPin(pin);
      setIsSuccess(true);
      // Dar tiempo al usuario para ver el mensaje de éxito
      setTimeout(async () => {
        await refreshPinStatus();
      }, 1500);
    } catch (err) {
      setError('Error al configurar el PIN. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md text-center space-y-6">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
          <ShieldCheck className="text-white" size={48} />
        </motion.div>
        <h2 className="text-2xl font-bold text-white">¡PIN Configurado!</h2>
        <p className="text-slate-400">Tu sistema ha sido encriptado correctamente. Redirigiendo al acceso...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-accent-500/20">
          <ShieldCheck className="text-white" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
        <p className="text-slate-400">Configura tu PIN maestro de 6 dígitos para proteger los datos de tus alumnos.</p>
      </motion.div>

      <Card className="glass-card p-8">
        <form onSubmit={handleSetup} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Nuevo PIN (6 dígitos)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  className="input-field pl-12 text-center text-2xl tracking-[1em]"
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Confirmar PIN</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  className="input-field pl-12 text-center text-2xl tracking-[1em]"
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full py-4 text-lg" isLoading={loading}>
            Configurar Acceso <ArrowRight size={20} className="ml-2" />
          </Button>
          
          <p className="text-center text-xs text-slate-500 px-4">
            <AlertTriangle className="inline mr-1" size={12} />
            Importante: No hay forma de recuperar este PIN. Si lo olvidas, perderás acceso a los datos encriptados.
          </p>
        </form>
      </Card>
    </div>
  );
};

const AlertTriangle = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

export default PinSetup;
