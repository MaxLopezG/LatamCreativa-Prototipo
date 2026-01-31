/**
 * Datos de usuarios mock para modo local
 */
import { UserProfile } from '../types/user';

// Usuario demo para pruebas de login
export const DEMO_USER: UserProfile = {
    id: 'demo-user-001',
    name: 'Demo User',
    username: 'demouser',
    email: 'demo@latamcreativa.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    role: '3D Artist & Designer',
    headline: 'Artista 3D apasionado por crear mundos digitales',
    bio: 'Soy un artista 3D con más de 5 años de experiencia en la industria creativa. Me especializo en modelado de personajes, concept art y visualización arquitectónica.',
    location: 'Ciudad de México, México',
    website: 'https://demouser.com',
    isVerified: true,
    isPro: true,
    availableForWork: true,
    skills: ['Blender', 'ZBrush', 'Substance Painter', 'Photoshop', 'Maya', 'Unreal Engine'],
    socialLinks: {
        twitter: 'demouser',
        instagram: 'demouser.art',
        artstation: 'demouser',
        behance: 'demouser'
    },
    stats: {
        followers: 1250,
        following: 340,
        projects: 24,
        articles: 8,
        views: 45000,
        likes: 3200
    },
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: new Date().toISOString()
};

// Credenciales predefinidas
export const DEMO_CREDENTIALS = {
    email: 'demo@latamcreativa.com',
    password: 'demo123'
};

// Usuarios mock para mostrar en perfiles de autores
export const MOCK_USERS: UserProfile[] = [
    DEMO_USER,
    {
        id: 'mock-author-1',
        name: 'Ana García',
        username: 'anagarcia',
        email: 'ana@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
        role: '3D Artist',
        headline: 'Character Artist & 3D Generalist',
        bio: 'Especializada en diseño de personajes para videojuegos y animación.',
        location: 'Ciudad de México, México',
        isVerified: true,
        isPro: false,
        availableForWork: true,
        skills: ['Blender', 'ZBrush', 'Substance Painter', 'Photoshop'],
        stats: {
            followers: 890,
            following: 120,
            projects: 15,
            articles: 3,
            views: 22000,
            likes: 1800
        },
        createdAt: '2024-03-10T08:00:00Z'
    },
    {
        id: 'mock-author-2',
        name: 'Carlos Mendoza',
        username: 'carlosmendoza',
        email: 'carlos@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        role: 'Concept Artist',
        headline: 'Environment Artist | Concept Art',
        bio: 'Creo mundos imaginarios y escenarios para cine y videojuegos.',
        location: 'Bogotá, Colombia',
        isVerified: true,
        isPro: true,
        availableForWork: false,
        skills: ['Photoshop', 'Blender', 'Procreate'],
        stats: {
            followers: 2100,
            following: 450,
            projects: 32,
            articles: 12,
            views: 78000,
            likes: 5400
        },
        createdAt: '2023-08-22T14:30:00Z'
    },
    {
        id: 'mock-author-3',
        name: 'María López',
        username: 'marialopez3d',
        email: 'maria@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        role: 'Creature Artist',
        headline: 'Digital Sculptor | Creature Designer',
        bio: 'Escultura digital de criaturas fantásticas y orgánicas.',
        location: 'Buenos Aires, Argentina',
        isVerified: false,
        isPro: false,
        availableForWork: true,
        skills: ['ZBrush', 'Maya', 'Substance Painter', 'Blender'],
        stats: {
            followers: 560,
            following: 200,
            projects: 8,
            articles: 2,
            views: 12000,
            likes: 950
        },
        createdAt: '2024-06-05T16:00:00Z'
    }
];

/**
 * Obtener usuario por ID
 */
export const getMockUserById = (id: string): UserProfile | undefined => {
    return MOCK_USERS.find(user => user.id === id);
};

/**
 * Obtener usuario por username
 */
export const getMockUserByUsername = (username: string): UserProfile | undefined => {
    return MOCK_USERS.find(user => user.username === username);
};

/**
 * Obtener usuario por email
 */
export const getMockUserByEmail = (email: string): UserProfile | undefined => {
    return MOCK_USERS.find(user => user.email === email);
};
