import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    where,
    increment,
    QueryDocumentSnapshot,
    DocumentData,
    setDoc,
    documentId
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { ArticleItem, BlogComment, Notification } from '../../types';
import { PaginatedResult, withTimeout, sanitizeData } from './utils';
import { usersService } from './users';
import { notificationsService } from './notifications';

export const blogService = {
    getArticles: async (lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize = 10, sortField: 'date' | 'likes' = 'date', sortDirection: 'desc' | 'asc' = 'desc'): Promise<PaginatedResult<ArticleItem>> => {
        try {
            let q = query(
                collection(db, 'articles'),
                orderBy(sortField, sortDirection),
                limit(pageSize)
            );

            if (lastDoc) {
                q = query(
                    collection(db, 'articles'),
                    orderBy(sortField, sortDirection),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === pageSize
            };
        } catch (error) {
            console.error("Error fetching articles:", error);
            throw error;
        }
    },

    createArticle: async (articleData: Omit<ArticleItem, 'id'>, imageFile?: File): Promise<string> => {
        try {
            let imageUrl = articleData.image;

            // 1. Upload Image if provided
            if (imageFile) {
                try {
                    const storageRef = ref(storage, `articles/${Date.now()}_${imageFile.name}`);
                    const uploadResult = await withTimeout(
                        uploadBytes(storageRef, imageFile),
                        7000,
                        "Image upload timed out (7s). Please check your connection."
                    );
                    imageUrl = await getDownloadURL(uploadResult.ref);
                } catch (uploadError: any) {
                    console.error("Error uploading image:", uploadError);
                }
            }

            // 2. Save Document
            const finalData = sanitizeData({
                ...articleData,
                image: imageUrl,
                date: new Date().toISOString(),
                likes: 0,
                comments: 0
            });

            const docRef = await withTimeout(
                addDoc(collection(db, 'articles'), finalData),
                7000,
                "Saving article timed out (7s). Please check your connection."
            );

            // 3. Notify Followers
            try {
                if (articleData.authorId) {
                    const followers = await usersService.getFollowers(articleData.authorId);

                    const notification: Omit<Notification, 'id'> = {
                        type: 'system',
                        user: articleData.author,
                        avatar: articleData.authorAvatar,
                        content: `publicó un nuevo artículo: "${articleData.title}"`,
                        category: articleData.category,
                        link: `/blog/${docRef.id}`,
                        time: new Date().toISOString(),
                        read: false
                    };

                    await Promise.all(followers.map(followerId =>
                        notificationsService.createNotification(followerId, notification)
                    ));
                }
            } catch (notifError) {
                console.error("Error sending notifications:", notifError);
            }

            return docRef.id;
        } catch (error) {
            console.error("Error creating article:", error);
            throw error;
        }
    },

    updateArticle: async (articleId: string, articleData: Partial<ArticleItem>, imageFile?: File): Promise<void> => {
        try {
            let imageUrl = articleData.image;

            // 1. Upload New Image if provided
            if (imageFile) {
                const storageRef = ref(storage, `articles/${Date.now()}_${imageFile.name}`);
                const uploadResult = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            // 2. Update Document
            const docRef = doc(db, 'articles', articleId);
            const finalData = sanitizeData({
                ...articleData,
                image: imageUrl
            });

            await updateDoc(docRef, finalData);
        } catch (error) {
            console.error("Error updating article:", error);
            throw error;
        }
    },

    getRecentArticles: async (limitCount = 4): Promise<ArticleItem[]> => {
        try {
            const q = query(
                collection(db, 'articles'),
                orderBy('date', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));
        } catch (error) {
            console.error("Error fetching recent articles:", error);
            return [];
        }
    },

    getUserArticles: async (authorName: string, authorId?: string): Promise<ArticleItem[]> => {
        try {
            // Strategy: Dual Query to support old (Name-only) and new (ID-based) items
            const queries = [];

            // 1. Query by author name (Legacy/Fallback)
            if (authorName) {
                queries.push(query(
                    collection(db, 'articles'),
                    where('author', '==', authorName),
                    orderBy('date', 'desc')
                ));
            }

            // 2. Query by authorId (New Robust Method)
            if (authorId) {
                queries.push(query(
                    collection(db, 'articles'),
                    where('authorId', '==', authorId),
                    orderBy('date', 'desc')
                ));
            }

            if (queries.length === 0) return [];

            const snapshots = await Promise.all(queries.map(q => getDocs(q)));

            // Merge and Deduplicate
            const articlesMap = new Map<string, ArticleItem>();

            snapshots.forEach(snap => {
                snap.forEach(doc => {
                    articlesMap.set(doc.id, { id: doc.id, ...doc.data() } as ArticleItem);
                });
            });

            // Convert back to array and sort
            return Array.from(articlesMap.values()).sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

        } catch (error) {
            console.error("Error fetching user articles:", error);
            throw error;
        }
    },

    getArticlesByCategories: async (categories: string[], lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, limitCount = 10): Promise<PaginatedResult<ArticleItem>> => {
        try {
            if (!categories || categories.length === 0) return { data: [], lastDoc: null, hasMore: false };

            // Firestore 'in' query supports max 10 values
            const limitedCategories = categories.slice(0, 10);

            let q = query(
                collection(db, 'articles'),
                where('category', 'in', limitedCategories),
                orderBy('date', 'desc'), // Requires composite index usually
                limit(limitCount)
            );

            if (lastDoc) {
                q = query(
                    collection(db, 'articles'),
                    where('category', 'in', limitedCategories),
                    orderBy('date', 'desc'),
                    startAfter(lastDoc),
                    limit(limitCount)
                );
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === limitCount
            };
        } catch (error) {
            console.error("Error fetching articles by categories:", error);
            return {
                data: [],
                lastDoc: null,
                hasMore: false
            };
        }
    },

    getArticlesByTag: async (tag: string, lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, limitCount = 10): Promise<PaginatedResult<ArticleItem>> => {
        try {
            let q = query(
                collection(db, 'articles'),
                where('tags', 'array-contains', tag),
                orderBy('date', 'desc'),
                limit(limitCount)
            );

            if (lastDoc) {
                q = query(
                    collection(db, 'articles'),
                    where('tags', 'array-contains', tag),
                    orderBy('date', 'desc'),
                    startAfter(lastDoc),
                    limit(limitCount)
                );
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === limitCount
            };
        } catch (error) {
            console.error("Error fetching articles by tag:", error);
            return { data: [], lastDoc: null, hasMore: false };
        }
    },

    getArticlesByIds: async (ids: string[]): Promise<ArticleItem[]> => {
        if (!ids || ids.length === 0) return [];

        // Firestore 'in' query limit is 10
        const chunks = [];
        for (let i = 0; i < ids.length; i += 10) {
            chunks.push(ids.slice(i, i + 10));
        }

        try {
            const results = await Promise.all(chunks.map(async chunk => {
                const q = query(
                    collection(db, 'articles'),
                    where(documentId(), 'in', chunk)
                );
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));
            }));

            return results.flat();
        } catch (error) {
            console.error("Error fetching articles by IDs:", error);
            // Return empty rules out partial failures? For now:
            return [];
        }
    },

    getArticle: async (articleId: string): Promise<ArticleItem | null> => {
        try {
            const docRef = doc(db, 'articles', articleId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as ArticleItem;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching article:", error);
            throw error;
        }
    },

    deleteArticle: async (articleId: string): Promise<void> => {
        try {
            const docRef = doc(db, 'articles', articleId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting article:", error);
            throw error;
        }
    },

    // --- Likes ---
    getArticleLikeStatus: async (articleId: string, userId: string): Promise<boolean> => {
        try {
            const docRef = doc(db, 'articles', articleId, 'likes', userId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists();
        } catch (error) {
            console.error("Error checking like status:", error);
            return false;
        }
    },

    toggleArticleLike: async (articleId: string, userId: string): Promise<boolean> => {
        try {
            const likeRef = doc(db, 'articles', articleId, 'likes', userId);
            const articleRef = doc(db, 'articles', articleId);
            const likeSnap = await getDoc(likeRef);

            if (likeSnap.exists()) {
                // Unlike
                await deleteDoc(likeRef);
                await updateDoc(articleRef, { likes: increment(-1) });
                return false;
            } else {
                // Like
                await setDoc(likeRef, { date: new Date().toISOString() });
                await updateDoc(articleRef, { likes: increment(1) });
                return true;
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            throw error;
        }
    },

    // --- Comments ---
    getComments: async (articleId: string): Promise<BlogComment[]> => {
        try {
            const q = query(
                collection(db, 'articles', articleId, 'comments'),
                orderBy('date', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                const date = new Date(data.date);
                const now = new Date();
                const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
                let timeAgo = 'Hace un momento';
                if (diffInHours >= 24) timeAgo = `Hace ${Math.floor(diffInHours / 24)} días`;
                else if (diffInHours >= 1) timeAgo = `Hace ${Math.floor(diffInHours)} horas`;

                return {
                    id: doc.id,
                    ...data,
                    timeAgo
                } as BlogComment;
            });
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },

    addComment: async (articleId: string, commentData: Omit<BlogComment, 'id' | 'timeAgo' | 'likes' | 'replies' | 'date'>): Promise<void> => {
        try {
            // Sanitize data to remove undefined values (especially parentId)
            const finalComment = sanitizeData({
                ...commentData,
                date: new Date().toISOString(),
                likes: 0
            });

            await addDoc(collection(db, 'articles', articleId, 'comments'), finalComment);

            try {
                const articleRef = doc(db, 'articles', articleId);
                await updateDoc(articleRef, {
                    comments: increment(1)
                });
            } catch (updateError) {
                console.warn("Could not update comment count (likely static article):", updateError);
                // We ignore this error so the comment is still "posted" from the user's perspective
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    },

    likeComment: async (articleId: string, commentId: string): Promise<void> => {
        try {
            const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
            await updateDoc(commentRef, {
                likes: increment(1)
            });
        } catch (error) {
            console.error("Error liking comment:", error);
            throw error;
        }
    },

    updateComment: async (articleId: string, commentId: string, content: string): Promise<void> => {
        try {
            const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
            await updateDoc(commentRef, {
                content: content,
                isEdited: true
            });
        } catch (error) {
            console.error("Error updating comment:", error);
            throw error;
        }
    },

    deleteComment: async (articleId: string, commentId: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, 'articles', articleId, 'comments', commentId));
            const articleRef = doc(db, 'articles', articleId);
            await updateDoc(articleRef, {
                comments: increment(-1)
            });
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
};
