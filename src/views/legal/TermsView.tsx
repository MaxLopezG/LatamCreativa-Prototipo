/**
 * Términos de Servicio
 * 
 * Página legal con los términos y condiciones de uso de Latam Creativa.
 * 
 * @module views/legal/TermsView
 */
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../hooks/useAppStore';

export const TermsView: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useAppStore();
    const { contentMode } = state;

    const accentClass = contentMode === 'dev' ? 'text-blue-400' : 'text-amber-400';

    return (
        <div className="min-h-screen bg-[#0d0d0f] text-white">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0d0d0f]/95 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-xl font-bold">Términos de Servicio</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
                <div className="text-sm text-slate-400 mb-8">
                    Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>1. Aceptación de los Términos</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Al acceder y utilizar Latam Creativa ("la Plataforma"), aceptas estar vinculado por estos Términos de Servicio.
                        Si no estás de acuerdo con alguno de estos términos, no debes usar la Plataforma.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>2. Descripción del Servicio</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Latam Creativa es una plataforma de portafolio y comunidad para creativos y desarrolladores de Latinoamérica.
                        Ofrecemos herramientas para mostrar trabajo, conectar con otros profesionales y acceder a oportunidades laborales.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>3. Registro de Cuenta</h2>
                    <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-2">
                        <li>Debes proporcionar información precisa y completa al registrarte.</li>
                        <li>Eres responsable de mantener la confidencialidad de tu cuenta.</li>
                        <li>Debes tener al menos 13 años para usar la Plataforma.</li>
                        <li>Una persona solo puede tener una cuenta activa.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>4. Contenido del Usuario</h2>
                    <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-2">
                        <li>Mantienes todos los derechos sobre el contenido que publicas.</li>
                        <li>Otorgas a Latam Creativa una licencia para mostrar tu contenido en la Plataforma.</li>
                        <li>No debes publicar contenido que infrinja derechos de terceros.</li>
                        <li>Nos reservamos el derecho de eliminar contenido que viole estos términos.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>5. Conducta Prohibida</h2>
                    <p className="text-slate-300 mb-3">Está prohibido:</p>
                    <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-2">
                        <li>Publicar contenido ilegal, ofensivo o que incite al odio.</li>
                        <li>Acosar, amenazar o intimidar a otros usuarios.</li>
                        <li>Hacer spam o publicidad no autorizada.</li>
                        <li>Intentar acceder a cuentas de otros usuarios.</li>
                        <li>Usar bots o scripts automatizados sin autorización.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>6. Propiedad Intelectual</h2>
                    <p className="text-slate-300 leading-relaxed">
                        La marca, diseño y código de Latam Creativa son propiedad exclusiva de la Plataforma.
                        No puedes copiar, modificar o distribuir ningún elemento sin autorización expresa.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>7. Terminación</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Podemos suspender o cancelar tu cuenta si violas estos términos.
                        Puedes eliminar tu cuenta en cualquier momento desde la configuración.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>8. Limitación de Responsabilidad</h2>
                    <p className="text-slate-300 leading-relaxed">
                        La Plataforma se proporciona "tal cual". No garantizamos disponibilidad ininterrumpida
                        ni nos hacemos responsables por pérdidas derivadas del uso de la Plataforma.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>9. Modificaciones</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Nos reservamos el derecho de modificar estos términos en cualquier momento.
                        Te notificaremos sobre cambios importantes a través de la Plataforma.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>10. Contacto</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Para preguntas sobre estos términos, contáctanos en: <a href="mailto:legal@latamcreativa.com" className={accentClass}>legal@latamcreativa.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};
