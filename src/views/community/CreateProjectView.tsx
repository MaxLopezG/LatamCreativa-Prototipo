
import React, { useState } from 'react';
import { UploadCloud, Plus, X, Image as ImageIcon, Target, Users, Type, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { CreatePageLayout } from '../../components/layout/CreatePageLayout';
import { useAppStore } from '../../hooks/useAppStore';

interface CreateProjectViewProps {
  onBack: () => void;
}

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({ onBack }) => {
  const { actions } = useAppStore();
  const [roles, setRoles] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form States
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [projectName, setProjectName] = useState('');

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

  const handleSubmit = () => {
    if (!projectName.trim()) {
      setFormStatus('error');
      actions.showToast('El nombre del proyecto es obligatorio', 'error');
      setTimeout(() => setFormStatus('idle'), 2000);
      return;
    }

    setFormStatus('submitting');

    // Simulate API
    setTimeout(() => {
      setFormStatus('success');
      actions.showToast('Proyecto publicado con éxito', 'success');

      setTimeout(() => {
        onBack();
      }, 1500);
    }, 2000);
  };

  if (formStatus === 'success') {
    return (
      <div className="fixed inset-0 z-50 bg-[#030304] flex flex-col items-center justify-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">¡Proyecto Publicado!</h2>
        <p className="text-slate-400">Redirigiendo a la comunidad...</p>
      </div>
    );
  }

  return (
    <CreatePageLayout
      title="Publicar Nuevo Proyecto"
      onBack={onBack}
      actionColorClass="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
      actionLabel={formStatus === 'submitting' ? 'Publicando...' : 'Publicar'}
      onAction={handleSubmit}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${formStatus === 'submitting' ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>

        {/* Main Content - Canvas Area */}
        <div className="lg:col-span-8 space-y-6">

          {/* Title Input - H1 Style */}
          <div className="relative group">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Título del Proyecto"
              className="w-full bg-transparent text-4xl font-bold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-[#333] border-b-2 border-transparent focus:border-purple-500 focus:outline-none py-2 transition-all"
            />
            {!projectName && (
              <div className="absolute top-4 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 pointer-events-none">
                <span className="text-xs font-bold uppercase tracking-wider">Requerido</span>
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Media Upload Area - The "Canvas" */}
          <div className="bg-[#f0f0f0] dark:bg-[#0a0a0a] rounded-xl overflow-hidden min-h-[500px] flex flex-col relative border border-slate-200 dark:border-[#222]">
            {/* Toolbar (Visual Only) */}
            <div className="h-10 bg-slate-200 dark:bg-[#111] border-b border-slate-300 dark:border-[#222] flex items-center px-4 gap-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/20"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400/20"></div>
                <div className="h-3 w-3 rounded-full bg-green-400/20"></div>
              </div>
              <span className="text-xs font-mono text-slate-400 dark:text-[#444] uppercase tracking-wider">Media Canvas</span>
            </div>

            {/* Upload Zone */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center relative group">
              {previewImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={previewImage} alt="Preview" className="max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg" />

                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer">
                    <UploadCloud className="h-16 w-16 text-white mb-4 animate-bounce" />
                    <span className="text-xl font-light text-white tracking-widest uppercase">Cambiar Contenido</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 rounded-full bg-[#151515] flex items-center justify-center mx-auto border border-[#222] group-hover:border-purple-500/50 group-hover:scale-105 transition-all duration-500 relative">
                    <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse delay-75"></div>
                    <ImageIcon className="h-12 w-12 text-[#444] group-hover:text-purple-400 transition-colors" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-slate-700 dark:text-[#ddd] mb-2">Carga tu arte aquí</h3>
                    <p className="text-slate-500 dark:text-[#555] max-w-sm mx-auto">
                      Arrastra y suelta o haz clic para subir imágenes (JPG, PNG, GIF) o videos (MP4).
                      <br /> <span className="text-xs opacity-50">Hasta 15MB por archivo.</span>
                    </p>
                  </div>
                  <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-colors">
                    Seleccionar Archivos
                  </button>
                  {/* Invisible Input covering the button area as well just in case */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>Asegúrate de que tienes los derechos para publicar este contenido. El contenido pirata o robado será eliminado inmediatamente.</p>
          </div>

        </div>

        {/* Sidebar - Details */}
        <div className="lg:col-span-4 space-y-8">

          {/* Description */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 dark:text-[#666] uppercase tracking-widest flex items-center gap-2">
              <Type className="h-4 w-4" /> Descripción
            </label>
            <textarea
              rows={8}
              placeholder="Cuenta la historia detrás de tu proyecto..."
              className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#222] rounded-xl px-4 py-3 text-slate-900 dark:text-[#ccc] focus:outline-none focus:border-purple-500 focus:bg-[#151515] transition-all resize-none text-sm leading-relaxed"
            ></textarea>
          </div>

          {/* Tags with "chips" look */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 dark:text-[#666] uppercase tracking-widest flex items-center gap-2">
              <Target className="h-4 w-4" /> Etiquetas
            </label>

            <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#222]">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Añadir etiqueta"
                  className="flex-1 bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#444] text-sm focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                />
                <button onClick={handleAddTag} className="text-slate-400 hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="h-px bg-slate-200 dark:bg-[#222] mb-3"></div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-[#1c1c1c] text-slate-700 dark:text-[#aaa] text-xs hover:bg-slate-300 dark:hover:bg-[#252525] transition-colors cursor-default">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className="text-xs text-slate-400 dark:text-[#333] italic">Sin etiquetas</span>
                )}
              </div>
            </div>
          </div>

          {/* Team / Collaborators */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 dark:text-[#666] uppercase tracking-widest flex items-center gap-2">
              <Users className="h-4 w-4" /> Equipo / Créditos
            </label>

            <div className="bg-slate-50 dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-[#222] space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="Rol (ej: Artista 3D)"
                  className="flex-1 bg-slate-200 dark:bg-[#1a1a1a] rounded px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRole(e)}
                />
                <button
                  onClick={handleAddRole}
                  className="bg-slate-300 dark:bg-[#2a2a2a] hover:bg-slate-400 dark:hover:bg-[#333] text-slate-700 dark:text-white p-2 rounded transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {roles.map((role, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-100 dark:bg-[#0f0f0f] border border-slate-200 dark:border-[#1f1f1f]">
                    <span className="text-sm text-slate-600 dark:text-[#999]">{role}</span>
                    <button onClick={() => removeRole(role)} className="text-slate-400 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Action Footer for Mobile, mostly hidden on Desktop since we have header actions */}
          <div className="block lg:hidden pt-8">
            <button
              onClick={handleSubmit}
              disabled={formStatus === 'submitting'}
              className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl"
            >
              Publicar Proyecto
            </button>
          </div>

        </div>
      </div>
    </CreatePageLayout>
  );
};
