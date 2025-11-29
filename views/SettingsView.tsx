
import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Monitor, LogOut, Camera, Save, Mail, Lock, Check, Loader2 } from 'lucide-react';

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Perfil Público', icon: User },
    { id: 'account', label: 'Cuenta', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'billing', label: 'Facturación', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in pb-24">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Configuración</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
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
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        setIsSaving(false);
        setIsSaved(true);
        // Reset saved state after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Perfil Público</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Así es como te verán otros usuarios en la plataforma.</p>
      </div>

      {/* Avatar Upload */}
      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer">
          <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-slate-100 dark:ring-white/10 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
              alt="Avatar" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm hover:opacity-90 transition-opacity mb-2 shadow-sm">
            Cambiar Imagen
          </button>
          <p className="text-xs text-slate-500">Recomendado: 400x400px JPG o PNG</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nombre Display</label>
          <input type="text" defaultValue="Alex Motion" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Usuario</label>
          <div className="flex">
            <span className="bg-slate-100 dark:bg-white/5 border border-r-0 border-slate-200 dark:border-white/10 rounded-l-xl px-3 py-2.5 text-slate-500 text-sm font-medium">latam.creativa/</span>
            <input type="text" defaultValue="alexmotion" className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-r-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" />
          </div>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Biografía</label>
          <textarea rows={4} defaultValue="3D Artist & Motion Designer. Amante del cyberpunk y Blender." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none transition-all"></textarea>
          <p className="text-xs text-slate-500 text-right">54 / 200 caracteres</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Sitio Web</label>
          <input type="url" placeholder="https://..." className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ubicación</label>
          <input type="text" defaultValue="Barcelona, España" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end">
        <button 
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl transition-all shadow-lg ${
                isSaved 
                ? 'bg-green-500 text-white shadow-green-500/20' 
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'
            } ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
        >
          {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
              </>
          ) : isSaved ? (
              <>
                <Check className="h-4 w-4" /> ¡Guardado!
              </>
          ) : (
              <>
                <Save className="h-4 w-4" /> Guardar Cambios
              </>
          )}
        </button>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Cuenta & Seguridad</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona tus credenciales y acceso.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Correo Electrónico</label>
          <div className="flex gap-4">
             <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input type="email" defaultValue="alex@example.com" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-amber-500 outline-none" />
             </div>
             <button className="px-4 py-2 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl text-sm hover:bg-slate-300 dark:hover:bg-white/20">Verificar</button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/10">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Cambiar Contraseña</h3>
           <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Contraseña Actual</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input type="password" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nueva Contraseña</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input type="password" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-amber-500 outline-none" />
                </div>
              </div>
              <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm hover:opacity-90">Actualizar Contraseña</button>
           </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/10">
           <h3 className="text-lg font-bold text-red-500 mb-2">Zona de Peligro</h3>
           <p className="text-sm text-slate-500 mb-4">Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.</p>
           <button className="px-6 py-2.5 border border-red-500 text-red-500 font-bold rounded-xl text-sm hover:bg-red-500/10">Eliminar Cuenta</button>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  const [toggles, setToggles] = useState({
    emailDigest: true,
    newFollower: true,
    mentions: true,
    productUpdates: false
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Preferencias de Notificación</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Elige cómo y cuándo quieres que te contactemos.</p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'emailDigest', title: 'Resumen Semanal', desc: 'Recibe un correo con los mejores posts y cursos de la semana.' },
          { key: 'newFollower', title: 'Nuevos Seguidores', desc: 'Notificarme cuando alguien comience a seguirme.' },
          { key: 'mentions', title: 'Menciones y Comentarios', desc: 'Notificarme cuando alguien comente en mis posts.' },
          { key: 'productUpdates', title: 'Novedades de la Plataforma', desc: 'Noticias sobre nuevas características de Latam Creativa.' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
             <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
             </div>
             <button 
                onClick={() => toggle(item.key as keyof typeof toggles)}
                className={`w-12 h-6 rounded-full transition-colors relative ${toggles[item.key as keyof typeof toggles] ? 'bg-amber-500' : 'bg-slate-300 dark:bg-white/10'}`}
             >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${toggles[item.key as keyof typeof toggles] ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BillingSettings = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Facturación y Planes</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona tu suscripción y métodos de pago.</p>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
         <div className="relative z-10 flex justify-between items-start">
            <div>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Plan Actual</p>
               <h3 className="text-3xl font-bold mb-1">Gratuito</h3>
               <p className="text-slate-300 text-sm">Básico pero funcional.</p>
            </div>
            <button className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl text-sm hover:bg-amber-600 shadow-lg">Mejorar a Pro</button>
         </div>
      </div>

      <div>
         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Método de Pago</h3>
         <div className="p-4 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between bg-white dark:bg-white/[0.02]">
            <div className="flex items-center gap-4">
               <div className="h-10 w-16 bg-slate-100 dark:bg-white/5 rounded flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-slate-500" />
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">•••• •••• •••• 4242</p>
                  <p className="text-xs text-slate-500">Expira 12/25</p>
               </div>
            </div>
            <button className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Editar</button>
         </div>
         <button className="mt-4 text-sm font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors">
            <span className="text-lg">+</span> Añadir método de pago
         </button>
      </div>

      <div>
         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Historial de Facturas</h3>
         <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-bold uppercase text-xs">
                  <tr>
                     <th className="px-4 py-3">Fecha</th>
                     <th className="px-4 py-3">Monto</th>
                     <th className="px-4 py-3">Estado</th>
                     <th className="px-4 py-3">Factura</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  <tr className="bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                     <td className="px-4 py-3 text-slate-700 dark:text-slate-300">01 Oct 2023</td>
                     <td className="px-4 py-3 text-slate-900 dark:text-white font-bold">$0.00</td>
                     <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold border border-green-500/20">Pagado</span></td>
                     <td className="px-4 py-3"><button className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline">Descargar</button></td>
                  </tr>
               </tbody>
            </table>
            <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5">
               No hay más facturas para mostrar.
            </div>
         </div>
      </div>
    </div>
  );
};
