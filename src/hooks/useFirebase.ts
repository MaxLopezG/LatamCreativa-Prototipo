import { useState, useEffect, useCallback } from 'react';
import { api, PaginatedResult } from '../services/api';
import { PortfolioItem } from '../types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// --- Hook for Infinite Scroll Feed ---
export const useProjects = () => {
    const [projects, setProjects] = useState<PortfolioItem[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);
        setError(null);

        try {
            const currentLastDoc = reset ? null : lastDoc;
            const result = await api.getProjects(currentLastDoc);

            if (reset) {
                setProjects(result.data);
            } else {
                setProjects(prev => [...prev, ...result.data]);
            }

            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
        } catch (err: any) {
            setError(err.message || 'Error loading projects');
        } finally {
            setLoading(false);
        }
    }, [lastDoc, hasMore, loading]);

    // Initial load
    useEffect(() => {
        loadMore(true);
    }, []);

    return { projects, loading, error, hasMore, loadMore };
};

// --- Hook for User Profile ---
export const useUserProfile = (userId: string | null) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await api.getUserProfile(userId);
                setProfile(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    return { profile, loading };
};

// --- Hook for Creating Project ---
export const useCreateProject = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any, file?: File) => {
        setLoading(true);
        setError(null);
        try {
            const id = await api.createProject(data, file);
            return id;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};

// --- Hook for Admin: All Users ---
export const useAllUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await api.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading };
};
