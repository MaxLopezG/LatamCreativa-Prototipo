/**
 * Freelance Coming Soon View
 * Landing page for the upcoming Freelance marketplace (Fiverr-style)
 */
import React from 'react';
import { Briefcase } from 'lucide-react';
import { ServiceComingSoon } from '../../components/common/ServiceComingSoon';

export const FreelanceView: React.FC = () => {
    return (
        <ServiceComingSoon
            title="Freelance"
            subtitle="Conecta talento creativo con proyectos reales"
            description="Un marketplace donde creativos y developers pueden ofrecer sus servicios, encontrar proyectos y construir relaciones profesionales duraderas con clientes de todo el mundo."
            features={[
                'Perfiles verificados con portafolio integrado',
                'Sistema de escrow para pagos seguros',
                'Chat en tiempo real con clientes',
                'Sistema de reviews y calificaciones',
                'Gestión de proyectos integrada',
                'Sin comisiones ocultas'
            ]}
            icon={Briefcase}
            accentColor="green"
        />
    );
};

export default FreelanceView;
