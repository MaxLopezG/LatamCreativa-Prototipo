import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { EditProfileModal } from '../../components/modals/EditProfileModal';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { useUserArticles, useDeleteProject, useUserProjects } from '../../hooks/useFirebase';
import { usersService } from '../../services/modules/users';
import { collectionsService } from '../../services/modules/collections';
import { useUserProfileData } from '../../hooks/useUserProfileData';
import { shouldCountView } from '../../utils/viewTracking';
import { UserProfileHeader } from './components/UserProfileHeader';
import { UserProfileStats } from './components/UserProfileStats';
import { UserProfileInfo } from './components/UserProfileInfo';
import { UserProfileTabs } from './components/UserProfileTabs';
import { CollectionItem } from '../../types';

interface UserProfileViewProps {
    author?: { name: string; avatar?: string; id?: string } | null;
    authorName?: string;
    onBack: () => void;
    onItemSelect: (id: string, type: 'portfolio' | 'blog' | 'course' | 'asset') => void;
    onOpenChat?: (authorName: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ author, authorName, onBack, onItemSelect, onOpenChat }) => {
    const { state, actions } = useAppStore();
    const navigate = useNavigate();
    const { isOwnProfile, displayUser, fetchedUser } = useUserProfileData(author, authorName);

    const sanitizeName = (val: any) => {
        if (!val) return 'Unknown User';
        if (typeof val === 'string' && val === '[object Object]') return 'Unknown User';
        if (typeof val === 'object') {
            return val.name || val.displayName || val.userName || 'Unknown User';
        }
        return String(val);
    };

    const name = sanitizeName(displayUser.name);

    const [activeTab, setActiveTab] = useState<'portfolio' | 'blog' | 'collections'>('portfolio');
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    // Check initial subscription status
    useEffect(() => {
        const checkStatus = async () => {
            if (state.user && displayUser.id && displayUser.id !== 'unknown') {
                setIsFollowLoading(true);
                try {
                    const status = await usersService.getSubscriptionStatus(displayUser.id, state.user.id);
                    setIsFollowing(status);
                } catch (error) {
                    console.error("Failed to check subscription status:", error);
                } finally {
                    setIsFollowLoading(false);
                }
            }
        };
        checkStatus();
    }, [state.user, displayUser.id]);

    const handleFollowToggle = async () => {
        if (!state.user) {
            actions.showToast("Inicia sesión para seguir a creadores", "info");
            return;
        }

        // Prevent rapid clicks
        if (isFollowLoading) return;

        const targetId = displayUser.id;
        if (!targetId || targetId === 'unknown') {
            console.error("No user ID found for follow");
            return;
        }

        setIsFollowLoading(true);
        const previousState = isFollowing;
        setIsFollowing(!previousState); // Optimistic UI

        try {
            if (previousState) {
                await usersService.unsubscribeFromUser(targetId, state.user.id);
            } else {
                await usersService.subscribeToUser(targetId, state.user.id);
            }
            actions.triggerSubscriptionUpdate(); // To update sidebar, etc.
        } catch (error) {
            console.error("Follow toggle error:", error);
            setIsFollowing(previousState); // Rollback on error
            actions.showToast("Error al actualizar seguimiento", "error");
        } finally {
            setIsFollowLoading(false);
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const userIdForQuery = isOwnProfile ? state.user?.id : fetchedUser?.id;
    const { projects: userPortfolio, loading: projectsLoading, removeProject: removeProjectFromList } = useUserProjects(userIdForQuery, undefined);

    const { deleteProject, loading: isDeleting } = useDeleteProject();
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const handleDeleteProject = (projectId: string) => {
        setProjectToDelete(projectId);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            // Optimistic UI update first
            removeProjectFromList(projectToDelete);
            setProjectToDelete(null); // Close modal immediately

            // Then perform DB deletion
            await deleteProject(projectToDelete);

            actions.showToast('Proyecto eliminado correctamente', 'success');
        } catch (error) {
            console.error("Error deleting project:", error);
            actions.showToast('Error al eliminar el proyecto', 'error');
            // Here you might want to add the project back to the list if deletion fails
            // For now, we just show an error.
            setProjectToDelete(null); // Ensure modal is closed on error too
        }
    };

    // --- Dynamic Data for Own Profile vs Demo Profile ---
    // DISABLED: We want real data or empty state
    // const showMockData = false; 

    // Stats state
    const [totalLikes, setTotalLikes] = useState<number>(0);

    // Effect: Increment profile views (only for visitors, not own profile, once per 24h)
    useEffect(() => {
        if (displayUser.id && displayUser.id !== 'unknown' && !isOwnProfile) {
            if (shouldCountView('profile', displayUser.id)) {
                usersService.incrementProfileViews(displayUser.id);
            }
        }
    }, [displayUser.id, isOwnProfile]);

    // Effect: Calculate total likes from all user's projects
    useEffect(() => {
        const loadTotalLikes = async () => {
            const userId = isOwnProfile ? state.user?.id : fetchedUser?.id;
            if (userId) {
                const likes = await usersService.getTotalProjectLikes(userId);
                setTotalLikes(likes);
            }
        };
        loadTotalLikes();
    }, [isOwnProfile, state.user?.id, fetchedUser?.id]);

    // Stats - combine stored stats with computed totalLikes
    const storedStats = (displayUser['stats'] as any) || {};
    const stats = {
        views: storedStats.views || 0,
        likes: totalLikes || storedStats.likes || 0,
        followers: storedStats.followers || 0
    };



    // 4. Blog
    const { articles: userArticles, loading: articlesLoading, error: articlesError } = useUserArticles(name, userIdForQuery);


    // 5. Saved Items (Likes)
    const savedItems = useMemo(() => {
        // NOTE: Not implemented - saved items feature pending product decision
        return [];
    }, []);

    // 6. Collections
    const [otherUserCollections, setOtherUserCollections] = useState<CollectionItem[]>([]);

    // Fetch own collections when tab is selected (from store)
    useEffect(() => {
        if (activeTab === 'collections' && isOwnProfile && state.user) {
            actions.fetchCollections();
        }
    }, [activeTab, isOwnProfile, state.user, actions]);

    // Fetch other user's PUBLIC collections when viewing their profile (on load, not just tab click)
    useEffect(() => {
        const fetchPublicCollections = async () => {
            if (!isOwnProfile && fetchedUser?.id) {
                try {
                    const publicCols = await collectionsService.getPublicUserCollections(fetchedUser.id);
                    setOtherUserCollections(publicCols);
                } catch (error) {
                    console.error('Error fetching public collections:', error);
                }
            }
        };
        // Fetch immediately when viewing another user's profile
        if (!isOwnProfile && fetchedUser?.id) {
            fetchPublicCollections();
        }
    }, [isOwnProfile, fetchedUser?.id]);

    const userCollections = useMemo(() => {
        if (isOwnProfile) return state.collections;
        return otherUserCollections;
    }, [isOwnProfile, state.collections, otherUserCollections]);

    return (
        <div className="w-full max-w-[2560px] mx-auto animate-fade-in pb-20">

            {/* Edit Modal */}
            <ConfirmationModal
                isOpen={!!projectToDelete}
                onClose={() => setProjectToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Proyecto"
                message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción es permanente y también eliminará todas las imágenes asociadas."
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                type="danger"
                loading={isDeleting}
            />

            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

            {/* Navigation */}
            <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 pointer-events-none">
                <button
                    onClick={onBack}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors font-medium text-sm border border-white/10"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver</span>
                </button>
            </div>

            <UserProfileHeader
                displayUser={displayUser}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                isFollowLoading={isFollowLoading}
                onFollowToggle={handleFollowToggle}
                onOpenChat={onOpenChat}
                onEditProfile={() => setIsEditModalOpen(true)}
            />

            {/* Content Layout - Fixed Sidebar Width for Large Screens */}
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] 2xl:grid-cols-[450px_1fr] gap-12 px-6 md:px-12 2xl:px-20">

                {/* Left Sidebar (Stats, About, Experience) */}
                <div className="space-y-10 order-2 lg:order-1">
                    <UserProfileStats stats={stats} />
                    <UserProfileInfo displayUser={displayUser} isOwnProfile={isOwnProfile} />
                </div>

                {/* Main Content (Tabs & Grid) */}
                <div className="order-1 lg:order-2">
                    <UserProfileTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        isOwnProfile={isOwnProfile}
                        profileUserId={displayUser.id}
                        userPortfolio={userPortfolio}
                        userArticles={userArticles}
                        savedItems={savedItems}
                        userCollections={userCollections}
                        projectsLoading={projectsLoading}
                        articlesError={articlesError}
                        onDeleteProject={handleDeleteProject}
                        onSaveItem={actions.openSaveModal}
                    />
                </div>
            </div>
        </div>
    );
};
