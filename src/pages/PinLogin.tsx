import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

const PinLogin = () => {
  const { loginOrSetup } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;

    setLoading(true);
    setError(null);

    const success = await loginOrSetup(pin);
    if (!success) {
      setError('PIN incorrecto. Inténtalo de nuevo.');
      setPin('');
      setLoading(false);
    }
    // Si tiene éxito, useAuth actualiza el estado y App.tsx redirige
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-20 h-20 bg-primary-900 border border-primary-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-accent-500/10 group-hover:bg-accent-500/20 transition-colors" />
          <Lock className="text-accent-400" size={36} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Acceso Seguro</h1>
        <p className="text-slate-400">Ingresa tu PIN maestro para desbloquear el sistema</p>
      </motion.div>

      <Card className="glass-card p-8">
        <form onSubmit={handleLogin} className="space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="relative flex justify-center gap-3 cursor-pointer" onClick={() => document.getElementById('pin-input')?.focus()}>
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                  pin.length > i 
                    ? "border-accent-500 bg-accent-500/10 scale-105" 
                    : "border-primary-800 bg-primary-900/50"
                )}
              >
                {pin.length > i && <div className="w-3 h-3 bg-accent-400 rounded-full shadow-[0_0_10px_rgba(var(--accent-500-rgb),0.5)]" />}
              </div>
            ))}
            
            <input
              id="pin-input"
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[40px] tracking-[1.5rem] text-center"
              value={pin}
              autoComplete="one-time-code"
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPin(val);
              }}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-4 text-lg" 
            isLoading={loading}
            disabled={pin.length !== 6}
          >
            Desbloquear <ArrowRight size={20} className="ml-2" />
          </Button>

          <p className="text-center text-sm text-slate-500">
            PIN local encriptado. No se envía a ningún servidor.
          </p>
        </form>
      </Card>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default PinLogin;
