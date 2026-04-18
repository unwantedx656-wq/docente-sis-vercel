import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Curso } from '../lib/db/database';
import { generateContent } from '../lib/ai/gemini';
import { validateContent } from '../lib/ai/grok';
import { getCurriculumContext } from '../lib/curriculum/context';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { Sparkles, ShieldCheck, AlertCircle, Send, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatIA = () => {
  const cursos = useLiveQuery(() => db.cursos.toArray()) ?? [];
  const [selectedCursoId, setSelectedCursoId] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<{ content: string; validation: any } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCursoId || !prompt) return;

    setLoading(true);
    setResult(null);

    try {
      const curso = cursos.find((c: Curso) => c.id === Number(selectedCursoId));
      if (!curso) throw new Error('Curso no encontrado');

      // 1. Obtener contexto MINEDU
      const context = await getCurriculumContext(curso.grado, 'primaria'); // Debería detectar nivel real

      // 2. Generar con Gemini
      const genResponse = await generateContent(prompt, context);
      
      setLoading(false);
      setValidating(true);

      // 3. Validar con Grok
      const valResponse = await validateContent(genResponse.content, curso.grado, curso.nombre);
      
      setResult({
        content: genResponse.content,
        validation: valResponse
      });
    } catch (err) {
      alert('Error en el flujo de IA: ' + (err as Error).message);
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-accent-400" /> Asistente Pedagógico IA
        </h1>
        <p className="text-slate-400 mt-1">Generación de sesiones con Gemini + Validación curricular Grok.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Contexto de Grado/Área</label>
                <select 
                  required
                  className="input-field"
                  value={selectedCursoId}
                  onChange={e => setSelectedCursoId(e.target.value)}
                >
                  <option value="">Selecciona un curso...</option>
                  {cursos.map((c: Curso) => <option key={c.id} value={c.id}>{c.nombre} - {c.grado}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">¿Qué deseas generar?</label>
                <textarea 
                  required
                  className="input-field min-h-[120px] text-sm"
                  placeholder="Ej: Genera una sesión sobre ecosistemas para 5to grado usando el enfoque ambiental..."
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full gap-2" isLoading={loading || validating}>
                {loading ? 'Generando con Gemini...' : validating ? 'Validando con Grok...' : 'Generar Sesión'}
                {!loading && !validating && <Send size={18} />}
              </Button>
            </form>
          </Card>

          <Card className="bg-primary-900/30 border-dashed border-primary-800 p-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-4">¿Cómo funciona?</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <p className="text-xs text-slate-500">Cargamos el currículo nacional (MINEDU) como contexto base.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <p className="text-xs text-slate-500">Gemini diseña la sesión pedagógica detallada.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <p className="text-xs text-slate-500">Grok valida la alineación con competencias y criterios oficiales.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!result && !loading && !validating ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-10 bg-primary-900/10 rounded-3xl border border-dashed border-primary-800"
              >
                <Sparkles size={64} className="text-slate-800 mb-6" />
                <h3 className="text-xl font-medium text-slate-400">Listo para crear</h3>
                <p className="text-slate-600 mt-2 max-w-xs">Usa el panel de la izquierda para describir tu sesión ideal.</p>
              </motion.div>
            ) : result ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Panel de Validación */}
                <Card className={cn(
                  "border-l-4",
                  result.validation.score >= 80 ? "border-l-emerald-500 bg-emerald-500/5" : "border-l-amber-500 bg-amber-500/5"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        result.validation.score >= 80 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      )}>
                        {result.validation.score >= 80 ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Validación de IA Grok</h4>
                        <p className="text-xs text-slate-500">Puntaje Pedagógico: {result.validation.score}/100</p>
                      </div>
                    </div>
                    <Badge variant={result.validation.score >= 80 ? 'success' : 'warning'}>
                      {result.validation.recommendation.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <div className="p-3 bg-primary-950/50 rounded-xl border border-primary-800">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Alineación Curricular</p>
                        <p className="text-sm font-medium text-slate-200 capitalize">{result.validation.curriculumAlignment}</p>
                     </div>
                     <div className="p-3 bg-primary-950/50 rounded-xl border border-primary-800">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Grado Apropiado</p>
                        <p className="text-sm font-medium text-slate-200">{result.validation.ageAppropriate ? 'SÍ' : 'REVISAR'}</p>
                     </div>
                  </div>

                  {result.validation.suggestions.length > 0 && (
                    <div className="space-y-2">
                       <p className="text-[10px] text-slate-500 uppercase font-bold">Sugerencias de Mejora</p>
                       <ul className="text-xs text-slate-400 space-y-1">
                          {result.validation.suggestions.map((s: string, i: number) => (
                            <li key={i} className="flex gap-2"><div className="w-1 h-1 bg-accent-500 rounded-full mt-1.5 shrink-0" /> {s}</li>
                          ))}
                       </ul>
                    </div>
                  )}
                </Card>

                {/* Contenido Generado */}
                <Card className="p-8 prose prose-invert max-w-none">
                   <div className="flex justify-between items-center mb-6 pb-6 border-b border-primary-800">
                      <h2 className="text-2xl font-bold m-0">Resultado de Gemini</h2>
                      <div className="flex gap-2">
                         <Button variant="secondary" size="sm" onClick={() => setResult(null)}><RotateCcw size={16} /></Button>
                         <Button variant="primary" size="sm"><CheckCircle2 size={16} /> Usar esta sesión</Button>
                      </div>
                   </div>
                   <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-serif">
                     {result.content}
                   </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-20 bg-primary-900/10 rounded-3xl border border-primary-800">
                 <Spinner className="mb-6" />
                 <h3 className="text-xl font-medium text-white mb-2">Procesando con IAs Redundantes</h3>
                 <p className="text-slate-500 text-sm max-w-sm text-center">
                   {loading ? 'Gemini está estructurando la sesión pedagógica...' : 'Grok está validando la alineación con el currículo MINEDU...'}
                 </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default ChatIA;
