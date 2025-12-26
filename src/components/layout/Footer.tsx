
import React from 'react';
import { Sparkles, Twitter, Instagram, Linkedin, Youtube, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#050506] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-10 mb-12 md:mb-16">

          {/* Brand Column - Full width on mobile */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 mb-4 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/20">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Latam<span className="text-amber-500">.</span>Creativa</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-sm">
              La plataforma definitiva para artistas digitales en Latinoamérica.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Links Columns - 2 columns on mobile */}
          <div>
            <h4 className="text-white font-bold mb-3 md:mb-6 text-sm">Plataforma</h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-slate-400">
              <li><button onClick={(e) => handleNav('portfolio', e)} className="hover:text-amber-500 transition-colors text-left">Portafolio</button></li>
              <li><button onClick={(e) => handleNav('blog', e)} className="hover:text-amber-500 transition-colors text-left">Blog</button></li>
              <li><button onClick={(e) => handleNav('jobs', e)} className="hover:text-amber-500 transition-colors text-left">Empleos</button></li>
              <li><button onClick={(e) => handleNav('forum', e)} className="hover:text-amber-500 transition-colors text-left">Foro</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 md:mb-6 text-sm">Comunidad</h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-slate-400">
              <li><button onClick={(e) => handleNav('projects', e)} className="hover:text-amber-500 transition-colors text-left">Proyectos</button></li>
              <li><button onClick={(e) => handleNav('contests', e)} className="hover:text-amber-500 transition-colors text-left">Concursos</button></li>
              <li><button onClick={(e) => handleNav('info/help', e)} className="hover:text-amber-500 transition-colors text-left">Ayuda</button></li>
              <li><button onClick={(e) => handleNav('info/guides', e)} className="hover:text-amber-500 transition-colors text-left">Guías</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 md:mb-6 text-sm">Empresa</h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-slate-400">
              <li><button onClick={(e) => handleNav('about', e)} className="hover:text-amber-500 transition-colors text-left">Sobre Nosotros</button></li>
              <li><button onClick={(e) => handleNav('info/careers', e)} className="hover:text-amber-500 transition-colors text-left">Carreras</button></li>
              <li><button onClick={(e) => handleNav('info/contact', e)} className="hover:text-amber-500 transition-colors text-left">Contacto</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 md:mb-6 text-sm">Legal</h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-slate-400">
              <li><button onClick={(e) => handleNav('terms', e)} className="hover:text-amber-500 transition-colors text-left">Términos de Servicio</button></li>
              <li><button onClick={(e) => handleNav('privacy', e)} className="hover:text-amber-500 transition-colors text-left">Privacidad</button></li>
              <li><button onClick={(e) => handleNav('about', e)} className="hover:text-amber-500 transition-colors text-left">Sobre Nosotros</button></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2024 Latam Creativa. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Globe className="h-4 w-4" />
            <span>Español (Latinoamérica)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
