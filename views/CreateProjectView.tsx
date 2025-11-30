
import React, { useState } from 'react';
import { UploadCloud, Plus, X, Image as ImageIcon, Target, Users, Type } from 'lucide-react';
import { CreatePageLayout } from '../components/layout/CreatePageLayout';

interface CreateProjectViewProps {
  onBack: () => void;
}

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({ onBack }) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole.trim()) {
      setRoles([...roles, currentRole.trim()]);
      setCurrentRole('');
    }
  };

  const removeRole = (roleToRemove: string) => {
    setRoles(roles.filter(role => role !== roleToRemove));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTag.trim()) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <CreatePageLayout 
      title="Publicar Nuevo Proyecto" 
      onBack={onBack}
      actionColorClass="bg-purple-600 hover:bg-purple-700 text-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info */}
          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Type className="h-5 w-5 text-purple-500" /> Detalles Básicos
            </h2>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Nombre del Proyecto
              </label>
              <input 
                type="text" 
                placeholder="Ej: Chronos RPG, Cortometraje 'El Viaje'..."
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Descripción
              </label>
              <textarea 
                rows={6}
                placeholder="Describe la idea, la historia, el estilo visual y el estado actual del proyecto..."
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
              ></textarea>
              <p className="text-xs text-slate-500 mt-2 text-right">Mínimo 100 caracteres para inspirar a tu equipo.</p>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-500" /> Portada del Proyecto
              </h2>
              
              <div className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadCloud className="h-10 w-10 text-white mb-3" />
                        <span className="text-white font-bold">Cambiar imagen</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-16 w-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                        <UploadCloud className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-slate-900 dark:text-white font-bold mb-1">Haz clic para subir o arrastra aquí</p>
                    <p className="text-slate-500 text-sm">PNG, JPG hasta 10MB (1920x1080 recomendado)</p>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 cursor-pointer opacity-0" 
                />
              </div>
          </div>

          {/* Roles & Team */}
          <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" /> Equipo y Roles
              </h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ¿Qué perfiles buscas?
                </label>
                <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      placeholder="Ej: Concept Artist, Unity Dev..."
                      className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddRole(e)}
                    />
                    <button 
                      onClick={handleAddRole}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-xl transition-colors"
                    >
                      <Plus className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {roles.map((role, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-bold border border-purple-500/20 animate-fade-in">
                          {role}
                          <button onClick={() => removeRole(role)} className="hover:text-purple-700 dark:hover:text-white">
                            <X className="h-3 w-3" />
                          </button>
                      </span>
                    ))}
                    {roles.length === 0 && (
                      <p className="text-sm text-slate-400 italic">No has agregado roles aún.</p>
                    )}
                </div>
              </div>
          </div>

        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
            
            {/* Tags */}
            <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Target className="h-4 w-4" /> Etiquetas
              </h3>
              
              <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Ej: Sci-Fi, Pixel Art..."
                    className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                  />
                  <button onClick={handleAddTag} className="bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white p-2 rounded-lg hover:bg-slate-300 dark:hover:bg-white/20">
                    <Plus className="h-4 w-4" />
                  </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-white/5">
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1">
                          <X className="h-3 w-3" />
                        </button>
                    </span>
                  ))}
              </div>
            </div>

            {/* Publish Actions */}
            <div className="bg-white dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-200 dark:border-white/10 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Resumen</h3>
              <p className="text-sm text-slate-500 mb-6">
                  Tu proyecto pasará a estado "Reclutando" inmediatamente. Podrás editarlo más tarde.
              </p>
              <div className="space-y-3">
                  <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20">
                    Publicar Proyecto
                  </button>
                  <button className="w-full py-3 bg-transparent border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    Guardar Borrador
                  </button>
              </div>
            </div>

        </div>
      </div>
    </CreatePageLayout>
  );
};
