
import React from 'react';
import { ArrowLeft, Shield, FileText, Info, Mail, HelpCircle } from 'lucide-react';

interface InfoViewProps {
  pageId: string;
  onBack: () => void;
}

import { useParams } from 'react-router-dom';

export const InfoView: React.FC<InfoViewProps> = ({ pageId, onBack }) => {
  const { pageId: paramPageId } = useParams<{ pageId: string }>();
  const activePageId = pageId || paramPageId || 'about';

  // Content Dictionary
  const contentMap: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
    'about': {
      title: 'Sobre Nosotros',
      icon: Info,
      content: (
        <>
          <p className="text-lg leading-relaxed mb-4">
            Latam Creativa nació con una misión simple: <strong>Democratizar el acceso a la industria creativa en Latinoamérica.</strong>
          </p>
          <p className="mb-4">
            Somos un equipo de artistas, desarrolladores y soñadores que creen que el talento no tiene fronteras, pero las oportunidades a veces sí. Creamos este ecosistema para romper esas barreras.
          </p>
          <p>
            Desde nuestra fundación en 2023, hemos ayudado a más de 50,000 artistas a conectar, aprender y trabajar en proyectos que aman.
          </p>
        </>
      )
    },
    'careers': {
      title: 'Trabaja con Nosotros',
      icon: Info,
      content: (
        <>
          <p className="text-lg leading-relaxed mb-4">
            ¿Quieres construir el futuro de la economía creativa? Estamos buscando talento.
          </p>
          <p className="mb-6">
            Actualmente somos un equipo 100% remoto distribuido por toda América Latina y España. Valoramos la autonomía, la pasión por el arte y el código limpio.
          </p>
          <h3 className="text-xl font-bold text-white mb-3">Posiciones Abiertas</h3>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Senior React Developer</li>
            <li>Product Designer (UI/UX)</li>
            <li>Community Manager (Brasil)</li>
          </ul>
          <p>Envía tu CV a <span className="text-amber-500">talento@latamcreativa.com</span></p>
        </>
      )
    },
    'press': {
      title: 'Prensa y Medios',
      icon: FileText,
      content: (
        <>
          <p className="mb-4">Gracias por tu interés en Latam Creativa.</p>
          <p className="mb-6">
            Aquí puedes descargar nuestro Brand Kit (Logos, colores, capturas de pantalla) y leer nuestros últimos comunicados de prensa.
          </p>
          <button className="px-6 py-2 bg-slate-100 dark:bg-white/10 rounded-lg font-bold text-slate-900 dark:text-white hover:bg-slate-200 transition-colors">
            Descargar Media Kit (.zip)
          </button>
        </>
      )
    },
    'contact': {
      title: 'Contacto',
      icon: Mail,
      content: (
        <>
          <p className="mb-6">
            ¿Tienes alguna duda, sugerencia o propuesta de colaboración? Nos encantaría escucharte.
          </p>
          <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10 max-w-lg">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Asunto</label>
              <select className="w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg p-2.5 outline-none">
                <option>Soporte Técnico</option>
                <option>Ventas / Enterprise</option>
                <option>Reportar Abuso</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Mensaje</label>
              <textarea rows={4} className="w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-lg p-2.5 outline-none"></textarea>
            </div>
            <button className="w-full py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors">Enviar Mensaje</button>
          </div>
        </>
      )
    },
    'terms': {
      title: 'Términos de Servicio',
      icon: Shield,
      content: (
        <div className="space-y-8">
          <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
            <p className="text-sm text-slate-500">Última actualización: 1 de Diciembre, 2024</p>
            <p className="mt-2">Bienvenido a Latam Creativa. Estos términos rigen el uso de nuestra plataforma y servicios.</p>
          </div>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Aceptación de los Términos</h3>
            <p className="leading-relaxed">
              Al acceder y utilizar Latam Creativa ("la Plataforma"), aceptas cumplir y estar legalmente vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguno de estos términos, te pedimos abstenerte de usar nuestros servicios.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Cuentas de Usuario</h3>
            <ul className="list-disc pl-5 space-y-2 marker:text-amber-500">
              <li>Debes proporcionar información precisa y completa al registrarte.</li>
              <li>Eres responsable de mantener la seguridad de tu contraseña.</li>
              <li>Nos reservamos el derecho de suspender cuentas que violen nuestras normas comunitarias.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Propiedad Intelectual</h3>
            <p className="leading-relaxed mb-4">
              <strong>Tus Contenidos:</strong> Conservas todos los derechos de propiedad sobre el contenido que publicas (portafolios, proyectos, assets). Al subir contenido, otorgas a Latam Creativa una licencia no exclusiva para mostrarlo y promocionarlo dentro de la plataforma.
            </p>
            <p className="leading-relaxed">
              <strong>Nuestros Contenidos:</strong> El diseño de la plataforma, el código, el logotipo y la marca "Latam Creativa" son propiedad exclusiva nuestra.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. Conducta Prohibida</h3>
            <p className="leading-relaxed">
              Queda estrictamente prohibido usar la plataforma para difundir malware, realizar scraping de datos, acosar a otros usuarios, o publicar contenido ilegal o explícito.
            </p>
          </section>
        </div>
      )
    },
    'privacy': {
      title: 'Política de Privacidad',
      icon: Shield,
      content: (
        <div className="space-y-8">
          <p className="text-lg leading-relaxed">
            En Latam Creativa, la privacidad de tus datos es una prioridad. Esta política detalla qué información recopilamos y cómo la protegemos.
          </p>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Datos que Recopilamos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-lg">
                <h4 className="font-bold mb-2 text-amber-500">Información Directa</h4>
                <p className="text-sm">Nombre, correo electrónico, portafolio y datos de pago proporcionados al registrarte.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-lg">
                <h4 className="font-bold mb-2 text-blue-500">Información Automática</h4>
                <p className="text-sm">Dirección IP, tipo de dispositivo, y patrones de navegación para análisis de UX.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Uso de la Información</h3>
            <p className="leading-relaxed mb-4">Utilizamos tus datos para:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Proporcionar y mantener el servicio.</li>
              <li>Procesar transacciones de compras en el Mercado.</li>
              <li>Enviarte notificaciones relevantes (puedes darte de baja en cualquier momento).</li>
              <li>Prevenir el fraude y garantizar la seguridad.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Tus Derechos (GDPR/ARCO)</h3>
            <p className="leading-relaxed">
              Tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Puedes ejercer estos derechos desde la configuración de tu cuenta o contactando a soporte.
            </p>
          </section>
        </div>
      )
    },
    'cookies': {
      title: 'Política de Cookies',
      icon: Info,
      content: (
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia, personalizar contenido y analizar nuestro tráfico.
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-white/5 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Propósito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                <tr>
                  <td className="p-4 font-bold text-amber-500">Esenciales</td>
                  <td className="p-4 text-slate-500">Necesarias para el funcionamiento básico (ej. mantener sesión iniciada).</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-blue-500">Analíticas</td>
                  <td className="p-4 text-slate-500">Nos ayudan a entender cómo usas el sitio para mejorarlo.</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-purple-500">Publicitarias</td>
                  <td className="p-4 text-slate-500">Usadas para mostrar anuncios relevantes en sitios de terceros.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    'licenses': {
      title: 'Licencias de Assets',
      icon: FileText,
      content: (
        <>
          <p className="mb-6">
            Entender nuestros tipos de licencia es crucial tanto para vendedores como para compradores en el Mercado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10">
              <h4 className="font-bold text-lg mb-2">Licencia Standard</h4>
              <p className="text-sm mb-4">Para uso personal y proyectos comerciales pequeños.</p>
              <ul className="list-disc pl-4 text-sm space-y-1">
                <li>1 Proyecto Comercial</li>
                <li>Uso personal ilimitado</li>
                <li>No redistribuible</li>
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10">
              <h4 className="font-bold text-lg mb-2">Licencia Extendida</h4>
              <p className="text-sm mb-4">Para estudios y proyectos a gran escala.</p>
              <ul className="list-disc pl-4 text-sm space-y-1">
                <li>Proyectos comerciales ilimitados</li>
                <li>Uso en múltiples sedes</li>
                <li>Permite modificación de assets</li>
              </ul>
            </div>
          </div>
        </>
      )
    },
    'help': {
      title: 'Centro de Ayuda',
      icon: HelpCircle,
      content: (
        <>
          <p className="mb-6">¿Cómo podemos ayudarte hoy?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Problemas con pagos', 'Subir mi primer curso', 'Verificar mi cuenta', 'Reportar un bug'].map(item => (
              <button key={item} className="p-4 text-left bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-amber-500 transition-colors font-medium">
                {item}
              </button>
            ))}
          </div>
          <p className="mt-8">
            ¿No encuentras lo que buscas? <button className="text-amber-500 underline">Contacta a soporte</button>.
          </p>
        </>
      )
    },
    'guides': {
      title: 'Guías de la Comunidad',
      icon: FileText,
      content: (
        <>
          <p className="mb-4">
            Recursos para sacar el máximo provecho a Latam Creativa.
          </p>
          <ul className="space-y-4">
            <li className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
              <h4 className="font-bold">Cómo crear un portafolio de alto impacto</h4>
              <p className="text-sm text-slate-500">Consejos de directores de arte para destacar.</p>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
              <h4 className="font-bold">Guía para vender en el Mercado</h4>
              <p className="text-sm text-slate-500">Mejores prácticas para miniaturas, descripciones y precios.</p>
            </li>
          </ul>
        </>
      )
    }
  };

  const currentData = contentMap[activePageId] || contentMap['about'];
  const Icon = currentData.icon;

  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in pb-20">

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#0d0d0f]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon className="h-5 w-5 text-amber-500" />
          {currentData.title}
        </h1>
      </div>

      <div className="p-6 md:p-12">
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          {currentData.content}
        </div>
      </div>

    </div>
  );
};
