/**
 * Courses Coming Soon View
 * Landing page for the upcoming Courses/Education service (Udemy-style)
 */
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { ServiceComingSoon } from '../../components/common/ServiceComingSoon';

export const CoursesView: React.FC = () => {
    return (
        <ServiceComingSoon
            title="Cursos"
            subtitle="Aprende de los mejores creativos y developers"
            description="Una plataforma de educación online donde expertos de la industria comparten su conocimiento a través de cursos estructurados, tutoriales prácticos y proyectos guiados."
            features={[
                'Cursos creados por profesionales activos de la industria',
                'Proyectos prácticos con feedback de la comunidad',
                'Certificados de finalización verificables',
                'Acceso de por vida a los cursos comprados',
                'Q&A directo con los instructores',
                'Comunidad privada de estudiantes'
            ]}
            icon={GraduationCap}
            accentColor="purple"
        />
    );
};

export default CoursesView;
