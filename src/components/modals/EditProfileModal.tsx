import React, { useState, useRef } from 'react';
import { X, Save, Plus, Trash2, Briefcase, GraduationCap, User, MapPin, Globe, GripVertical } from 'lucide-react';
import { ExperienceItem, EducationItem, SocialLinks } from '../../types';
import { TagInput } from '../ui/TagInput';
import { COMMON_TAGS } from '../../data/tags';
import { COMMON_ROLES } from '../../data/roles';
import { LATAM_COUNTRIES } from '../../data/countries';
import { useEditProfile } from '../../hooks/useEditProfile';
import { useDraggableList } from '../../hooks/useDraggableList';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const {
        user,
        activeTab,
        setActiveTab,
        formData,
        handleInputChange,
        collections,
        updateCollection,
        images,
        handleImageChange,
        suggestions,
        setSuggestions,
        usernameError,
        isSaving,
        handleSave
    } = useEditProfile(isOpen, onClose);

    const fileInputAvatarRef = useRef<HTMLInputElement>(null);
    const fileInputCoverRef = useRef<HTMLInputElement>(null);

    // --- Experience Hook ---
    const experienceDrag = useDraggableList(
        collections.experience,
        (newItems) => updateCollection('experience', newItems)
    );

    // --- Education Hook ---
    const educationDrag = useDraggableList(
        collections.education,
        (newItems) => updateCollection('education', newItems)
    );

    if (!isOpen || !user) return null;

    // --- Experience Handlers ---
    const addExperience = () => {
        const newExp: ExperienceItem = {
            id: Date.now(),
            role: 'Nuevo Rol',
            company: 'Empresa',
            period: '2023 - Presente',
            location: 'Ciudad, País',
            description: 'Descripción del puesto...'
        };
        updateCollection('experience', [...collections.experience, newExp]);
    };

    const updateExperience = (id: number | string, field: keyof ExperienceItem, value: string) => {
        updateCollection('experience', collections.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const removeExperience = (id: number | string) => {
        updateCollection('experience', collections.experience.filter(exp => exp.id !== id));
    };

    // --- Education Handlers ---
    const addEducation = () => {
        const newEdu: EducationItem = {
            id: Date.now(),
            degree: 'Nuevo Título',
            school: 'Institución',
            period: '2020 - 2024',
            description: 'Descripción de los estudios...'
        };
        updateCollection('education', [...collections.education, newEdu]);
    };

    const updateEducation = (id: number | string, field: keyof EducationItem, value: string) => {
        updateCollection('education', collections.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };

    const removeEducation = (id: number | string) => {
        updateCollection('education', collections.education.filter(edu => edu.id !== id));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) handleImageChange(file, type);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#08080A] w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Editar Perfil</h2>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-white/5 px-6">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Información General
                    </button>
                    <button
                        onClick={() => setActiveTab('experience')}
                        className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'experience' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Experiencia
                    </button>
                    <button
                        onClick={() => setActiveTab('education')}
                        className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'education' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Educación
                    </button>
                    <button
                        onClick={() => setActiveTab('social')}
                        className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'social' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Social y Habilidades
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="relative h-48 md:h-64 bg-slate-900">
                                <img
                                    src={images.previewCover || user.coverImage || "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop"}
                                    alt="Cover"
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#030304] to-transparent"></div>

                                {/* Change Cover Button */}
                                <button
                                    onClick={() => fileInputCoverRef.current?.click()}
                                    className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg border border-white/10 transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                                    <span className="text-sm font-medium">Cambiar Portada</span>
                                </button>
                                <div className="absolute top-4 right-4 px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-xs text-white/70">
                                    Recomendado: 1500x500px • Máx 5MB
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputCoverRef}
                                    onChange={(e) => handleFileSelect(e, 'cover')}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div className="px-6 md:px-12 relative -mt-12 md:-mt-14 z-10">
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                                    <div className="relative group shrink-0">
                                        <div className="h-36 w-36 md:h-44 md:w-44 rounded-3xl p-1 bg-[#030304]">
                                            <img
                                                src={images.previewAvatar || user.avatar || "https://cdn.ui-avatars.com/api/?name=User&background=random"}
                                                alt="Avatar"
                                                className="w-full h-full object-cover rounded-2xl bg-slate-800 border-4 border-[#030304]"
                                            />
                                            {/* Change Avatar Overlay */}
                                            <div
                                                onClick={() => fileInputAvatarRef.current?.click()}
                                                className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                                                <span className="text-[10px] text-white/80 font-medium px-2 text-center">400x400px<br />Máx 5MB</span>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputAvatarRef}
                                                onChange={(e) => handleFileSelect(e, 'avatar')}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Nombres y Apellidos */}
                                    <div className="flex-1 w-full pb-1">
                                        <div className="flex flex-col gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombres *</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={formData.firstName}
                                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                                        placeholder="Tus nombres"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Apellidos *</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={formData.lastName}
                                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                                        placeholder="Tus apellidos"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rol Profesional *</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => handleInputChange('role', e.target.value)}
                                        onFocus={() => setSuggestions(prev => ({ ...prev, showRole: true }))}
                                        onBlur={() => setTimeout(() => setSuggestions(prev => ({ ...prev, showRole: false })), 200)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                        placeholder="ej. Concept Artist"
                                    />
                                    {/* Suggestions Dropdown */}
                                    {suggestions.showRole && suggestions.filteredRoles.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1A1D23] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                                            {suggestions.filteredRoles.map((r) => (
                                                <div
                                                    key={r}
                                                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors"
                                                    onClick={() => {
                                                        handleInputChange('role', r);
                                                        setSuggestions(prev => ({ ...prev, showRole: false }));
                                                    }}
                                                >
                                                    {r}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre de Usuario *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-slate-400 font-bold">@</span>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                                        className={`w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border ${usernameError ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white`}
                                        placeholder="username"
                                    />
                                </div>
                                {usernameError && <p className="text-xs text-red-500">{usernameError}</p>}
                                <p className="text-[10px] text-slate-500">latamcreativa.com/user/{formData.username || 'username'}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">País *</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
                                        <select
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Selecciona tu país</option>
                                            {LATAM_COUNTRIES.map((c) => (
                                                <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Ciudad</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                            placeholder="Ciudad"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Biografía</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white min-h-[150px]"
                                    placeholder="Cuéntanos sobre ti..."
                                />
                                <p className="text-xs text-slate-500 text-right">Breve descripción que aparecerá en tu perfil.</p>
                            </div>
                        </div>
                    )}

                    {/* EXPERIENCE TAB */}
                    {activeTab === 'experience' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Historial Laboral</h3>
                                <button
                                    onClick={addExperience}
                                    className="px-4 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                >
                                    <Plus className="h-4 w-4" /> Añadir Puesto
                                </button>
                            </div>

                            <div className="space-y-4">
                                {collections.experience.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                                        <Briefcase className="h-10 w-10 text-slate-400 mx-auto mb-3 opacity-50" />
                                        <p className="text-slate-500">No tienes experiencia registrada.</p>
                                    </div>
                                ) : (
                                    collections.experience.map((exp, index) => (
                                        <div
                                            key={exp.id}
                                            // Draggable attributes moved to handle
                                            onDragEnter={() => experienceDrag.handleDragEnter(index)}
                                            onDragOver={experienceDrag.handleDragOver}
                                            onDrop={() => experienceDrag.handleDrop(index)}
                                            className={`p-5 rounded-xl bg-slate-50 dark:bg-white/5 border relative group transition-all duration-200 ${experienceDrag.draggedItemIndex === index ? 'opacity-50 border-dashed border-amber-500' : 'border-slate-200 dark:border-white/10'} ${experienceDrag.dragOverItemIndex === index && experienceDrag.draggedItemIndex !== index ? 'border-amber-500 ring-1 ring-amber-500' : ''}`}
                                        >
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => removeExperience(exp.id)}
                                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>

                                            {/* Drag Handle */}
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-4 p-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                draggable
                                                onDragStart={(e) => experienceDrag.handleDragStart(e, index)}
                                                onDragEnd={experienceDrag.handleDragEnd}
                                            >
                                                <GripVertical className="h-5 w-5" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500">Cargo</label>
                                                    <input
                                                        type="text"
                                                        value={exp.role}
                                                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm font-medium outline-none focus:border-amber-500"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500">Empresa</label>
                                                    <input
                                                        type="text"
                                                        value={exp.company}
                                                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm font-medium outline-none focus:border-amber-500"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500">Período</label>
                                                    <input
                                                        type="text"
                                                        value={exp.period}
                                                        onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-amber-500"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500">Ubicación</label>
                                                    <input
                                                        type="text"
                                                        value={exp.location}
                                                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-amber-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase text-slate-500">Descripción</label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-amber-500 min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* EDUCATION TAB */}
                    {activeTab === 'education' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Formación Académica</h3>
                                <button
                                    onClick={addEducation}
                                    className="px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                >
                                    <Plus className="h-4 w-4" /> Añadir Educación
                                </button>
                            </div>

                            <div className="space-y-4">
                                {collections.education.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                                        <GraduationCap className="h-10 w-10 text-slate-400 mx-auto mb-3 opacity-50" />
                                        <p className="text-slate-500">No tienes formación registrada.</p>
                                    </div>
                                ) : (
                                    collections.education.map((edu, index) => (
                                        <div
                                            key={edu.id}
                                            // Draggable attributes moved to handle
                                            onDragEnter={() => educationDrag.handleDragEnter(index)}
                                            onDragOver={educationDrag.handleDragOver}
                                            onDrop={() => educationDrag.handleDrop(index)}
                                            className={`p-5 rounded-xl bg-slate-50 dark:bg-white/5 border relative group transition-all duration-200 ${educationDrag.draggedItemIndex === index ? 'opacity-50 border-dashed border-blue-500' : 'border-slate-200 dark:border-white/10'} ${educationDrag.dragOverItemIndex === index && educationDrag.draggedItemIndex !== index ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                                        >
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => removeEducation(edu.id)}
                                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>

                                            {/* Drag Handle */}
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-4 p-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                draggable
                                                onDragStart={(e) => educationDrag.handleDragStart(e, index)}
                                                onDragEnd={educationDrag.handleDragEnd}
                                            >
                                                <GripVertical className="h-5 w-5" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500">Título / Grado</label>
                                                    <input
                                                        type="text"
                                                        value={edu.degree}
                                                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm font-medium outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500">Institución</label>
                                                    <input
                                                        type="text"
                                                        value={edu.school}
                                                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm font-medium outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500">Período</label>
                                                    <input
                                                        type="text"
                                                        value={edu.period}
                                                        onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase text-slate-500">Descripción</label>
                                                <textarea
                                                    value={edu.description}
                                                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-sm outline-none focus:border-blue-500 min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* SOCIAL & SKILLS TAB */}
                    {activeTab === 'social' && (
                        <div className="space-y-8 max-w-2xl mx-auto">

                            {/* Skills Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Habilidades</h3>

                                <TagInput
                                    tags={collections.skills}
                                    onAddTag={(tag) => {
                                        if (!collections.skills.includes(tag)) {
                                            updateCollection('skills', [...collections.skills, tag]);
                                        }
                                    }}
                                    onRemoveTag={(tag) => updateCollection('skills', collections.skills.filter(s => s !== tag))}
                                    suggestions={COMMON_TAGS}
                                    placeholder="Busca o añade una habilidad..."
                                />

                                {collections.skills.length === 0 && <p className="text-sm text-slate-500">Añade tus habilidades principales.</p>}
                            </div>

                            <hr className="border-slate-100 dark:border-white/10" />

                            {/* Social Links Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Redes Sociales</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">ArtStation</label>
                                        <input
                                            type="text"
                                            value={collections.socialLinks.artstation || ''}
                                            onChange={(e) => updateCollection('socialLinks', { ...collections.socialLinks, artstation: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">LinkedIn</label>
                                        <input
                                            type="text"
                                            value={collections.socialLinks.linkedin || ''}
                                            onChange={(e) => updateCollection('socialLinks', { ...collections.socialLinks, linkedin: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="usuario-linkedin"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Twitter / X</label>
                                        <input
                                            type="text"
                                            value={collections.socialLinks.twitter || ''}
                                            onChange={(e) => updateCollection('socialLinks', { ...collections.socialLinks, twitter: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="@usuario"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Instagram</label>
                                        <input
                                            type="text"
                                            value={collections.socialLinks.instagram || ''}
                                            onChange={(e) => updateCollection('socialLinks', { ...collections.socialLinks, instagram: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="@usuario"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">GitHub</label>
                                        <input
                                            type="text"
                                            value={collections.socialLinks.github || ''}
                                            onChange={(e) => updateCollection('socialLinks', { ...collections.socialLinks, github: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="usuario"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Website Personal</label>
                                        <input
                                            type="text"
                                            value={collections.socialLinks.website || ''}
                                            onChange={(e) => updateCollection('socialLinks', { ...collections.socialLinks, website: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="https://miweb.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-white/10" />

                            {/* Availability Section */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Disponible para trabajar</h3>
                                    <p className="text-sm text-slate-500">Muestra en tu perfil que estás buscando nuevas oportunidades.</p>
                                </div>
                                <button
                                    onClick={() => handleInputChange('availableForWork', !formData.availableForWork)}
                                    className={`w-14 h-8 rounded-full transition-colors relative ${formData.availableForWork ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.availableForWork ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${isSaving
                            ? 'bg-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                            }`}
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};
