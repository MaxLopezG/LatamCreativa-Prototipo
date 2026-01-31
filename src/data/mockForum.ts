/**
 * Datos de foro mock para modo local
 */
import { ForumThread, ForumReply, ForumCategory } from '../types/forum';

export const MOCK_FORUM_CATEGORIES: ForumCategory[] = [
    {
        id: 'cat-general',
        name: 'General',
        slug: 'general',
        description: 'Discusiones generales sobre arte y creatividad',
        icon: 'MessageSquare',
        color: '#3B82F6',
        threadCount: 45,
        order: 1
    },
    {
        id: 'cat-3d',
        name: '3D & Modelado',
        slug: '3d-modelado',
        description: 'Todo sobre modelado 3D, escultura digital y renders',
        icon: 'Box',
        color: '#8B5CF6',
        threadCount: 32,
        order: 2
    },
    {
        id: 'cat-2d',
        name: 'Ilustración & 2D',
        slug: 'ilustracion-2d',
        description: 'Ilustración digital, concept art y diseño gráfico',
        icon: 'Palette',
        color: '#EC4899',
        threadCount: 28,
        order: 3
    },
    {
        id: 'cat-recursos',
        name: 'Recursos',
        slug: 'recursos',
        description: 'Comparte y encuentra recursos, tutoriales y herramientas',
        icon: 'Download',
        color: '#10B981',
        threadCount: 56,
        order: 4
    },
    {
        id: 'cat-trabajo',
        name: 'Ofertas de Trabajo',
        slug: 'trabajo',
        description: 'Oportunidades laborales y colaboraciones',
        icon: 'Briefcase',
        color: '#F59E0B',
        threadCount: 18,
        order: 5
    }
];

