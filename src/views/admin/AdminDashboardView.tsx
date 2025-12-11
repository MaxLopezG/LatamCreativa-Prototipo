import React, { useState } from 'react';
import { useAllUsers } from '../../hooks/useFirebase';
import { Search, Mail, Calendar, Shield, MoreHorizontal, FileText, Users, ArrowUpRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { CreatePostModal } from '../../components/modals/CreatePostModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppStore } from '../../hooks/useAppStore';

export const AdminDashboardView: React.FC = () => {
    const { actions, state } = useAppStore();
    const currentUser = state.user;
    const isSuperAdmin = currentUser?.email === 'admin@latamcreativa.com';
    const { users: initialUsers, loading } = useAllUsers();
    const [usersList, setUsersList] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Sync initial users to local state
    React.useEffect(() => {
        setUsersList(initialUsers);
    }, [initialUsers]);

    const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean, userName: string) => {
        if (!isSuperAdmin) {
            actions.showToast('Solo el Super Admin puede gestionar roles.', 'error');
            return;
        }

        // if (!confirm(...)) return; // Removed for debugging/UX


        setActionLoading(userId);
        try {
            await updateDoc(doc(db, 'users', userId), {
                isAdmin: !currentIsAdmin,
                role: !currentIsAdmin ? 'Administrator' : 'Creative Member'
            });

            // Optimistic Update
            setUsersList(prev => prev.map(user =>
                user.id === userId
                    ? { ...user, isAdmin: !currentIsAdmin, role: !currentIsAdmin ? 'Administrator' : 'Creative Member' }
                    : user
            ));

            actions.showToast(`${userName} ahora ${!currentIsAdmin ? 'es Admin' : 'ya no es Admin'}`, 'success');
        } catch (error) {
            console.error(error);
            actions.showToast('Error al actualizar permisos', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = usersList.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Total Usuarios', value: usersList.length, icon: Users, change: '+12%', color: 'text-blue-500' },
        { label: 'Posts Totales', value: '1,234', icon: FileText, change: '+5%', color: 'text-amber-500' },
        { label: 'Nuevos este mes', value: '156', icon: Calendar, change: '+18%', color: 'text-green-500' },
    ];

    if (loading) {
        return <div className="text-white">Cargando datos...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Bienvenido al panel de control de Latam Creativa.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                    <FileText className="h-4 w-4" />
                    Crear Post Oficial
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="flex items-center gap-1 text-green-500 text-sm font-medium bg-green-500/10 px-2 py-1 rounded-lg">
                                {stat.change} <ArrowUpRight className="h-3 w-3" />
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Usuarios Recientes</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Fecha Registro</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-8 h-8 rounded-full bg-white/10" alt="" />
                                            <span className="font-medium text-white">{user.name || 'Sin nombre'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${user.isAdmin
                                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            : 'bg-slate-500/10 text-slate-400 border border-white/5'
                                            }`}>
                                            {user.isAdmin && <Shield className="h-3 w-3" />}
                                            {user.isAdmin ? 'Admin' : 'Miembro'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {isSuperAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleAdmin(user.id, !!user.isAdmin, user.name)}
                                                    disabled={actionLoading === user.id}
                                                    className={`p-2 rounded-lg transition-colors ${user.isAdmin
                                                        ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                                        }`}
                                                    title={user.isAdmin ? "Quitar Admin" : "Hacer Admin"}
                                                >
                                                    {actionLoading === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};
