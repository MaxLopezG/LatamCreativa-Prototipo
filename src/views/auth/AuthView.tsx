import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../hooks/useAppStore';
import { Mail, Lock, User, Github, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { auth, googleProvider } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';

export const AuthView: React.FC = () => {
    const { state, actions } = useAppStore();
    const { contentMode } = state;
    const isDev = contentMode === 'dev';
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const activeColor = isDev ? 'text-blue-500' : 'text-amber-500';
    const activeBg = isDev ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-500 hover:bg-amber-600';
    const focusRing = isDev ? 'focus:ring-blue-500' : 'focus:ring-amber-500';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // Login Logic
                await signInWithEmailAndPassword(auth, email, password);
                // Log removed
            } else {
                // Register Logic
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Update display name if provided
                if (name && userCredential.user) {
                    await updateProfile(userCredential.user, {
                        displayName: name
                    });
                }
                // Log removed
            }

            // FORCE STORE UPDATE BEFORE REDIRECT
            if (auth.currentUser) {
                const user = auth.currentUser;
                const isAdmin = user.email === 'admin@latamcreativa.com';
                const appUser = {
                    id: user.uid,
                    name: user.displayName || name || 'Usuario',
                    avatar: user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || name || 'U'),
                    role: isAdmin ? 'Administrator' : 'Creative Member',
                    location: 'Latam',
                    email: user.email || '',
                    isAdmin: isAdmin
                };
                actions.setUser(appUser);
            }

            // Redirect to home
            navigate('/');


        } catch (err: any) {
            console.error("Auth error:", err);
            let msg = "Ocurrió un error al autenticar.";

            // Map common Firebase errors to user-friendly messages
            if (err.code === 'auth/invalid-email') msg = "El correo electrónico no es válido.";
            if (err.code === 'auth/user-not-found') msg = "No existe una cuenta con este correo.";
            if (err.code === 'auth/wrong-password') msg = "Contraseña incorrecta.";
            if (err.code === 'auth/email-already-in-use') msg = "Este correo ya está registrado.";
            if (err.code === 'auth/weak-password') msg = "La contraseña debe tener al menos 6 caracteres.";

            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
            // Log removed

            // FORCE STORE UPDATE BEFORE REDIRECT
            if (auth.currentUser) {
                const user = auth.currentUser;
                const isAdmin = user.email === 'admin@latamcreativa.com';
                const appUser = {
                    id: user.uid,
                    name: user.displayName || 'Usuario',
                    avatar: user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || 'U'),
                    role: isAdmin ? 'Administrator' : 'Creative Member',
                    location: 'Latam',
                    email: user.email || '',
                    isAdmin: isAdmin
                };
                actions.setUser(appUser);
            }

            navigate('/');
        } catch (err: any) {
            console.error("Google auth error:", err);
            setError("Error al iniciar sesión con Google.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-md">

                {/* Header Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {isLogin ? 'Bienvenido de nuevo' : 'Únete a Latam Creativa'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {isLogin ? 'Accede a tu cuenta para continuar' : 'Comienza tu viaje creativo hoy'}
                    </p>
                </div>

                <div className="bg-white dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden">

                    {/* Ambient Glow */}
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none ${isDev ? 'bg-blue-500' : 'bg-amber-500'}`}></div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

                        {/* Name Field (Register Only) */}
                        {!isLogin && (
                            <div className="space-y-1.5 animate-fade-in">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jhon Doe"
                                        className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${focusRing}`}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hola@ejemplo.com"
                                    className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${focusRing}`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${focusRing}`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${activeBg} ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-[#0A0A0B] px-2 text-slate-500">O continúa con</span>
                        </div>
                    </div>

                    {/* Social Auth */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300">
                            <Github className="h-5 w-5" /> GitHub
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>

                    </div>

                    {/* Toggle Login/Register */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className={`ml-1 font-bold hover:underline ${activeColor}`}
                        >
                            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                        </button>
                    </p>

                </div>
            </div>
        </div>
    );
};
