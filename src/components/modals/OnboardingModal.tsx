import React, { useState, useEffect } from 'react';
import { useAppStore, SocialLinks } from '../../hooks/useAppStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LATAM_COUNTRIES } from '../../data/countries';
import { User, MapPin, Briefcase, Save, ArrowRight, SkipForward } from 'lucide-react';
import { TagInput } from '../ui/TagInput';
import { COMMON_TAGS } from '../../data/tags';
import { COMMON_ROLES } from '../../data/roles';

export const OnboardingModal: React.FC = () => {
    const { state, actions } = useAppStore();
    const { user } = state;
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
    const [loading, setLoading] = useState(false);

    // Suggestions State
    const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState<string[]>([]);

    useEffect(() => {
        // Show if user is logged in AND hasn't completed onboarding
        // We track "completed" via a flag in local storage for "skip" or checking if location is still default 'Latam'
        // For this requirement: "when a new user registers... fill info... skip button"

        if (user) {
            // Check if we should show it
            const hasSkipped = localStorage.getItem(`onboarding_skipped_${user.id}`);
            const isIncomplete = user.location === 'Latam' || !user.location; // Default is 'Latam'

            if (isIncomplete && !hasSkipped) {
                setIsOpen(true);
                // Pre-fill
                setName(user.name || '');
                setRole(user.role || '');
                setLocation(''); // Force selection? or show 'Latam' -> Better force selection so leave empty if they want to change
                setBio(user.bio || '');
                setSkills(user.skills || []);
                setSocialLinks(user.socialLinks || {});
            } else {
                setIsOpen(false);
            }
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSave = async () => {
        if (!location) {
            actions.showToast('Por favor selecciona tu país', 'error');
            return;
        }

        setLoading(true);
        try {
            const updatedUser = {
                ...user,
                name,
                role,
                location: location || 'Latam', // Fallback if they didn't select but clicked save?
                bio,
                skills,
                socialLinks,
                // We could add a onboarded: true flag to firestore if we wanted
            };

            // Update Firestore
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
                name,
                role,
                location: location || 'Latam',
                bio,
                skills,
                socialLinks
            });

            // Update Local
            actions.setUser(updatedUser);
            actions.showToast('¡Perfil completado! Bienvenido.', 'success');
            setIsOpen(false);

        } catch (error) {
            console.error("Error saving profile:", error);
            actions.showToast('Error al guardar perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        // Mark as skipped in LocalStorage so it doesn't annoy them this session/browser
        // Or better: don't show again unless they go to profile.
        localStorage.setItem(`onboarding_skipped_${user.id}`, 'true');
        setIsOpen(false);
        actions.showToast('Puedes completar tu perfil más tarde en la configuración.', 'info');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0F1115] w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="p-8 pb-4 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">¡Bienvenido a Latam Creativa! 🚀</h1>
                    <p className="text-slate-400">
                        Cuéntanos un poco más sobre ti para personalizar tu experiencia.
                    </p>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-8 custom-scrollbar">

                    {/* 1. Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Información Básica</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500 outline-none transition-colors"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">País</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500 outline-none transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Selecciona tu país</option>
                                        {LATAM_COUNTRIES.map(c => (
                                            <option key={c} value={c} className="bg-[#0F1115]">{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 relative">
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
                                    onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 200)} // Delay to allow click
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500 outline-none transition-colors"
                                    placeholder="ej. UX Designer, Frontend Dev, 3D Artist"
                                />
                            </div>
                            {/* Role Suggestions Dropdown */}
                            {showRoleSuggestions && filteredRoles.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-[#1A1D23] border border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                                    {filteredRoles.map((r) => (
                                        <div
                                            key={r}
                                            className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-slate-300 hover:text-white transition-colors"
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

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Biografía</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full p-4 rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500 outline-none transition-colors min-h-[100px]"
                                placeholder="¿Qué te apasiona? ¿Qué estás buscando?"
                            />
                        </div>
                    </div>

                    {/* 2. Skills */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Habilidades</h3>
                        <TagInput
                            tags={skills}
                            onAddTag={(tag) => !skills.includes(tag) && setSkills([...skills, tag])}
                            onRemoveTag={(tag) => setSkills(skills.filter(s => s !== tag))}
                            suggestions={COMMON_TAGS}
                            placeholder="Añadir habilidades (Enter)"
                        />
                    </div>

                    {/* 3. Socials */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Redes Sociales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={socialLinks.linkedin || ''}
                                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500 outline-none"
                                placeholder="LinkedIn Username"
                            />
                            <input
                                type="text"
                                value={socialLinks.artstation || ''}
                                onChange={(e) => setSocialLinks({ ...socialLinks, artstation: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500 outline-none"
                                placeholder="ArtStation Username"
                            />
                            <input
                                type="text"
                                value={socialLinks.instagram || ''}
                                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500 outline-none"
                                placeholder="Instagram Handle"
                            />
                            <input
                                type="text"
                                value={socialLinks.website || ''}
                                onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-amber-500 outline-none"
                                placeholder="Website URL"
                            />
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 flex justify-between items-center bg-[#0A0B0E]">
                    <button
                        onClick={handleSkip}
                        className="text-slate-500 hover:text-white font-medium flex items-center gap-2 px-4 py-2 transition-colors"
                    >
                        Omitir por ahora <SkipForward className="h-4 w-4" />
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`px-8 py-3 rounded-xl font-bold bg-amber-500 text-black hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? 'Guardando...' : 'Completar Perfil'}
                        {!loading && <ArrowRight className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
