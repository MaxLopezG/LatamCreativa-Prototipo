/**
 * Política de Privacidad
 * 
 * Página legal con la política de privacidad de Latam Creativa.
 * 
 * @module views/legal/PrivacyView
 */
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../hooks/useAppStore';

export const PrivacyView: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useAppStore();
    const { contentMode } = state;

    const accentClass = contentMode === 'dev' ? 'text-blue-400' : 'text-amber-400';

    return (
        <div className="min-h-screen bg-[#030304] text-white">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#030304]/95 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-xl font-bold">Política de Privacidad</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
                <div className="text-sm text-slate-400 mb-8">
                    Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>1. Información que Recopilamos</h2>
                    <p className="text-slate-300 mb-3">Recopilamos información que nos proporcionas directamente:</p>
                    <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-2">
                        <li><strong>Datos de cuenta:</strong> Nombre, email, contraseña, foto de perfil.</li>
                        <li><strong>Perfil:</strong> Biografía, ubicación, habilidades, redes sociales.</li>
                        <li><strong>Contenido:</strong> Proyectos, artículos, comentarios que publicas.</li>
                        <li><strong>Comunicaciones:</strong> Mensajes que nos envías.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>2. Información Automática</h2>
                    <p className="text-slate-300 mb-3">Recopilamos automáticamente:</p>
                    <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-2">
                        <li><strong>Datos de uso:</strong> Páginas visitadas, tiempo en la plataforma.</li>
                        <li><strong>Dispositivo:</strong> Tipo de dispositivo, navegador, sistema operativo.</li>
                        <li><strong>IP:</strong> Dirección IP y ubicación aproximada.</li>
                        <li><strong>Cookies:</strong> Para mantener tu sesión y preferencias.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>3. Uso de la Información</h2>
                    <p className="text-slate-300 mb-3">Usamos tu información para:</p>
                    <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-2">
                        <li>Proporcionar y mejorar nuestros servicios.</li>
                        <li>Personalizar tu experiencia en la plataforma.</li>
                        <li>Enviar notificaciones sobre tu cuenta.</li>
                        <li>Responder a tus consultas y solicitudes.</li>
                        <li>Prevenir actividades fraudulentas o ilegales.</li>
                        <li>Cumplir con obligaciones legales.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>4. Compartir Información</h2>
                    <p className="text-slate-300 mb-3">No vendemos tu información personal. Podemos compartirla con:</p>
                    <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-2">
                        <li><strong>Otros usuarios:</strong> Tu perfil público y contenido publicado.</li>
                        <li><strong>Proveedores:</strong> Firebase (Google) para hosting y autenticación.</li>
                        <li><strong>Autoridades:</strong> Cuando lo requiera la ley.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>5. Seguridad de Datos</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Implementamos medidas de seguridad técnicas y organizativas para proteger tu información,
                        incluyendo cifrado en tránsito (HTTPS), almacenamiento seguro y controles de acceso.
                        Sin embargo, ningún sistema es 100% seguro.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>6. Tus Derechos</h2>
                    <p className="text-slate-300 mb-3">Tienes derecho a:</p>
                    <ul className="text-slate-300 leading-relaxed list-disc list-inside space-y-2">
                        <li><strong>Acceso:</strong> Solicitar una copia de tus datos.</li>
                        <li><strong>Rectificación:</strong> Corregir información incorrecta.</li>
                        <li><strong>Eliminación:</strong> Eliminar tu cuenta y datos.</li>
                        <li><strong>Portabilidad:</strong> Exportar tus datos en formato común.</li>
                        <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>7. Retención de Datos</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Mantenemos tu información mientras tu cuenta esté activa. Al eliminar tu cuenta,
                        borramos tus datos personales, aunque podemos retener cierta información anonimizada
                        para análisis estadístico.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>8. Cookies</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Usamos cookies esenciales para el funcionamiento de la plataforma (sesión, preferencias).
                        No usamos cookies de terceros para publicidad. Puedes gestionar las cookies en la
                        configuración de tu navegador.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>9. Menores de Edad</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Latam Creativa no está dirigida a menores de 13 años. No recopilamos
                        intencionalmente información de menores. Si detectamos una cuenta de un menor,
                        la eliminaremos.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>10. Cambios a esta Política</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios
                        significativos a través de la plataforma o por email.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className={`text-2xl font-bold ${accentClass}`}>11. Contacto</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Para consultas sobre privacidad: <a href="mailto:privacidad@latamcreativa.com" className={accentClass}>privacidad@latamcreativa.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};
