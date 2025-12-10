
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Briefcase, GraduationCap, User, MapPin } from 'lucide-react';
import { useAppStore, ExperienceItem, EducationItem, SocialLinks } from '../../hooks/useAppStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TagInput } from '../ui/TagInput';
import { COMMON_TAGS } from '../../data/tags';
import { COMMON_ROLES } from '../../data/roles';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const { state, actions } = useAppStore();
    const user = state.user;

    const [activeTab, setActiveTab] = useState<'general' | 'experience' | 'education' | 'social'>('general');

    // Form States
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState<ExperienceItem[]>([]);
    const [education, setEducation] = useState<EducationItem[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
    const [availableForWork, setAvailableForWork] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    // Suggestions State
    const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState<string[]>([]);

    // Initialize state from User Store when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name || '');
            setRole(user.role || '');
            setLocation(user.location || '');
            setBio(user.bio || '');
            setExperience(user.experience || []);
            setEducation(user.education || []);
            setSkills(user.skills || []);
            setSocialLinks(user.socialLinks || {});
            setAvailableForWork(user.availableForWork || false);
        }
    }, [isOpen, user]);

    if (!isOpen || !user) return null;

    const handleSave = async () => {
        try {
            // Determine Content Mode based on Role
            const devKeywords = ['developer', 'desarrollador', 'engineer', 'ingeniero', 'coder', 'programmer', 'programador', 'software', 'tech', 'web', 'app', 'mobile', 'backend', 'frontend', 'fullstack', 'devops', 'data', 'ai'];
            const lowerRole = role.toLowerCase();
            const isDevRole = devKeywords.some(k => lowerRole.includes(k));
            const newMode: 'dev' | 'creative' = isDevRole ? 'dev' : 'creative';

            const updatedUser = {
                ...user,
                name,
                role,
                location,
                bio,
                experience,
                education,
                skills,
                socialLinks,
                availableForWork
            };

            // Update Firestore
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
                name,
                role,
                location,
                bio,
                experience,
                education,
                skills,
                socialLinks,
                availableForWork
            });

            // Update Local
            actions.setUser(updatedUser);

            // Switch Mode if needed
            if (state.contentMode !== newMode) {
                actions.setContentMode(newMode);
                actions.showToast(`Perfil actualizado y modo ${newMode === 'dev' ? 'Developer' : 'Creativo'} activado`, 'info');
            } else {
                actions.showToast('Perfil actualizado correctamente', 'success');
            }

            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            actions.showToast('Error al actualizar el perfil', 'error');
        }
    };

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
        setExperience([...experience, newExp]);
    };

    const updateExperience = (id: number | string, field: keyof ExperienceItem, value: string) => {
        setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const removeExperience = (id: number | string) => {
        setExperience(experience.filter(exp => exp.id !== id));
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
        setEducation([...education, newEdu]);
    };

    const updateEducation = (id: number | string, field: keyof EducationItem, value: string) => {
        setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };

    const removeEducation = (id: number | string) => {
        setEducation(education.filter(edu => edu.id !== id));
    };

    // --- Skills Handlers ---
    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rol Profesional</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={role}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setRole(val);
                                                setFilteredRoles(COMMON_ROLES.filter(r => r.toLowerCase().includes(val.toLowerCase())));
                                                setShowRoleSuggestions(true);
                                            }}
                                            onFocus={() => {
                                                setFilteredRoles(COMMON_ROLES.filter(r => r.toLowerCase().includes(role.toLowerCase())));
                                                setShowRoleSuggestions(true);
                                            }}
                                            onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 200)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                            placeholder="ej. Concept Artist"
                                        />
                                        {/* Suggestions Dropdown */}
                                        {showRoleSuggestions && filteredRoles.length > 0 && (
                                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1A1D23] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                                                {filteredRoles.map((r) => (
                                                    <div
                                                        key={r}
                                                        className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors"
                                                        onClick={() => {
                                                            setRole(r);
                                                            setShowRoleSuggestions(false);
                                                        }}
                                                    >
                                                        {r}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Ubicación</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                        placeholder="Ciudad, País"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Biografía</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
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
                                {experience.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                                        <Briefcase className="h-10 w-10 text-slate-400 mx-auto mb-3 opacity-50" />
                                        <p className="text-slate-500">No tienes experiencia registrada.</p>
                                    </div>
                                ) : (
                                    experience.map((exp, index) => (
                                        <div key={exp.id} className="p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative group">
                                            <button
                                                onClick={() => removeExperience(exp.id)}
                                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>

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
                                {education.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                                        <GraduationCap className="h-10 w-10 text-slate-400 mx-auto mb-3 opacity-50" />
                                        <p className="text-slate-500">No tienes formación registrada.</p>
                                    </div>
                                ) : (
                                    education.map((edu, index) => (
                                        <div key={edu.id} className="p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative group">
                                            <button
                                                onClick={() => removeEducation(edu.id)}
                                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>

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
                                    tags={skills}
                                    onAddTag={(tag) => {
                                        if (!skills.includes(tag)) {
                                            setSkills([...skills, tag]);
                                        }
                                    }}
                                    onRemoveTag={(tag) => setSkills(skills.filter(s => s !== tag))}
                                    suggestions={COMMON_TAGS}
                                    placeholder="Busca o añade una habilidad..."
                                />

                                {skills.length === 0 && <p className="text-sm text-slate-500">Añade tus habilidades principales.</p>}
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
                                            value={socialLinks.artstation || ''}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, artstation: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">LinkedIn</label>
                                        <input
                                            type="text"
                                            value={socialLinks.linkedin || ''}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="usuario-linkedin"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Twitter / X</label>
                                        <input
                                            type="text"
                                            value={socialLinks.twitter || ''}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="@usuario"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Instagram</label>
                                        <input
                                            type="text"
                                            value={socialLinks.instagram || ''}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="@usuario"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">GitHub</label>
                                        <input
                                            type="text"
                                            value={socialLinks.github || ''}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500"
                                            placeholder="usuario"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Website Personal</label>
                                        <input
                                            type="text"
                                            value={socialLinks.website || ''}
                                            onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
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
                                    onClick={() => setAvailableForWork(!availableForWork)}
                                    className={`w-14 h-8 rounded-full transition-colors relative ${availableForWork ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${availableForWork ? 'translate-x-6' : 'translate-x-0'}`} />
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
                        className="px-8 py-3 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Guardar Cambios
                    </button>
                </div>

            </div>
        </div>
    );
};
