import React from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { LayoutDashboard, Users, Settings, LogOut, FileText, ArrowLeft } from 'lucide-react';
import { auth } from '../lib/firebase';

export const AdminLayout: React.FC = () => {
    const { state, actions } = useAppStore();
    const user = state.user;
    const isLoadingAuth = state.isLoadingAuth;
    const navigate = useNavigate();

    // Show loader while checking auth status
    if (isLoadingAuth) {
        return (
            <div className="min-h-screen bg-[#0F1115] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    // Protection: Redirect if not admin
    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = async () => {
        try {
            await auth.signOut();
            actions.clearUser();
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Usuarios', path: '/admin/users' },
        { icon: FileText, label: 'Posts Oficiales', path: '/admin/posts' },
        { icon: Settings, label: 'Configuración', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-[#0F1115] text-white flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0A0B0E] flex flex-col fixed inset-y-0 h-full">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <span className="text-lg font-bold tracking-tight">
                        Latam<span className="text-amber-500">Admin</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? 'bg-amber-500/10 text-amber-500'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="pt-4 mt-4 border-t border-white/10">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a la App
                        </button>
                    </div>
                </nav>

                {/* User & Logout */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-slate-500">Admin</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};
