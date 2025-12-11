
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, Star, Globe, AlertCircle, PlayCircle, Check, 
  Tv, Download, Smartphone, Trophy, ChevronDown, ChevronUp, 
  BarChart, FileText, Share2, Heart, Clock, ShoppingCart
} from 'lucide-react';
import { EDUCATION_ITEMS } from '../../data/content';
import { CartItem } from '../../types';

interface CourseDetailViewProps {
  courseId?: string;
  onBack: () => void;
  onAuthorClick?: (authorName: string) => void;
  onAddToCart?: (item: CartItem) => void;
  onBuyNow?: (item: CartItem) => void;
  onStartCourse?: (courseId: string) => void;
  onShare?: () => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ courseId, onBack, onAuthorClick, onAddToCart, onBuyNow, onStartCourse, onShare }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = courseId || paramId;
  const course = EDUCATION_ITEMS.find(c => c.id === id) || EDUCATION_ITEMS[0];
  const [isWishlisted, setIsWishlisted] = useState(false);

  const itemPayload: CartItem = {
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      type: 'course'
  };

  const handleAddToCart = () => {
    onAddToCart?.(itemPayload);
  };

  const handleBuyNow = () => {
    onBuyNow?.(itemPayload);
  };

  // Mock Curriculum Data
  const CURRICULUM = [
    {
      title: 'Introducción al Curso',
      lectures: 3,
      duration: '15 min',
      items: [
        { title: 'Bienvenida y visión general', time: '05:00', free: true },
        { title: 'Configurando el espacio de trabajo', time: '08:20', free: true },
        { title: 'Recursos descargables', time: '01:40', free: false }
      ]
    },
    {
      title: 'Fundamentos Esenciales',
      lectures: 5,
      duration: '45 min',
      items: [
        { title: 'Interfaz de usuario y navegación', time: '12:00', free: false },
        { title: 'Herramientas básicas de modelado', time: '15:30', free: false },
        { title: 'Atajos de teclado imprescindibles', time: '08:15', free: false },
        { title: 'Trabajando con primitivas', time: '10:00', free: false }
      ]
    },
    {
      title: 'Modelado Avanzado',
      lectures: 8,
      duration: '2h 10m',
      items: [
        { title: 'Topología limpia para animación', time: '20:00', free: false },
        { title: 'Modificadores no destructivos', time: '25:00', free: false },
        { title: 'Esculpido digital básico', time: '30:00', free: false }
      ]
    }
  ];

  return (
    <div className="relative animate-fade-in bg-slate-50 dark:bg-[#030304]">
      
      {/* Dark Header Background (Hero) */}
      <div className="bg-[#1C1D1F] text-white pt-8 pb-12 px-6 md:px-12 relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Content (Header Info) */}
          <div className="lg:col-span-8 z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-blue-200 mb-4 font-medium">
              <button onClick={onBack} className="hover:text-white flex items-center gap-1">
                 <ArrowLeft className="h-4 w-4" /> Volver
              </button>
              <span className="text-slate-400">/</span>
              <span className="text-blue-200">Educación</span>
              <span className="text-slate-400">/</span>
              <span className="text-white">{course.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{course.title}</h1>
            <p className="text-lg text-slate-300 mb-6 max-w-3xl">
              Domina las herramientas profesionales y lleva tus habilidades al siguiente nivel con este curso completo paso a paso.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {course.bestseller && (
                <span className="bg-amber-400 text-black px-2 py-1 rounded font-bold uppercase text-xs">Bestseller</span>
              )}
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="text-base">{course.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(course.rating) ? 'fill-current' : 'text-slate-500 fill-transparent'}`} />
                  ))}
                </div>
              </div>
              <span className="text-blue-200 underline">({course.reviewCount.toLocaleString()} reseñas)</span>
              <span className="text-white">{course.students.toLocaleString()} estudiantes</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span>Creado por</span>
                <button onClick={() => onAuthorClick?.(course.instructor)} className="text-blue-200 underline hover:text-white transition-colors">{course.instructor}</button>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Última actualización: {course.updatedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Español</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-10 order-2 lg:order-1">
          
          {/* What you'll learn */}
          <div className="border border-slate-200 dark:border-white/10 p-6 rounded-xl bg-white dark:bg-white/[0.02]">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Lo que aprenderás</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Dominar la interfaz y herramientas principales.',
                'Crear modelos 3D complejos desde cero.',
                'Texturizado avanzado y materiales PBR.',
                'Iluminación cinemática y renderizado.',
                'Optimización de assets para videojuegos.',
                'Post-producción y composición final.'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-slate-900 dark:text-white shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Content (Curriculum) */}
          <div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contenido del curso</h2>
             <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
                <span>{course.lectures} clases • {course.duration} de duración total</span>
                <button className="text-amber-600 dark:text-amber-500 font-bold hover:underline">Expandir todo</button>
             </div>
             
             <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-white/[0.02]">
                {CURRICULUM.map((section, idx) => (
                   <CurriculumSection key={idx} section={section} />
                ))}
             </div>
          </div>

          {/* Requirements */}
          <div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Requisitos</h2>
             <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-2">
                <li>PC o Mac capaz de ejecutar el software 3D.</li>
                <li>No se requiere experiencia previa en 3D.</li>
                <li>Muchas ganas de aprender y practicar.</li>
             </ul>
          </div>

          {/* Description */}
          <div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Descripción</h2>
             <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                <p>
                   Bienvenido al curso definitivo para artistas digitales que quieren especializarse en esta herramienta.
                   A lo largo de este curso, pasaremos de los conceptos más básicos a técnicas avanzadas utilizadas en estudios profesionales.
                </p>
                <p>
                   Aprenderás no solo a usar las herramientas, sino a pensar como un artista 3D, resolviendo problemas y optimizando tu flujo de trabajo.
                   Incluye proyectos prácticos, recursos descargables y acceso a una comunidad exclusiva de alumnos.
                </p>
                <p className="font-bold">
                   Este curso es para ti si:
                </p>
                <ul>
                   <li>Eres principiante y quieres entrar en la industria.</li>
                   <li>Ya conoces el software pero quieres mejorar tu técnica.</li>
                   <li>Buscas crear un portafolio sólido para conseguir trabajo.</li>
                </ul>
             </div>
          </div>

          {/* Instructor */}
          <div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Instructor</h2>
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                   <button onClick={() => onAuthorClick?.(course.instructor)} className="text-xl font-bold text-amber-600 dark:text-amber-500 underline hover:text-amber-700">{course.instructor}</button>
                   <span className="text-slate-500 text-sm">Senior 3D Artist & Educator</span>
                </div>
                
                <div className="flex gap-4">
                   <button onClick={() => onAuthorClick?.(course.instructor)}>
                     <img src={course.instructorAvatar} alt={course.instructor} className="h-28 w-28 rounded-full object-cover ring-4 ring-slate-100 dark:ring-white/10 hover:opacity-90 transition-opacity" />
                   </button>
                   <div className="flex flex-col gap-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                         <Star className="h-4 w-4 fill-slate-900 dark:fill-white" />
                         <span>4.8 Calificación de instructor</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Trophy className="h-4 w-4" />
                         <span>25,000+ Reseñas</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <PlayCircle className="h-4 w-4" />
                         <span>12 Cursos</span>
                      </div>
                   </div>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-2">
                   Hola, soy {course.instructor}. He trabajado en la industria de los videojuegos y el cine durante más de 10 años.
                   Me apasiona enseñar y compartir todo lo que he aprendido en mi carrera profesional para ayudarte a alcanzar tus metas artísticas.
                </div>
             </div>
          </div>

        </div>

        {/* Right Sidebar (Sticky Purchase Card) */}
        <div className="lg:col-span-4 order-1 lg:order-2">
           <div className="sticky top-24">
              <div className="bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
                 
                 {/* Video Preview */}
                 <div className="relative aspect-video bg-slate-900 group cursor-pointer border-b border-slate-200 dark:border-white/5">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <div className="bg-white rounded-full p-4 mb-4 shadow-lg group-hover:scale-110 transition-transform">
                          <PlayCircle className="h-8 w-8 text-black fill-black" />
                       </div>
                       <span className="font-bold text-white text-sm drop-shadow-md">Vista previa del curso</span>
                    </div>
                 </div>

                 <div className="p-6">
                    <button 
                       onClick={() => onStartCourse?.(course.id)} 
                       className="w-full py-4 bg-green-600 text-white font-bold text-base rounded-lg hover:bg-green-700 transition-colors shadow-lg mb-4 flex items-center justify-center gap-2"
                    >
                       <PlayCircle className="h-5 w-5" /> Ir al Curso
                    </button>

                    <div className="flex items-end gap-3 mb-4">
                       <span className="text-4xl font-bold text-slate-900 dark:text-white">${course.price}</span>
                       {course.originalPrice && (
                          <span className="text-lg text-slate-500 line-through mb-1">${course.originalPrice}</span>
                       )}
                       {course.originalPrice && (
                          <span className="text-base text-amber-600 dark:text-amber-500 font-medium mb-1">
                             {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% Dto.
                          </span>
                       )}
                    </div>

                    <div className="flex items-center gap-2 text-red-500 text-sm mb-6 font-medium">
                       <Clock className="h-4 w-4" />
                       <span>¡La oferta termina en 5 horas!</span>
                    </div>

                    <div className="flex flex-col gap-3 mb-6">
                       <button 
                          onClick={handleAddToCart}
                          className="w-full py-3.5 bg-amber-500 text-white font-bold text-base rounded-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                       >
                          <ShoppingCart className="h-5 w-5" /> Añadir al cesta
                       </button>
                       <button 
                          onClick={handleBuyNow}
                          className="w-full py-3.5 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold text-base rounded-lg hover:bg-slate-50 dark:hover:bg-white/20 transition-colors"
                       >
                          Comprar ahora
                       </button>
                    </div>

                    <div className="text-center text-xs text-slate-500 mb-6">
                       Garantía de reembolso de 30 días
                    </div>

                    <div className="mb-6">
                       <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Este curso incluye:</h4>
                       <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                          <li className="flex items-center gap-3">
                             <Tv className="h-4 w-4 shrink-0" />
                             <span>{course.duration} de video bajo demanda</span>
                          </li>
                          <li className="flex items-center gap-3">
                             <FileText className="h-4 w-4 shrink-0" />
                             <span>5 artículos</span>
                          </li>
                          <li className="flex items-center gap-3">
                             <Download className="h-4 w-4 shrink-0" />
                             <span>20 recursos descargables</span>
                          </li>
                          <li className="flex items-center gap-3">
                             <Smartphone className="h-4 w-4 shrink-0" />
                             <span>Acceso en dispositivos móviles y TV</span>
                          </li>
                          <li className="flex items-center gap-3">
                             <Trophy className="h-4 w-4 shrink-0" />
                             <span>Certificado de finalización</span>
                          </li>
                       </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10 text-sm font-medium">
                       <button onClick={onShare} className="text-slate-900 dark:text-white hover:underline">Compartir</button>
                       <button className="text-slate-900 dark:text-white hover:underline">Regalar curso</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Subcomponent for Curriculum Accordion
const CurriculumSection: React.FC<{ section: any }> = ({ section }) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div className="border-b border-slate-200 dark:border-white/10 last:border-0">
         <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-left"
         >
            <div className="flex items-center gap-3 font-bold text-slate-900 dark:text-white">
               {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
               {section.title}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
               {section.lectures} clases • {section.duration}
            </div>
         </button>
         
         {isOpen && (
            <div className="bg-white dark:bg-[#030304]">
               {section.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 pl-11 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                     <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <PlayCircle className="h-4 w-4 text-slate-400" />
                        <span className={item.free ? 'text-blue-600 dark:text-blue-400' : ''}>
                           {item.title}
                        </span>
                     </div>
                     <div className="flex items-center gap-4 text-xs text-slate-500">
                        {item.free && <span className="text-blue-600 dark:text-blue-400 font-medium">Vista previa</span>}
                        <span>{item.time}</span>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
