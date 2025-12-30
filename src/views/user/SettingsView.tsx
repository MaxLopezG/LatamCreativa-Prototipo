
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Shield, CreditCard, LogOut, Mail, Lock, ArrowLeft, Loader2, CheckCircle, Receipt, Eye, EyeOff } from 'lucide-react';

interface SettingsViewProps {
  onBack?: () => void;
}

import { useAppStore } from '../../hooks/useAppStore';
import { usersService } from '../../services/modules/users';
import { getFirebaseAuthError } from '../../utils/helpers';

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const { state } = useAppStore();
  const { contentMode } = state;
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Cuenta', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'billing', label: 'Facturación', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in pb-24">
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Configuración</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id
                ? (contentMode === 'dev' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20')
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
          <div className="h-px bg-slate-200 dark:bg-white/10 my-4 mx-2"></div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm">
            <LogOut className="h-5 w-5" /> Cerrar Sesión
          </button>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl p-8 min-h-[600px]">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </div>
  );
};


const AccountSettings = () => {
  const { state, actions } = useAppStore();
  const { contentMode, user } = state;
  const navigate = useNavigate();

  const focusClass = contentMode === 'dev' ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-amber-500 focus:ring-amber-500';
  const buttonClass = contentMode === 'dev' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-500 hover:bg-amber-600';

  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle email change
  const handleEmailChange = async () => {
    if (!newEmail.trim() || !emailPassword) {
      actions.showToast('Completa todos los campos', 'error');
      return;
    }

    setIsChangingEmail(true);
    try {
      await usersService.updateUserEmail(newEmail.trim(), emailPassword);
      actions.showToast('Email actualizado. Revisa tu correo para verificar.', 'success');
      setNewEmail('');
      setEmailPassword('');
    } catch (error: unknown) {
      console.error('Error changing email:', error);
      actions.showToast(getFirebaseAuthError(error, 'Error al cambiar email'), 'error');
    } finally {
      setIsChangingEmail(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      actions.showToast('Completa todos los campos', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      actions.showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      actions.showToast('La contraseña no cumple con los requisitos mínimos', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      await usersService.updateUserPassword(currentPassword, newPassword);
      actions.showToast('Contraseña actualizada correctamente', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      console.error('Error changing password:', error);
      actions.showToast(getFirebaseAuthError(error, 'Error al cambiar contraseña'), 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      actions.showToast('Ingresa tu contraseña para confirmar', 'error');
      return;
    }

    setIsDeleting(true);
    try {
      await usersService.deleteUserAccount(deletePassword);
      actions.setUser(null);
      actions.showToast('Cuenta eliminada correctamente', 'success');
      navigate('/');
    } catch (error: unknown) {
      console.error('Error deleting account:', error);
      actions.showToast(getFirebaseAuthError(error, 'Error al eliminar cuenta'), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Cuenta & Seguridad</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona tus credenciales y acceso.</p>
      </div>

      <div className="space-y-6">
        {/* Current Email Display */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email Actual</p>
          <p className="text-slate-900 dark:text-white font-medium">{user?.email || 'No disponible'}</p>
        </div>

        {/* Change Email Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cambiar Email</h3>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nuevo Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nuevo@email.com"
                  className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${focusClass}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Contraseña Actual</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${focusClass}`}
                />
              </div>
            </div>
            <button
              onClick={handleEmailChange}
              disabled={isChangingEmail || !newEmail || !emailPassword}
              className={`px-6 py-2.5 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${buttonClass}`}
            >
              {isChangingEmail ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Actualizando...</>
              ) : (
                'Actualizar Email'
              )}
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Cambiar Contraseña</h3>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Contraseña Actual</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-12 py-2.5 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${focusClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-12 py-2.5 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${focusClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Password Requirements Checklist */}
              {newPassword && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { label: '8+ Caracteres', valid: newPassword.length >= 8 },
                    { label: 'Mayúscula', valid: /[A-Z]/.test(newPassword) },
                    { label: 'Número', valid: /[0-9]/.test(newPassword) },
                    { label: 'Símbolo', valid: /[^A-Za-z0-9]/.test(newPassword) }
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
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-12 py-2.5 text-slate-900 dark:text-white outline-none transition-all focus:ring-1 ${focusClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)}
              className={`px-6 py-2.5 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${buttonClass}`}
            >
              {isChangingPassword ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Actualizando...</>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/10">
          <h3 className="text-lg font-bold text-red-500 mb-2">Zona de Peligro</h3>
          <p className="text-sm text-slate-500 mb-4">Una vez que elimines tu cuenta, no hay vuelta atrás. Todos tus datos serán eliminados permanentemente.</p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2.5 border border-red-500 text-red-500 font-bold rounded-xl text-sm hover:bg-red-500/10 transition-colors"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A1A1C] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-xl font-bold text-red-500 mb-2">¿Eliminar cuenta?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Esta acción es irreversible. Se eliminarán todos tus datos, incluyendo tu perfil, proyectos y artículos.
            </p>
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirma tu contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Eliminando...</>
                ) : (
                  'Eliminar Cuenta'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const NotificationSettings = () => {
  const { state, actions } = useAppStore();
  const { contentMode, user } = state;
  const activeColorFull = contentMode === 'dev' ? 'bg-blue-600' : 'bg-amber-500';

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Default notification preferences
  const defaultPreferences = {
    emailDigest: true,
    newFollower: true,
    comments: true,
    likes: false,
    projectUpdates: true,
    platformNews: false
  };

  // Load preferences from user profile or use defaults
  const [preferences, setPreferences] = useState(() => {
    if (user?.notificationPreferences) {
      return { ...defaultPreferences, ...user.notificationPreferences };
    }
    return defaultPreferences;
  });

  // Save preferences to Firestore
  const savePreferences = async (newPreferences: typeof preferences) => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      await usersService.updateUserProfile(user.id, {
        notificationPreferences: newPreferences
      });
      setLastSaved(new Date());
      // Update local state
      actions.setUser({ ...user, notificationPreferences: newPreferences });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      actions.showToast('Error al guardar preferencias', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle a preference and save
  const togglePreference = (key: keyof typeof preferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const notificationOptions = [
    {
      category: 'Actividad Social',
      items: [
        { key: 'newFollower', title: 'Nuevos Seguidores', desc: 'Cuando alguien comience a seguirte.' },
        { key: 'comments', title: 'Comentarios', desc: 'Cuando alguien comente en tus proyectos o artículos.' },
        { key: 'likes', title: 'Me Gusta', desc: 'Cuando alguien le dé like a tu contenido.' },
      ]
    },
    {
      category: 'Contenido',
      items: [
        { key: 'projectUpdates', title: 'Actualizaciones de Proyectos', desc: 'Cuando artistas que sigues publiquen nuevo contenido.' },
      ]
    },
    {
      category: 'Email',
      items: [
        { key: 'emailDigest', title: 'Resumen Semanal', desc: 'Un correo semanal con los mejores proyectos y artículos.' },
        { key: 'platformNews', title: 'Novedades de la Plataforma', desc: 'Anuncios sobre nuevas funciones de Latam Creativa.' },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Preferencias de Notificación</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Elige cómo y cuándo quieres que te contactemos.</p>
        </div>
        {/* Save Status Indicator */}
        <div className="flex items-center gap-2 text-xs">
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-slate-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Guardando...
            </span>
          ) : lastSaved ? (
            <span className="text-green-500 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Guardado
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-8">
        {notificationOptions.map((section) => (
          <div key={section.category}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{section.category}</h3>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => togglePreference(item.key as keyof typeof preferences)}
                    disabled={isSaving}
                    className={`w-12 h-6 rounded-full transition-colors relative ${preferences[item.key as keyof typeof preferences] ? activeColorFull : 'bg-slate-300 dark:bg-white/10'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${preferences[item.key as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-sm text-blue-700 dark:text-blue-300">
        <p>
          <strong>Nota:</strong> Las notificaciones en la app siempre estarán activas para mantener la comunicación esencial.
          Aquí puedes controlar las notificaciones por email y las no esenciales.
        </p>
      </div>
    </div>
  );
};


const BillingSettings = () => {
  const { state } = useAppStore();
  const { contentMode, user } = state;
  const navigate = useNavigate();

  const buttonClass = contentMode === 'dev' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-500 hover:bg-amber-600';
  const gradientBlob = contentMode === 'dev' ? 'bg-blue-500/20' : 'bg-amber-500/20';
  const accentColor = contentMode === 'dev' ? 'text-blue-500' : 'text-amber-500';
  const accentBorder = contentMode === 'dev' ? 'border-blue-500/30' : 'border-amber-500/30';

  // Check if user is Pro (could be stored in user profile)
  const isPro = user?.role === 'Pro' || user?.role === 'Administrator';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Facturación y Planes</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona tu suscripción y métodos de pago.</p>
      </div>

      {/* Current Plan Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-xl">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none ${gradientBlob}`}></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Plan Actual</p>
            <h3 className="text-3xl font-bold mb-1">{isPro ? 'Pro' : 'Gratuito'}</h3>
            <p className="text-slate-300 text-sm">
              {isPro
                ? 'Acceso completo a todas las funciones premium.'
                : 'Funciones básicas para comenzar a crear.'}
            </p>
          </div>
          {!isPro && (
            <button
              onClick={() => navigate('/pro')}
              className={`px-6 py-2.5 text-white font-bold rounded-xl text-sm shadow-lg transition-colors whitespace-nowrap ${buttonClass}`}
            >
              Mejorar a Pro
            </button>
          )}
        </div>

        {/* Plan Features */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tu plan incluye:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(isPro ? [
              'Proyectos ilimitados',
              'Sin marca de agua',
              'Estadísticas avanzadas',
              'Soporte prioritario',
              'Badge Pro en perfil',
              'Acceso anticipado a nuevas funciones'
            ] : [
              'Hasta 10 proyectos',
              'Portafolio básico',
              'Estadísticas básicas',
              'Soporte por email'
            ]).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods - Coming Soon */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Métodos de Pago</h3>
        <div className={`p-6 border-2 border-dashed ${accentBorder} rounded-xl text-center`}>
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${contentMode === 'dev' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
            <CreditCard className={`h-6 w-6 ${accentColor}`} />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-1">Próximamente</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Estamos trabajando en integrar pagos seguros. Pronto podrás agregar tarjetas y gestionar tu suscripción.
          </p>
        </div>
      </div>

      {/* Billing History - Coming Soon */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Historial de Facturas</h3>
        <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="p-8 text-center bg-slate-50 dark:bg-white/[0.02]">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center mb-3">
              <Receipt className="h-6 w-6 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Sin facturas aún</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isPro
                ? 'Tus facturas aparecerán aquí cuando proceses un pago.'
                : 'Cuando actualices a Pro, tus facturas aparecerán aquí.'}
            </p>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className={`p-4 rounded-xl border text-sm ${contentMode === 'dev' ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300'}`}>
        <p>
          <strong>¿Tienes preguntas?</strong> Contacta a nuestro equipo en <span className="font-bold">soporte@latamcreativa.com</span> para cualquier consulta sobre facturación.
        </p>
      </div>
    </div>
  );
};

