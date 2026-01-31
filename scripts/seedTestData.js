/**
 * Seed Data Script for LatamCreativa
 * 
 * INSTRUCCIONES DE USO:
 * 1. Inicia sesión en tu cuenta de LatamCreativa (http://localhost:5173)
 * 2. Abre las DevTools (F12) → Console
 * 3. Copia y pega todo este script
 * 4. Presiona Enter
 * 
 * El script creará 8 posts de prueba en cada sección.
 */

(async function seedData() {
    // Verificar que estamos en la app correcta
    if (!window.location.href.includes('localhost:5173') && !window.location.href.includes('latamcreativa')) {
        console.error('❌ Este script debe ejecutarse en LatamCreativa');
        return;
    }

    // Importar Firebase directamente desde el módulo de la app
    const firebase = await import('/src/lib/firebase.ts');
    const firestore = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

    const { db } = firebase;
    const { collection, doc, setDoc, getDoc } = firestore;

    // Obtener usuario actual de Firebase Auth
    const authModule = await import('/src/lib/firebase.ts');
    const currentUser = authModule.auth?.currentUser;

    if (!currentUser) {
        console.error('❌ Debes iniciar sesión primero.');
        console.log('💡 Inicia sesión y vuelve a ejecutar este script.');
        return;
    }

    // Obtener datos del usuario desde Firestore
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : {};

    const user = {
        uid: currentUser.uid,
        displayName: userData.displayName || currentUser.displayName || 'Usuario Test',
        username: userData.username || 'testuser',
        photoURL: userData.avatar || currentUser.photoURL || ''
    };

    console.log('✅ Usuario:', user.displayName);
    console.log('🚀 Creando datos de prueba...\n');

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50) + '-' + Math.random().toString(36).substring(2, 8);
    };

    // ===== DATOS =====
    const projectsData = [
        { title: 'Ilustración Digital - Paisaje Fantástico', category: 'Ilustración', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', domain: 'creative' },
        { title: 'Concept Art - Personaje Cyberpunk', category: 'Concept Art', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', domain: 'creative' },
        { title: 'Modelado 3D - Escenario Medieval', category: 'Modelado 3D', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', domain: 'creative' },
        { title: 'Animación 2D - Ciclo de Caminata', category: 'Animación', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', domain: 'creative' },
        { title: 'Diseño UI/UX - App de Música', category: 'UI/UX', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', domain: 'creative' },
        { title: 'Fotografía - Serie Urbana', category: 'Fotografía', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', domain: 'creative' },
        { title: 'Motion Graphics - Intro Corporativa', category: 'Motion Graphics', image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800', domain: 'creative' },
        { title: 'Diseño Editorial - Revista Digital', category: 'Diseño Editorial', image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800', domain: 'creative' }
    ];

    const articlesData = [
        { title: '10 Técnicas de Ilustración Digital', category: 'Tutoriales', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', excerpt: 'Descubre las técnicas esenciales para ilustración digital.' },
        { title: 'El Futuro del Concept Art con IA', category: 'Industria', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', excerpt: 'Análisis del impacto de la IA en el concept art.' },
        { title: 'Cómo Construir un Portafolio que Destaque', category: 'Carrera', image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800', excerpt: 'Guía para crear un portafolio profesional.' },
        { title: 'Blender 4.0: Las Novedades', category: 'Software', image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800', excerpt: 'Todas las nuevas características de Blender 4.0.' },
        { title: 'Entrevista: Artista Latinoamericano', category: 'Entrevistas', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', excerpt: 'Conversación inspiradora sobre creatividad.' },
        { title: 'Guía de Precios para Freelancers', category: 'Freelance', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800', excerpt: 'Aprende a calcular tus precios como freelancer.' },
        { title: 'Color Theory: Dominando la Paleta', category: 'Tutoriales', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800', excerpt: 'Fundamentos de teoría del color aplicados.' },
        { title: 'Recursos Gratuitos para Artistas 2024', category: 'Recursos', image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800', excerpt: 'Lista de herramientas y recursos gratuitos.' }
    ];

    const forumData = [
        { title: '¿Cuál es tu software favorito para ilustración?', categoryId: 'general', content: 'Estoy buscando cambiar de software. ¿Cuál recomiendan?' },
        { title: 'Compartiendo mi proceso creativo', categoryId: 'showcase', content: 'Quería compartir cómo desarrollo una ilustración desde el boceto.' },
        { title: '¿Cómo manejan el síndrome del impostor?', categoryId: 'general', content: 'Últimamente he estado luchando con esto. ¿Cómo lo manejan ustedes?' },
        { title: 'Buscando colaboradores para cómic', categoryId: 'collaborations', content: 'Estoy desarrollando un cómic y busco ilustradores interesados.' },
        { title: 'Crítica constructiva: Mi primer personaje 3D', categoryId: 'critique', content: 'Acabo de terminar mi primer modelo en Blender. ¿Feedback?' },
        { title: '¿Vale la pena estudiar animación formalmente?', categoryId: 'careers', content: '¿Es mejor universidad o ser autodidacta?' },
        { title: 'Recursos: Pinceles gratuitos para Procreate', categoryId: 'resources', content: 'Compilé una lista de mis pinceles favoritos.' },
        { title: '¿Cómo organizan su flujo de trabajo?', categoryId: 'general', content: '¿Tienen algún sistema para organizar proyectos?' }
    ];

    try {
        // Crear proyectos
        console.log('📦 Creando proyectos...');
        for (let i = 0; i < projectsData.length; i++) {
            const p = projectsData[i];
            const id = `seed-proj-${Date.now()}-${i}`;
            await setDoc(doc(db, 'projects', id), {
                ...p,
                id,
                slug: generateSlug(p.title),
                description: `Proyecto de ejemplo: ${p.title}`,
                authorId: user.uid,
                artistUsername: user.username,
                status: 'published',
                views: Math.floor(Math.random() * 500),
                likes: Math.floor(Math.random() * 100),
                tags: [p.category.toLowerCase()],
                images: [],
                gallery: [],
                createdAt: new Date(Date.now() - i * 3600000).toISOString()
            });
            console.log(`  ✓ ${i + 1}/8: ${p.title}`);
        }

        // Crear artículos
        console.log('\n📝 Creando artículos...');
        for (let i = 0; i < articlesData.length; i++) {
            const a = articlesData[i];
            const id = `seed-art-${Date.now()}-${i}`;
            await setDoc(doc(db, 'articles', id), {
                ...a,
                id,
                slug: generateSlug(a.title),
                content: `<p>${a.excerpt}</p><p>Este es un artículo de prueba para verificar el frontend.</p>`,
                authorId: user.uid,
                authorName: user.displayName,
                authorAvatar: user.photoURL,
                domain: 'creative',
                status: 'published',
                views: Math.floor(Math.random() * 300),
                likes: Math.floor(Math.random() * 50),
                readTime: Math.floor(Math.random() * 10) + 3,
                tags: [a.category.toLowerCase()],
                createdAt: new Date(Date.now() - i * 7200000).toISOString(),
                updatedAt: new Date(Date.now() - i * 7200000).toISOString()
            });
            console.log(`  ✓ ${i + 1}/8: ${a.title}`);
        }

        // Crear hilos de foro
        console.log('\n💬 Creando hilos de foro...');
        for (let i = 0; i < forumData.length; i++) {
            const t = forumData[i];
            const id = `seed-thread-${Date.now()}-${i}`;
            await setDoc(doc(db, 'forum_threads', id), {
                ...t,
                id,
                slug: generateSlug(t.title),
                authorId: user.uid,
                authorName: user.displayName,
                authorUsername: user.username,
                authorAvatar: user.photoURL,
                tags: [],
                views: Math.floor(Math.random() * 200),
                replyCount: 0,
                voteCount: Math.floor(Math.random() * 20),
                isPinned: false,
                isLocked: false,
                isSolved: false,
                createdAt: new Date(Date.now() - i * 10800000).toISOString(),
                lastActivityAt: new Date(Date.now() - i * 10800000).toISOString()
            });
            console.log(`  ✓ ${i + 1}/8: ${t.title}`);
        }

        console.log('\n🎉 ¡Datos creados exitosamente!');
        console.log('   Refresca la página (F5) para verlos.');

    } catch (error) {
        console.error('❌ Error:', error);
    }
})();
