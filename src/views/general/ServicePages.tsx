/**
 * Coming Soon Service Pages
 * Individual service pages with descriptions
 */
import React from 'react';
import { ServiceComingSoon } from '../../components/common/ServiceComingSoon';
import { MessageCircleQuestion, Building2, Users, Trophy } from 'lucide-react';

// Forum Page
export const ForumComingSoon: React.FC = () => (
    <ServiceComingSoon
        title="Foro"
        subtitle="Conecta con la comunidad creativa"
        description="Un espacio dedicado para discutir ideas, compartir conocimientos, pedir feedback y resolver dudas con otros creativos y desarrolladores de Latinoamérica."
        features={[
            "Categorías especializadas por disciplina",
            "Sistema de reputación y badges",
            "Hilos con código y multimedia",
            "Notificaciones personalizadas",
            "Mentorías y grupos de estudio"
        ]}
        icon={MessageCircleQuestion}
        accentColor="purple"
    />
);

// Jobs Page
export const JobsComingSoon: React.FC = () => (
    <ServiceComingSoon
        title="Bolsa de Trabajo"
        subtitle="Oportunidades para creativos LATAM"
        description="Conectamos talento creativo latinoamericano con empresas y estudios de todo el mundo. Trabajos remotos, freelance y presenciales para artistas 3D, animadores, desarrolladores y más."
        features={[
            "Ofertas remotas internacionales",
            "Filtros por experiencia y habilidades",
            "Aplicación directa desde tu perfil",
            "Alertas de empleos personalizadas",
            "Salarios transparentes en USD"
        ]}
        icon={Building2}
        accentColor="green"
    />
);

// Collaborative Projects Page
export const ProjectsComingSoon: React.FC = () => (
    <ServiceComingSoon
        title="Proyectos Colaborativos"
        subtitle="Crea en equipo con otros creativos"
        description="Encuentra colaboradores para tus proyectos o únete a equipos que necesitan tus habilidades. Desde cortometrajes hasta videojuegos, construye tu portafolio trabajando en equipo."
        features={[
            "Publica tu proyecto y busca talento",
            "Únete a equipos que te necesitan",
            "Sistema de roles y responsabilidades",
            "Control de versiones y entregas",
            "Créditos verificables en tu perfil"
        ]}
        icon={Users}
        accentColor="blue"
    />
);

// Contests Page
export const ContestsComingSoon: React.FC = () => (
    <ServiceComingSoon
        title="Concursos"
        subtitle="Compite, aprende y gana premios"
        description="Participa en desafíos creativos con temáticas únicas, gana premios increíbles y destaca tu talento ante estudios y empresas que buscan nuevas voces creativas."
        features={[
            "Desafíos mensuales con premios",
            "Categorías para todos los niveles",
            "Jurado de profesionales de la industria",
            "Premios en efectivo y suscripciones",
            "Exposición ante reclutadores"
        ]}
        icon={Trophy}
        accentColor="amber"
    />
);
