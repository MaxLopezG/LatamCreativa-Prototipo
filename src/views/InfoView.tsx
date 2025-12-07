
import React from 'react';
import { ArrowLeft, Shield, FileText, Info, Mail, HelpCircle } from 'lucide-react';

interface InfoViewProps {
  pageId: string;
  onBack: () => void;
}

export const InfoView: React.FC<InfoViewProps> = ({ pageId, onBack }) => {
  // Content Dictionary
  const contentMap: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
    'info-about': {
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
    'info-careers': {
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
    'info-press': {
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
    'info-contact': {
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
    'info-terms': {
      title: 'Términos de Servicio',
      icon: Shield,
      content: (
        <>
          <p className="mb-4 text-sm text-slate-500">Última actualización: 1 de Noviembre, 2024</p>
          <p className="mb-4">
            Bienvenido a Latam Creativa. Al acceder a nuestro sitio web, aceptas estar vinculado por estos términos de servicio, todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de las leyes locales aplicables.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">1. Licencia de Uso</h3>
          <p className="mb-4">
            Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de Latam Creativa para visualización transitoria personal y no comercial.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">2. Propiedad Intelectual</h3>
          <p className="mb-4">
            Todo el contenido subido por los usuarios (Portafolio, Assets, Cursos) permanece como propiedad intelectual de sus respectivos creadores. Latam Creativa obtiene una licencia limitada para mostrar y promocionar dicho contenido dentro de la plataforma.
          </p>
        </>
      )
    },
    'info-privacy': {
      title: 'Política de Privacidad',
      icon: Shield,
      content: (
        <>
          <p className="mb-4">
            Tu privacidad es importante para nosotros. Es política de Latam Creativa respetar tu privacidad con respecto a cualquier información que podamos recopilar de ti a través de nuestro sitio web.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-2">Datos que recopilamos</h3>
          <p className="mb-4">
            Solo solicitamos información personal cuando realmente la necesitamos para prestarte un servicio. La recopilamos por medios justos y legales, con tu conocimiento y consentimiento.
          </p>
        </>
      )
    },
    'info-cookies': {
      title: 'Política de Cookies',
      icon: Info,
      content: (
        <>
          <p className="mb-4">
            Utilizamos cookies para mejorar tu experiencia. Al usar Latam Creativa, aceptas el uso de cookies de acuerdo con nuestra política.
          </p>
          <p>
            Usamos cookies esenciales para mantener tu sesión activa y cookies de análisis para entender cómo interactúas con la plataforma y mejorar nuestros servicios.
          </p>
        </>
      )
    },
    'info-licenses': {
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
    'info-help': {
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
    'info-guides': {
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

  const currentData = contentMap[pageId] || contentMap['info-about'];
  const Icon = currentData.icon;

  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#030304]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 h-16 flex items-center gap-4">
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
