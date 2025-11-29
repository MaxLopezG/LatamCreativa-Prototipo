
import React, { useState } from 'react';
import { X, Plus, Lock, Globe, Image as ImageIcon, Bookmark } from 'lucide-react';
import { CollectionItem } from '../../types';

interface SaveToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: CollectionItem[];
  onSave: (collectionId: string) => void;
  onCreate: (title: string, isPrivate: boolean) => void;
  itemImage?: string;
}

export const SaveToCollectionModal: React.FC<SaveToCollectionModalProps> = ({ 
  isOpen, 
  onClose, 
  collections, 
  onSave, 
  onCreate,
  itemImage
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
      if (newTitle.trim()) {
          onCreate(newTitle, isPrivate);
          setNewTitle('');
          setIsCreating(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white">Guardar en Colección</h3>
            <button onClick={onClose} className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5" />
            </button>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {isCreating ? (
                <div className="space-y-4">
                    <div className="aspect-square w-24 bg-slate-200 dark:bg-white/5 rounded-xl mx-auto overflow-hidden">
                        {itemImage ? (
                            <img src={itemImage} alt="" className="w-full h-full object-cover opacity-50" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-slate-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Ej: Inspiración Sci-Fi" 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsPrivate(!isPrivate)}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isPrivate ? 'bg-amber-500 border-amber-500' : 'border-slate-400'}`}>
                            {isPrivate && <X className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Colección Privada</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button onClick={() => setIsCreating(false)} className="flex-1 py-2 text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white">Cancelar</button>
                        <button onClick={handleCreate} className="flex-1 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600">Crear</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 text-slate-500 hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20">
                            <Plus className="h-6 w-6" />
                        </div>
                        <span className="font-bold">Nueva Colección</span>
                    </button>

                    {collections.map(col => (
                        <button 
                            key={col.id}
                            onClick={() => onSave(col.id)}
                            className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                                <img src={col.thumbnails[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{col.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span>{col.itemCount} items</span>
                                    {col.isPrivate && <Lock className="h-3 w-3" />}
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-2 bg-amber-500 rounded-full text-white">
                                    <Bookmark className="h-4 w-4 fill-current" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
