
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, GraduationCap, Store, Newspaper, Users, ArrowRight, Zap, Globe, Shield, Briefcase, Quote } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

export const MainLandingView: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 'portfolio',
      title: 'Portafolio',
      desc: 'Muestra tu trabajo al mundo e inspírate.',
      icon: ImageIcon,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      border: 'hover:border-pink-500/50'
    },
    {
      id: 'education',
      title: 'Educación',
      desc: 'Aprende nuevas habilidades con cursos expertos.',
      icon: GraduationCap,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/50'
    },
    {
      id: 'market',
      title: 'Mercado',
      desc: 'Compra y vende assets de alta calidad.',
      icon: Store,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/50'
    },
    {
      id: 'freelance',
      title: 'Freelance',
      desc: 'Contrata expertos o vende tus servicios.',
      icon: Briefcase,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      border: 'hover:border-cyan-500/50'
    },
    {
      id: 'community',
      title: 'Proyectos',
      desc: 'Encuentra equipo y colabora en proyectos.',
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/50'
    },
    {
      id: 'blog',
      title: 'Blog',
      desc: 'Noticias, tutoriales y artículos de la industria.',
      icon: Newspaper,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'hover:border-amber-500/50'
    }
  ];

  return (
    <div className="animate-fade-in">
      
      <div className="max-w-[1600px] mx-auto pb-20 px-4 md:px-6">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0C] border border-white/10 mt-6 min-h-[500px] flex items-center shadow-2xl">
          
          {/* Mobile Background Image (Subtle) */}
          <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 lg:hidden"
              alt="Background"
          />

          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>
          
          <div className="relative z-10 px-6 md:px-16 w-full max-w-4xl py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
              <Zap className="h-3 w-3 text-amber-500" /> La Plataforma #1 para Artistas
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              El ecosistema definitivo para <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Creativos Digitales</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed drop-shadow-md">
              Conecta, aprende, vende y colabora en un solo lugar. Latam Creativa unifica todas las herramientas que necesitas para impulsar tu carrera artística.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                  onClick={() => navigate('/portfolio')}
                  className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/10 w-full md:w-auto"
              >
                  Explorar Portafolios
              </button>
              <button 
                  onClick={() => navigate('/community')}
                  className="px-8 py-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-md w-full md:w-auto"
              >
                  Unirse a la Comunidad
              </button>
            </div>
          </div>

          {/* Decorative Grid/Image on Right (Hidden on mobile) */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block mask-linear-fade pointer-events-none">
              <div className="grid grid-cols-2 gap-4 opacity-40 transform rotate-12 scale-125 translate-x-20 -translate-y-20">
                  {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 shadow-xl">
                          <img src={`https://images.unsplash.com/photo-${1550000000000 + i * 100000}-a83a8bd57fbe?q=80&w=400&fit=crop`} className="w-full h-full object-cover" alt="" />
                      </div>
                  ))}
              </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-10 py-12 border-b border-slate-200 dark:border-white/5">
            <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">50k+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Artistas Activos</div>
            </div>
            <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">1200+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Cursos Online</div>
            </div>
            <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">$2M+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Pagado a Creadores</div>
            </div>
            <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">25+</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Países</div>
            </div>
        </div>

        {/* Services Grid */}
        <div className="py-16">
          <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Todo lo que necesitas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service) => (
                  <div 
                      key={service.id}
                      onClick={() => navigate(`/${service.id}`)}
                      className={`group relative p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 ${service.border}`}
                  >
                      <div className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                          <service.icon className={`h-7 w-7 ${service.color}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors">
                          {service.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                          {service.desc}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white group-hover:gap-4 transition-all">
                          Explorar <ArrowRight className="h-4 w-4" />
                      </div>
                  </div>
              ))}
              
              {/* Pro Card */}
              <div 
                  onClick={() => navigate('/pro')}
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/30"
              >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                      <Globe className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                      Hazte PRO
                  </h3>
                  <p className="text-amber-100 mb-8 leading-relaxed">
                      Sube de nivel con descargas ilimitadas, 0% de comisión y acceso a contenido exclusivo.
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
                      Ver Planes <ArrowRight className="h-4 w-4" />
                  </div>
              </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-10 mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Lo que dicen los artistas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { text: "Latam Creativa ha cambiado mi carrera. Conseguí mi primer trabajo en un estudio AAA gracias a la sección de empleos.", author: "Sofía Martínez", role: "3D Artist @ Ubisoft" },
                    { text: "La calidad de los cursos es increíble. He aprendido más aquí en un mes que en dos años de universidad.", author: "Juan Pérez", role: "Indie Dev" },
                    { text: "Vender mis assets aquí es mucho más rentable que en otras tiendas. La comunidad es súper solidaria.", author: "Diego López", role: "Texture Artist" }
                ].map((testimonio, i) => (
                    <div key={i} className="bg-slate-100 dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/5 relative">
                        <Quote className="h-8 w-8 text-amber-500 mb-4 opacity-50" />
                        <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">"{testimonio.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${testimonio.author}&background=random`} alt="" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm">{testimonio.author}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{testimonio.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Trust/Footer Section */}
        <div className="pb-10">
            <div className="rounded-3xl bg-slate-100 dark:bg-white/5 p-8 md:p-12 text-center">
                <Shield className="h-12 w-12 text-slate-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Construido para la comunidad</h2>
                <p className="text-slate-500 max-w-xl mx-auto mb-8">
                    Latam Creativa es un proyecto dedicado a potenciar el talento en Latinoamérica. Sin algoritmos ocultos, solo arte puro.
                </p>
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <span className="font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400">UNREAL ENGINE</span>
                    <span className="font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400">BLENDER</span>
                    <span className="font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400">UNITY</span>
                    <span className="font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400">ADOBE</span>
                </div>
            </div>
        </div>

      </div>
      
      <Footer />
    </div>
  );
};
