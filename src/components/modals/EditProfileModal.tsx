import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Briefcase, GraduationCap, User, MapPin, Globe, GripVertical } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { ExperienceItem, EducationItem, SocialLinks } from '../../types';
import { usersService } from '../../services/modules/users';
import { storageService } from '../../services/modules/storage';
import { TagInput } from '../ui/TagInput';
import { COMMON_TAGS } from '../../data/tags';
import { COMMON_ROLES } from '../../data/roles';
import { LATAM_COUNTRIES } from '../../data/countries';

import { useNavigate } from 'react-router-dom';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const { state, actions } = useAppStore();
    const user = state.user;
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'general' | 'experience' | 'education' | 'social'>('general');

    // Form States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [location, setLocation] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState<ExperienceItem[]>([]);
    const [education, setEducation] = useState<EducationItem[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
    const [availableForWork, setAvailableForWork] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    // Drag and Drop State
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

    // Image Upload State
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
    const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(null);

    const fileInputAvatarRef = React.useRef<HTMLInputElement>(null);
    const fileInputCoverRef = React.useRef<HTMLInputElement>(null);

    // Suggestions State
    const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState<string[]>([]);

    // Initialize state from User Store when modal opens
    useEffect(() => {
        const fetchUserData = async () => {
            if (isOpen && user) {
                try {
                    // Fetch latest from DB to ensure no staleness
                    const dbUser = await usersService.getUserProfile(user.id);
                    const userData = dbUser || user; // Fallback to local user if DB fails

                    // Split name logic if separate fields missing
                    if (userData.firstName && userData.lastName) {
                        setFirstName(userData.firstName);
                        setLastName(userData.lastName);
                    } else if (userData.name) {
                        const parts = userData.name.split(' ');
                        setFirstName(parts[0] || '');
                        setLastName(parts.slice(1).join(' ') || '');
                    } else {
                        setFirstName('');
                        setLastName('');
                    }

                    setUsername(userData.username || '');
                    setRole(userData.role || '');
                    setLocation(userData.location || '');
                    setBio(userData.bio || '');
                    setExperience(userData.experience || []);
                    setEducation(userData.education || []);
                    setSkills(userData.skills || []);
                    setSocialLinks(userData.socialLinks || {});
                    setAvailableForWork(userData.availableForWork || false);

                    // Granular Location Logic
                    if (userData.country && userData.city) {
                        setCountry(userData.country);
                        setCity(userData.city);
                    } else if (userData.location && userData.location.includes(',')) {
                        // Attempt to split "City, Country"
                        const parts = userData.location.split(',');
                        if (parts.length >= 2) {
                            setCity(parts[0].trim());
                            setCountry(parts[1].trim());
                        } else {
                            setCity(userData.location);
                        }
                    } else {
                        setCity(userData.location || '');
                    }
                } catch (err) {
                    console.error("Error fetching fresh profile:", err);
                    // Fallback to local state
                    if (user.firstName && user.lastName) {
                        setFirstName(user.firstName);
                        setLastName(user.lastName);
                    } else if (user.name) {
                        const parts = user.name.split(' ');
                        setFirstName(parts[0] || '');
                        setLastName(parts.slice(1).join(' ') || '');
                    }
                    // ... (rest of fallback assignment if needed, but simple console log is enough as we default to 'user' above)
                }
            }
        };

        fetchUserData();
    }, [isOpen, user?.id]); // Only trigger if ID changes or opens

    if (!isOpen || !user) return null;

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validation (5MB and Image Type) - Quick Check before setting state
        if (!file.type.startsWith('image/')) {
            actions.showToast('Solo se permiten archivos de imagen', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            actions.showToast('La imagen debe pesar menos de 5MB', 'error');
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        if (type === 'avatar') {
            setSelectedAvatarFile(file);
            setPreviewAvatarUrl(previewUrl);
        } else {
            setSelectedCoverFile(file);
            setPreviewCoverUrl(previewUrl);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            // 1. Validate Required Fields
            if (!firstName.trim() || !lastName.trim() || !username.trim() || !role.trim() || !country.trim()) {
                actions.showToast('Por favor completa todos los campos obligatorios (*)', 'error');
                setIsSaving(false);
                return;
            }

            // Validate Username Format
            const usernameRegex = /^(?![0-9]+$)(?![0-9])(?![-_])(?!.*[-_]$)[a-zA-Z0-9-_]{3,63}$/;
            if (!usernameRegex.test(username)) {
                setUsernameError('Nombre de usuario inválido (3-63 caracteres, sin espacios, no puede empezar con números)');
                setIsSaving(false);
                return;
            }

            // Check Availability if changed
            if (username !== user?.username) {
                setIsCheckingUsername(true);
                const isAvailable = await usersService.checkUsernameAvailability(username);
                setIsCheckingUsername(false);
                if (!isAvailable) {
                    setUsernameError('Este nombre de usuario ya está en uso');
                    setIsSaving(false);
                    return;
                }
            }

            // Determine Content Mode based on Role
            const devKeywords = ['developer', 'desarrollador', 'engineer', 'ingeniero', 'coder', 'programmer', 'programador', 'software', 'tech', 'web', 'app', 'mobile', 'backend', 'frontend', 'fullstack', 'devops', 'data', 'ai'];
            const lowerRole = role.toLowerCase();
            const isDevRole = devKeywords.some(k => lowerRole.includes(k));
            const newMode: 'dev' | 'creative' = isDevRole ? 'dev' : 'creative';

            // 2. Upload Images if selected
            let newAvatarUrl = user.avatar;
            let newCoverUrl = user.coverImage;

            if (selectedAvatarFile) {
                // Determine path: users/{uid}/avatar.jpg (or timestamped to avoid caching issues)
                const path = `users/${state.user!.id}/avatar_${Date.now()}.jpg`;
                newAvatarUrl = await storageService.uploadImage(selectedAvatarFile, path);
            }

            if (selectedCoverFile) {
                const path = `users/${state.user!.id}/cover_${Date.now()}.jpg`;
                newCoverUrl = await storageService.uploadImage(selectedCoverFile, path);
            }

            // 3. Prepare Updated User Object
            const updatedUser = {
                ...state.user!,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                name: `${firstName.trim()} ${lastName.trim()}`, // Keep 'name' for backward compatibility if needed
                username: username.trim(),
                role: role.trim(),
                bio: bio.trim(), // Changed from 'about' to 'bio' to match existing state
                country: country,
                city: city.trim(),
                avatar: newAvatarUrl,
                coverImage: newCoverUrl,
                availableForWork,
                experience,
                education,
                skills, // Added skills
                socialLinks: {
                    ...state.user!.socialLinks,
                    ...socialLinks,
                },
                location: city.trim() ? `${city.trim()}, ${country}` : country, // Simple Fallback
            };

            // 4. Update Firestore
            await usersService.updateUserProfile(state.user!.id, updatedUser); // Changed to updateUserProfile and user.id

            // 5. Update Local Store
            actions.setUser(updatedUser);

            // Switch Mode if needed
            if (state.contentMode !== newMode) {
                actions.setContentMode(newMode);
                actions.showToast(`Perfil actualizado y modo ${newMode === 'dev' ? 'Developer' : 'Creativo'} activado`, 'info');
            } else {
                actions.showToast('Perfil actualizado correctamente', 'success');
            }

            onClose();

            // Redirect if username changed or just to ensure URL is correct
            if (username) {
                navigate(`/user/${username}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            actions.showToast('Error al actualizar el perfil', 'error');
        } finally {
            setIsSaving(false);
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

    // --- Drag and Drop Handlers (Experience) ---
    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    const handleDragEnter = (index: number) => {
        setDragOverItemIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
        setDragOverItemIndex(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (index: number) => {
        if (draggedItemIndex === null) return;

        const items = [...experience];
        const draggedItem = items[draggedItemIndex];

        // Remove from old position
        items.splice(draggedItemIndex, 1);
        // Insert at new position
        items.splice(index, 0, draggedItem);

        setExperience(items);
        setDraggedItemIndex(null);
        setDragOverItemIndex(null);
    };

    // --- Drag and Drop Handlers (Education) ---
    const handleDropEdu = (index: number) => {
        if (draggedItemIndex === null) return;

        const items = [...education];
        const draggedItem = items[draggedItemIndex];

        items.splice(draggedItemIndex, 1);
        items.splice(index, 0, draggedItem);

        setEducation(items);
        setDraggedItemIndex(null);
        setDragOverItemIndex(null);
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
                            <div className="relative h-48 md:h-64 bg-slate-900">
                                <img
                                    src={previewCoverUrl || user.coverImage || "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop"}
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
                                    onChange={(e) => handleImageChange(e, 'cover')}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div className="px-6 md:px-12 relative -mt-16 md:-mt-20 z-10">
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end">
                                    <div className="relative group">
                                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl p-1 bg-[#030304]">
                                            <img
                                                src={previewAvatarUrl || user.avatar || "https://cdn.ui-avatars.com/api/?name=User&background=random"}
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
                                                onChange={(e) => handleImageChange(e, 'avatar')}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Nombres y Apellidos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombres *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                            placeholder="Tus nombres"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Apellidos *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                            placeholder="Tus apellidos"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rol Profesional *</label>
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

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre de Usuario *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-slate-400 font-bold">@</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value.toLowerCase());
                                            setUsernameError('');
                                        }}
                                        className={`w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border ${usernameError ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white`}
                                        placeholder="username"
                                    />
                                </div>
                                {usernameError && <p className="text-xs text-red-500">{usernameError}</p>}
                                <p className="text-[10px] text-slate-500">latamcreativa.com/user/{username || 'username'}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">País *</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
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
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                            placeholder="Ciudad"
                                        />
                                    </div>
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
                                        <div
                                            key={exp.id}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragEnter={() => handleDragEnter(index)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={handleDragOver}
                                            onDrop={() => handleDrop(index)}
                                            className={`p-5 rounded-xl bg-slate-50 dark:bg-white/5 border relative group transition-all duration-200 ${draggedItemIndex === index ? 'opacity-50 border-dashed border-amber-500' : 'border-slate-200 dark:border-white/10'} ${dragOverItemIndex === index && draggedItemIndex !== index ? 'border-amber-500 ring-1 ring-amber-500' : ''}`}
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
                                            <div className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-4 p-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                {education.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                                        <GraduationCap className="h-10 w-10 text-slate-400 mx-auto mb-3 opacity-50" />
                                        <p className="text-slate-500">No tienes formación registrada.</p>
                                    </div>
                                ) : (
                                    education.map((edu, index) => (
                                        <div
                                            key={edu.id}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragEnter={() => handleDragEnter(index)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={handleDragOver}
                                            onDrop={() => handleDropEdu(index)}
                                            className={`p-5 rounded-xl bg-slate-50 dark:bg-white/5 border relative group transition-all duration-200 ${draggedItemIndex === index ? 'opacity-50 border-dashed border-blue-500' : 'border-slate-200 dark:border-white/10'} ${dragOverItemIndex === index && draggedItemIndex !== index ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
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
                                            <div className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-4 p-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
