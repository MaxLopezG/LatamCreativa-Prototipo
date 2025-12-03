
import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Box, Video, Briefcase, Eye, MoreHorizontal, TrendingUp, Calendar } from 'lucide-react';

interface SaleItem {
  id: string;
  title: string;
  image: string;
  dateCreated: string;
  price: number;
  salesCount: number;
  totalRevenue: number;
  status: 'Active' | 'Paused' | 'Draft';
  rating: number;
}

// Mock Data Generator
const generateItems = (type: string): SaleItem[] => {
  const items: SaleItem[] = [];
  const count = 8;
  
  const titles = {
    asset: ['Cyberpunk City Pack', 'Forest Vegetation', 'Sci-Fi Weapons', 'Medieval Castle Kit', 'Space Station Props', 'Realistic Materials Vol.1', 'Vehicle Rigging System', 'Character Base Meshes'],
    course: ['Master en Blender 4.0', 'Introducción a ZBrush', 'Unreal Engine 5 Blueprints', 'Concept Art Fundamentals', 'Rigging Avanzado', 'Iluminación Cinemática', 'Texturizado en Substance', 'Animación de Personajes'],
    freelance: ['Modelado de Personajes 3D', 'Rigging para Videojuegos', 'Consultoría de Optimización', 'Creación de Props', 'Retopología Profesional', 'Diseño de Niveles', 'Animación Facial', 'Renderizado de Producto']
  };

  const images = {
    asset: 'https://images.unsplash.com/photo-1614726365723-49cfae96c69e?q=80&w=200&fit=crop',
    course: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&fit=crop',
    freelance: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=200&fit=crop'
  };

  const currentTitles = titles[type as keyof typeof titles] || titles.asset;
  const currentImage = images[type as keyof typeof images] || images.asset;

  for (let i = 0; i < count; i++) {
    const price = Math.floor(Math.random() * 100) + 10;
    const sales = Math.floor(Math.random() * 500);
    items.push({
      id: `s-${i}`,
      title: currentTitles[i] || `Product ${i}`,
      image: currentImage,
      dateCreated: '12 Oct, 2023',
      price: price,
      salesCount: sales,
      totalRevenue: price * sales,
      status: i % 4 === 0 ? 'Paused' : 'Active',
      rating: 4.5 + (Math.random() * 0.5)
    });
  }
  return items;
};

interface SalesListViewProps {
  type: string;
  onBack: () => void;
}

export const SalesListView: React.FC<SalesListViewProps> = ({ type, onBack }) => {
  // Ensure items are only generated once per type via lazy initialization
  const [items] = useState(() => generateItems(type || 'asset'));

  const getTitle = () => {
    switch (type) {
      case 'asset': return 'Ventas del Marketplace';
      case 'course': return 'Ventas de Cursos';
      case 'freelance': return 'Servicios Freelance';
      default: return 'Mis Ventas';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'asset': return Box;
      case 'course': return Video;
      case 'freelance': return Briefcase;
      default: return Box;
    }
  };

  const Icon = getIcon();

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Ganancias
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                        <Icon className="h-8 w-8" />
                    </div>
                    {getTitle()}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Gestiona tus productos activos y revisa su rendimiento.
                </p>
            </div>

            <div className="flex gap-4">
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl flex flex-col items-end">
                    <span className="text-xs text-slate-500 font-bold uppercase">Total Productos</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{items.length}</span>
                </div>
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl flex flex-col items-end">
                    <span className="text-xs text-slate-500 font-bold uppercase">Ingresos Totales</span>
                    <span className="text-xl font-bold text-emerald-500">${items.reduce((a, b) => a + b.totalRevenue, 0).toLocaleString()}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input 
                  type="text" 
                  placeholder="Buscar por nombre..." 
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-amber-500 rounded-xl py-2 pl-10 pr-4 text-sm outline-none transition-all"
              />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-medium">
                 <Filter className="h-4 w-4" /> Estado
             </button>
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity">
                 <TrendingUp className="h-4 w-4" /> Analíticas
             </button>
          </div>
      </div>

      {/* Table List */}
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-bold uppercase text-xs">
                      <tr>
                          <th className="px-6 py-4">Producto / Servicio</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4">Precio</th>
                          <th className="px-6 py-4">Ventas</th>
                          <th className="px-6 py-4 text-right">Ingresos</th>
                          <th className="px-6 py-4"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      {items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                          <div className="font-bold text-slate-900 dark:text-white text-base mb-0.5">{item.title}</div>
                                          <div className="flex items-center gap-2 text-xs text-slate-500">
                                              <Calendar className="h-3 w-3" />
                                              <span>Creado: {item.dateCreated}</span>
                                          </div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                      item.status === 'Active' 
                                      ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                                      : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                                  }`}>
                                      {item.status === 'Active' ? 'Activo' : 'Pausado'}
                                  </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                                  ${item.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                      <TrendingUp className="h-4 w-4 text-slate-400" />
                                      <span>{item.salesCount}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <span className="font-bold text-slate-900 dark:text-white text-base">
                                      ${item.totalRevenue.toLocaleString()}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" title="Ver detalles">
                                          <Eye className="h-4 w-4" />
                                      </button>
                                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                          <MoreHorizontal className="h-4 w-4" />
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          <div className="p-4 border-t border-slate-200 dark:border-white/10 text-center bg-slate-50 dark:bg-white/5">
              <span className="text-xs text-slate-500">Mostrando {items.length} resultados</span>
          </div>
      </div>

    </div>
  );
};
