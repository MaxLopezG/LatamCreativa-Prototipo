import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../hooks/useAppStore';
import { usersService } from '../../services/modules/users';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, Zap, Check, CheckCircle2 } from 'lucide-react';
import { auth, googleProvider, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseAuthError } from '../../utils/helpers';

export const AuthView: React.FC = () => {
    const { state, actions } = useAppStore();
    const { contentMode } = state;
    const isDev = contentMode === 'dev';
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetSent, setIsResetSent] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const activeColor = isDev ? 'text-blue-500' : 'text-amber-500';
    const activeBg = isDev ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-500 hover:bg-amber-600';
    const focusRing = isDev ? 'focus:ring-blue-500' : 'focus:ring-amber-500';

    // Validation Helpers
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
    const isFirstNameValid = firstName.trim().length > 1;
    const isLastNameValid = lastName.trim().length > 1;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // Login Logic
                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                // CHECK IF EMAIL IS VERIFIED
                if (!userCredential.user.emailVerified) {
                    await signOut(auth);
                    setError("Tu correo electrónico no ha sido verificado. Por favor revisa tu bandeja de entrada.");
                    return; // Stop execution
                }
            } else {
                // Register Logic
                if (!acceptedTerms) {
                    setError("Debes aceptar los términos y condiciones para continuar.");
                    setIsLoading(false);
                    return;
                }

                // Password Validation
                if (!isPasswordValid) {
                    setError("La contraseña no cumple con los requisitos mínimos.");
                    setIsLoading(false);
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // Create User Document
                if (userCredential.user) {
                    const displayName = `${firstName} ${lastName}`.trim();
                    await updateProfile(userCredential.user, {
                        displayName: displayName
                    });

                    // Use centralized service
                    await usersService.initializeUserProfile(userCredential.user, {
                        name: displayName,
                        firstName,
                        lastName
                    });

                    // Send Email Verification
                    try {
                        await sendEmailVerification(userCredential.user);
                        await signOut(auth); // Sign out immediately
                        setIsVerificationSent(true);
                        setIsLoading(false);
                        return; // Stop execution
                    } catch (emailError) {
                        console.error("Error sending verification email:", emailError);
                        actions.showToast('Cuenta creada, pero hubo un error enviando el correo de verificación.', 'error');
                    }
                }
            }

            // FORCE STORE UPDATE BEFORE REDIRECT (Only if still logged in)
            if (auth.currentUser) {
                const user = auth.currentUser;
                // Double check verification
                if (!user.emailVerified) return;

                const isAdmin = user.email === 'admin@latamcreativa.com';
                const appUser = {
                    id: user.uid,
                    uid: user.uid,
                    name: user.displayName || (firstName ? `${firstName} ${lastName}`.trim() : 'Usuario'),
                    avatar: user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || firstName || 'U'),
                    role: isAdmin ? 'Administrator' : 'Creative Member',
                    location: 'Latam',
                    email: user.email || '',
                    isAdmin: isAdmin
                };
                actions.setUser(appUser);
            }

            // Redirect to home
            navigate('/');


        } catch (err: unknown) {
            console.error("Auth error:", err);
            setError(getFirebaseAuthError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;

            await usersService.initializeUserProfile(user);

            const userDocRef = doc(db, 'users', user.uid);

            if (user) {
                const finalDoc = await getDoc(userDocRef);
                const userData = finalDoc.exists() ? finalDoc.data() : {};

                const isAdmin = user.email === 'admin@latamcreativa.com';
                const appUser = {
                    id: user.uid,
                    uid: user.uid,
                    name: userData.name || user.displayName || 'Usuario',
                    avatar: userData.avatar || user.photoURL || 'https://ui-avatars.com/api/?name=U',
                    role: isAdmin ? 'Administrator' : (userData.role || 'Creative Member'),
                    location: userData.location || 'Latam',
                    email: user.email || '',
                    isAdmin: isAdmin,
                    ...userData
                };
                actions.setUser(appUser);
            }

            navigate('/');
        } catch (err: unknown) {
            console.error("Google auth error:", err);
            setError(getFirebaseAuthError(err, "Error al iniciar sesión con Google."));
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Forgot Password
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEmailValid) {
            setError('Por favor ingresa un email válido');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await usersService.resetPassword(email);
            setIsResetSent(true);
        } catch (err: unknown) {
            console.error('Reset password error:', err);
            setError(getFirebaseAuthError(err, 'Error al enviar el correo de recuperación.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in relative z-10">
            <div className="w-full max-w-lg">

                <div className="bg-white dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">

                    {/* Header Logo/Title */}
                    <div className="text-center mb-8 relative z-10">
                        {!isLogin && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider mb-4">
                                <Zap className="h-3 w-3" /> Únete a la Beta
                            </div>
                        )}
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                            {isLogin ? 'Accede a tu cuenta para continuar' : 'Únete al ecosistema definitivo para creadores digitales.'}
                        </p>
                    </div>

                    {/* Ambient Glow */}
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none ${isDev ? 'bg-blue-500' : 'bg-amber-500'}`}></div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Verification Sent Screen */}
                    {isVerificationSent ? (
                        <div className="text-center py-8 animate-fade-in relative z-10">
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDev ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                <Mail className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Verifica tu Correo</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                Hemos enviado un enlace de confirmación a <strong>{email}</strong>.
                                <br />Por favor, verifica tu cuenta para poder continuar.
                            </p>
                            <button
                                onClick={() => {
                                    setIsVerificationSent(false);
                                    setIsLogin(true);
                                }}
                                className={`w-full py-3 rounded-xl text-white font-bold transition-all ${activeBg}`}
                            >
                                Volver al Inicio de Sesión
                            </button>
                        </div>
                    ) : isResetSent ? (
                        /* Password Reset Sent Screen */
                        <div className="text-center py-8 animate-fade-in relative z-10">
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDev ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Correo Enviado</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                Hemos enviado instrucciones para restablecer tu contraseña a <strong>{email}</strong>.
                                <br />Revisa tu bandeja de entrada y sigue el enlace.
                            </p>
                            <button
                                onClick={() => {
                                    setIsResetSent(false);
                                    setIsForgotPassword(false);
                                    setIsLogin(true);
                                    setEmail('');
                                }}
                                className={`w-full py-3 rounded-xl text-white font-bold transition-all ${activeBg}`}
                            >
                                Volver al Inicio de Sesión
                            </button>
                        </div>
                    ) : isForgotPassword ? (
                        /* Forgot Password Form */
                        <form onSubmit={handleForgotPassword} className="space-y-5 relative z-10 animate-fade-in">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Recuperar Contraseña</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className={`absolute left-3 top-3 h-5 w-5 ${isEmailValid ? 'text-green-500' : 'text-slate-400'}`} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hola@ejemplo.com"
                                        className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl pl-10 pr-10 py-3 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${isEmailValid
                                            ? 'border-green-500/50 focus:border-green-500'
                                            : `border-slate-200 dark:border-white/10 ${focusRing}`
                                            }`}
                                        required
                                    />
                                    {isEmailValid && (
                                        <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !isEmailValid}
                                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${activeBg} ${isLoading ? 'opacity-80 cursor-wait' : ''} disabled:opacity-50`}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Enviar Enlace de Recuperación'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotPassword(false);
                                    setError(null);
                                }}
                                className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                                ← Volver al inicio de sesión
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

                            {!isLogin && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombres</label>
                                        <div className="relative">
                                            <User className={`absolute left-3 top-3 h-5 w-5 ${isFirstNameValid ? 'text-green-500' : 'text-slate-400'}`} />
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Juan"
                                                className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl pl-10 pr-10 py-3 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${isFirstNameValid
                                                    ? 'border-green-500/50 focus:border-green-500'
                                                    : `border-slate-200 dark:border-white/10 ${focusRing}`
                                                    }`}
                                                required={!isLogin}
                                            />
                                            {isFirstNameValid && (
                                                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500 animate-in fade-in zoom-in" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Apellidos</label>
                                        <div className="relative">
                                            {/* Note: No specific icon for lastname, keeping it simple or reuse User? Reusing input styling */}
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Pérez"
                                                className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${isLastNameValid
                                                    ? 'border-green-500/50 focus:border-green-500'
                                                    : `border-slate-200 dark:border-white/10 ${focusRing}`
                                                    }`}
                                                required={!isLogin}
                                            />
                                            {isLastNameValid && (
                                                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500 animate-in fade-in zoom-in" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className={`absolute left-3 top-3 h-5 w-5 ${isEmailValid ? 'text-green-500' : 'text-slate-400'}`} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="hola@ejemplo.com"
                                        className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl pl-10 pr-10 py-3 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${isEmailValid
                                            ? 'border-green-500/50 focus:border-green-500'
                                            : `border-slate-200 dark:border-white/10 ${focusRing}`
                                            }`}
                                        required
                                    />
                                    {isEmailValid && (
                                        <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500 animate-in fade-in zoom-in" />
                                    )}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contraseña</label>
                                <div className="relative">
                                    <Lock className={`absolute left-3 top-3 h-5 w-5 z-10 ${isPasswordValid ? 'text-green-500' : 'text-slate-400'}`} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl pl-10 pr-12 py-3 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${isPasswordValid
                                            ? 'border-green-500/50 focus:border-green-500'
                                            : `border-slate-200 dark:border-white/10 ${focusRing}`
                                            }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Password Requirements Checklist (Register Only) */}
                                {!isLogin && (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {[
                                            { label: '8+ Caracteres', valid: password.length >= 8 },
                                            { label: 'Mayúscula', valid: /[A-Z]/.test(password) },
                                            { label: 'Número', valid: /[0-9]/.test(password) },
                                            { label: 'Símbolo', valid: /[^A-Za-z0-9]/.test(password) }
                                        ].map((req, index) => (
                                            <div key={index} className="flex items-center gap-1.5">
                                                <div className={`h-1.5 w-1.5 rounded-full ${req.valid ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                                <span className={`text-[10px] font-medium ${req.valid ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Terms and Conditions (Register Only) */}
                            {!isLogin && (
                                <div
                                    className="flex items-center gap-3 animate-fade-in px-1 cursor-pointer group"
                                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                                >
                                    <div className={`
                                        h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-200
                                        ${acceptedTerms
                                            ? 'bg-amber-500 border-amber-500'
                                            : 'border-slate-300 dark:border-white/20 group-hover:border-amber-500/50'
                                        }
                                    `}>
                                        {acceptedTerms && <Check className="h-3 w-3 text-white stroke-[3]" />}
                                    </div>
                                    <label className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                                        Acepto los <span className={`font-bold hover:underline ${activeColor}`}>términos y condiciones</span>
                                    </label>
                                </div>
                            )}

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

                            {/* Forgot Password Link (Login only) */}
                            {isLogin && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(true);
                                        setError(null);
                                    }}
                                    className={`w-full text-center text-sm font-medium ${activeColor} hover:underline`}
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            )}

                        </form>
                    )}

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                            <span className="bg-white dark:bg-[#0A0A0B] px-2 text-slate-400">O regístrate con</span>
                        </div>
                    </div>

                    {/* Social Auth */}
                    <div className="w-full">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
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