export const MOCK_FORUM_THREADS: ForumThread[] = [
    {
        id: 'thread-1',
        slug: 'cual-es-el-mejor-software-para-empezar-en-3d',
        title: '¿Cuál es el mejor software para empezar en 3D?',
        content: `Hola comunidad! 👋

Soy nuevo en el mundo del 3D y estoy un poco abrumado con tantas opciones de software. He escuchado sobre Blender, Maya, 3ds Max, Cinema 4D...

¿Cuál recomendarían para alguien que está empezando desde cero? Mi objetivo es eventualmente trabajar en videojuegos.

Gracias de antemano por sus consejos!`,
        authorId: 'mock-author-3',
        authorName: 'María López',
        authorUsername: 'marialopez3d',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        category: 'cat-3d',
        tags: ['principiantes', 'software', '3d'],
        views: 342,
        replies: 15,
        likes: 28,
        isPinned: true,
        isClosed: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'thread-2',
        slug: 'comparto-mi-proceso-de-creacion-personaje-cyberpunk',
        title: 'Comparto mi proceso de creación de un personaje cyberpunk',
        content: `¡Hola a todos!

Después de 3 semanas de trabajo, finalmente terminé este personaje cyberpunk que quería compartir con ustedes. 

## El Proceso

1. **Concepto**: Empecé con bocetos rápidos para definir la silueta
2. **Blockout**: Formas básicas en ZBrush
3. **Escultura**: Detalles de alta resolución
4. **Retopo**: Topología limpia en Maya
5. **UVs**: Unwrap en RizomUV
6. **Texturas**: Substance Painter
7. **Render**: Marmoset Toolbag

¿Qué les parece? Acepto críticas constructivas!`,
        authorId: 'demo-user-001',
        authorName: 'Demo User',
        authorUsername: 'demouser',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        category: 'cat-3d',
        tags: ['showcase', 'personaje', 'cyberpunk', 'proceso'],
        views: 1205,
        replies: 34,
        likes: 89,
        isPinned: false,
        isClosed: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'thread-3',
        slug: 'lista-actualizada-recursos-gratuitos-artistas-2024',
        title: '🔥 Lista actualizada de recursos gratuitos para artistas 2024',
        content: `He recopilado una lista de recursos gratuitos que uso constantemente:

## Software
- **Blender** - Modelado, animación, render (gratuito)
- **Krita** - Pintura digital (gratuito)
- **DaVinci Resolve** - Edición de video (gratuito)

## Texturas
- Poly Haven - HDRIs, texturas, modelos
- AmbientCG - Materiales PBR
- Textures.com - Texturas de alta resolución

## Referencias
- PureRef - Organización de referencias
- Pinterest - Inspiración infinita

## Aprendizaje
- Blender Guru (YouTube)
- Flipped Normals (YouTube)
- CGCookie (algunos cursos gratuitos)

¿Conocen más recursos que debería agregar a la lista?`,
        authorId: 'mock-author-2',
        authorName: 'Carlos Mendoza',
        authorUsername: 'carlosmendoza',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        category: 'cat-recursos',
        tags: ['recursos', 'gratuito', 'herramientas', 'lista'],
        views: 2845,
        replies: 67,
        likes: 203,
        isPinned: true,
        isClosed: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'thread-4',
        slug: 'estudio-busca-character-artist-jr-remoto',
        title: 'Estudio busca Character Artist Jr. - Remoto Latinoamérica',
        content: `**Empresa**: Studio Imagina (Argentina)
**Posición**: Character Artist Junior
**Modalidad**: Remoto
**Ubicación**: Latinoamérica

## Requisitos

- Conocimientos de anatomía humana
- Experiencia con ZBrush y/o Blender
- Portfolio con al menos 3 personajes terminados
- Nivel básico de inglés

## Deseable

- Conocimiento de Substance Painter
- Experiencia con pipelines de videojuegos
- Modelado estilizado

## Ofrecemos

- Salario competitivo en USD
- Horario flexible
- Equipo multicultural
- Proyectos para clientes internacionales

**Interesados enviar CV y portfolio a: jobs@studioimagina.com**`,
        authorId: 'mock-author-1',
        authorName: 'Ana García',
        authorUsername: 'anagarcia',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        category: 'cat-trabajo',
        tags: ['trabajo', 'remoto', 'character-artist', 'junior'],
        views: 567,
        replies: 8,
        likes: 42,
        isPinned: false,
        isClosed: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
];

export const MOCK_FORUM_REPLIES: ForumReply[] = [
    {
        id: 'reply-1-1',
        threadId: 'thread-1',
        content: 'Sin duda Blender. Es gratuito, tiene una comunidad enorme, y cada vez más estudios lo están adoptando. Además, los tutoriales de Blender Guru son perfectos para empezar.',
        authorId: 'demo-user-001',
        authorName: 'Demo User',
        authorUsername: 'demouser',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        likes: 12,
        isBestAnswer: true,
        isEdited: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'reply-1-2',
        threadId: 'thread-1',
        content: 'Concuerdo con Blender para empezar. Pero si tu objetivo específico es videojuegos, eventualmente querrás aprender también Maya o 3ds Max, ya que muchos estudios aún los usan en sus pipelines.',
        authorId: 'mock-author-2',
        authorName: 'Carlos Mendoza',
        authorUsername: 'carlosmendoza',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        likes: 8,
        isBestAnswer: false,
        isEdited: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'reply-2-1',
        threadId: 'thread-2',
        content: '¡Increíble trabajo! Me encanta el nivel de detalle en la armadura. ¿Cuántos polígonos tiene el modelo final?',
        authorId: 'mock-author-1',
        authorName: 'Ana García',
        authorUsername: 'anagarcia',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        likes: 5,
        isBestAnswer: false,
        isEdited: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
];

/**
 * Obtener thread por ID
 */
export const getMockThreadById = (id: string): ForumThread | undefined => {
    return MOCK_FORUM_THREADS.find(thread => thread.id === id);
};

/**
 * Obtener threads por categoría
 */
export const getMockThreadsByCategory = (categoryId: string): ForumThread[] => {
    return MOCK_FORUM_THREADS.filter(thread => thread.category === categoryId);
};

/**
 * Obtener replies de un thread
 */
export const getMockRepliesByThread = (threadId: string): ForumReply[] => {
    return MOCK_FORUM_REPLIES.filter(reply => reply.threadId === threadId);
};
