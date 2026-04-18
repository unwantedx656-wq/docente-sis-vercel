import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FileText, Link as LinkIcon, Download, Plus, Search, FolderOpen } from 'lucide-react';

const Materiales = () => {
  const materiales = [
    { title: 'Guía de Algoritmos v1', type: 'PDF', size: '1.2 MB', date: '2024-04-10' },
    { title: 'Video: Tutorial Python', type: 'LINK', size: 'YouTube', date: '2024-04-12' },
    { title: 'Ficha de Trabajo U1', type: 'DOCX', size: '450 KB', date: '2024-04-15' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Centro de Materiales</h1>
          <p className="text-slate-400">Recursos educativos para tus sesiones de clase.</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} /> Subir Material
        </Button>
      </div>

      <div className="flex gap-4 p-4 bg-primary-900/50 border border-primary-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar materiales por nombre o tema..." 
            className="input-field pl-10 h-10"
          />
        </div>
        <div className="hidden md:flex gap-2">
           <Button variant="secondary" size="sm" className="h-10">Todos</Button>
           <Button variant="ghost" size="sm" className="h-10">PDFs</Button>
           <Button variant="ghost" size="sm" className="h-10">Videos</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materiales.map((mat, i) => (
          <Card key={i} className="group hover:border-accent-500/50 transition-all">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-800 rounded-xl flex items-center justify-center border border-primary-700 text-slate-400">
                {mat.type === 'LINK' ? <LinkIcon size={24} /> : <FileText size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white truncate">{mat.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{mat.type} • {mat.size}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-primary-800">
              <span className="text-[10px] uppercase font-bold text-slate-600">{mat.date}</span>
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <Download size={18} />
                </button>
                <button className="p-2 text-slate-500 hover:text-accent-400 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}

        <div className="bg-primary-900/10 border-2 border-dashed border-primary-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-accent-500/50 transition-all cursor-pointer">
           <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent-500/20 transition-colors">
              <Plus className="text-slate-600 group-hover:text-accent-400" size={24} />
           </div>
           <p className="text-slate-500 font-medium">Agregar nuevo recurso</p>
           <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">Formatos SOPORTADOS: PDF, DOCX, MP4</p>
        </div>
      </div>
    </div>
  );
};

export default Materiales;
