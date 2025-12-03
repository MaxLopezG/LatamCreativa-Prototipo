
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Search, Filter, Box, Video, Briefcase, Eye, 
  MoreHorizontal, TrendingUp, Calendar, ArrowUp, ArrowDown, 
  Pause, Play, Edit, Trash2, CheckCircle2 
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';

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

type SortConfig = {
  key: keyof SaleItem;
  direction: 'asc' | 'desc';
} | null;

type FilterStatus = 'All' | 'Active' | 'Paused';

// Mock Data Generator
const generateItems = (type: string): SaleItem[] => {
  const items: SaleItem[] = [];
  const count = 45; // Increased count to demonstrate pagination
  
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
      title: currentTitles[i % currentTitles.length] || `Product ${i}`,
      image: currentImage,
      dateCreated: '12 Oct, 2023',
      price: price,
      salesCount: sales,
      totalRevenue: price * sales,
      status: i % 5 === 0 ? 'Paused' : 'Active',
      rating: 4.5 + (Math.random() * 0.5)
    });
  }
  return items;
};

interface SalesListViewProps {
  type: string;
  onBack: () => void;
}

const ITEMS_PER_PAGE = 8;

export const SalesListView: React.FC<SalesListViewProps> = ({ type, onBack }) => {
  // Data State
  const [items, setItems] = useState<SaleItem[]>(() => generateItems(type || 'asset'));
  
  // Filter & Sort State
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  
  // Pagination & Action State
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = () => {
      setActionMenuOpenId(null);
      setIsFilterMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  // --- Logic ---

  // 1. Filtering & Sorting
  const processedData = useMemo(() => {
    let data = [...items];

    // Filter by Search
    if (searchQuery) {
      data = data.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Status
    if (filterStatus !== 'All') {
      data = data.filter(item => item.status === filterStatus);
    }

    // Sorting
    if (sortConfig !== null) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [items, searchQuery, filterStatus, sortConfig]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // --- Handlers ---

  const handleSort = (key: keyof SaleItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleStatusToggle = (id: string) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'Active' ? 'Paused' : 'Active' };
      }
      return item;
    }));
    setActionMenuOpenId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in min-h-screen flex flex-col">
      
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/10 relative z-20">
          <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre..." 
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-amber-500 rounded-xl py-2 pl-10 pr-4 text-sm outline-none transition-all"
              />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto items-center">
             
             {/* Filter Dropdown */}
             <div className="relative">
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFilterMenuOpen(!isFilterMenuOpen);
                        setActionMenuOpenId(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors text-sm font-medium ${
                        filterStatus !== 'All' 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                 >
                     <Filter className="h-4 w-4" /> 
                     {filterStatus === 'All' ? 'Todos los estados' : filterStatus === 'Active' ? 'Activos' : 'Pausados'}
                 </button>
                 
                 {isFilterMenuOpen && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-30 animate-fade-in">
                         {['All', 'Active', 'Paused'].map((status) => (
                             <button
                                key={status}
                                onClick={() => setFilterStatus(status as FilterStatus)}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex justify-between items-center ${filterStatus === status ? 'text-amber-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                             >
                                 {status === 'All' ? 'Todos' : status === 'Active' ? 'Activos' : 'Pausados'}
                                 {filterStatus === status && <CheckCircle2 className="h-4 w-4" />}
                             </button>
                         ))}
                     </div>
                 )}
             </div>

             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity">
                 <TrendingUp className="h-4 w-4" /> Analíticas
             </button>
          </div>
      </div>

      {/* Table List */}
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl overflow-visible shadow-sm flex-1 flex flex-col">
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-bold uppercase text-xs">
                      <tr>
                          <th className="px-6 py-4">Producto / Servicio</th>
                          <th className="px-6 py-4">Estado</th>
                          
                          <th 
                            className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            onClick={() => handleSort('price')}
                          >
                              <div className="flex items-center gap-1">
                                  Precio
                                  {sortConfig?.key === 'price' && (
                                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-amber-500" /> : <ArrowDown className="h-3 w-3 text-amber-500" />
                                  )}
                              </div>
                          </th>
                          
                          <th 
                            className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            onClick={() => handleSort('salesCount')}
                          >
                              <div className="flex items-center gap-1">
                                  Ventas
                                  {sortConfig?.key === 'salesCount' && (
                                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-amber-500" /> : <ArrowDown className="h-3 w-3 text-amber-500" />
                                  )}
                              </div>
                          </th>
                          
                          <th 
                            className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            onClick={() => handleSort('totalRevenue')}
                          >
                              <div className="flex items-center justify-end gap-1">
                                  Ingresos
                                  {sortConfig?.key === 'totalRevenue' && (
                                      sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-amber-500" /> : <ArrowDown className="h-3 w-3 text-amber-500" />
                                  )}
                              </div>
                          </th>
                          <th className="px-6 py-4"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5 relative">
                      {paginatedData.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group relative">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                          <div className="font-bold text-slate-900 dark:text-white text-base mb-0.5 line-clamp-1 max-w-[200px]">{item.title}</div>
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
                              <td className="px-6 py-4 text-right relative">
                                  <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActionMenuOpenId(actionMenuOpenId === item.id ? null : item.id);
                                        setIsFilterMenuOpen(false);
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${actionMenuOpenId === item.id ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
                                  >
                                      <MoreHorizontal className="h-5 w-5" />
                                  </button>

                                  {/* Row Dropdown */}
                                  {actionMenuOpenId === item.id && (
                                      <div className="absolute right-12 top-10 w-48 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in origin-top-right">
                                          <button className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                              <Eye className="h-4 w-4" /> Ver Detalle
                                          </button>
                                          <button className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                              <Edit className="h-4 w-4" /> Editar
                                          </button>
                                          <button 
                                            onClick={() => handleStatusToggle(item.id)}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 text-slate-600 dark:text-slate-300"
                                          >
                                              {item.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                              {item.status === 'Active' ? 'Pausar' : 'Activar'}
                                          </button>
                                          <div className="h-px bg-slate-100 dark:bg-white/5 my-1"></div>
                                          <button className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-500">
                                              <Trash2 className="h-4 w-4" /> Eliminar
                                          </button>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              
              {paginatedData.length === 0 && (
                  <div className="py-20 text-center text-slate-500 dark:text-slate-400">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-lg font-medium">No se encontraron productos</p>
                      <p className="text-sm">Intenta ajustar los filtros o tu búsqueda.</p>
                  </div>
              )}
          </div>
          
          {paginatedData.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 mt-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                          Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, processedData.length)} de {processedData.length}
                      </span>
                      <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages}
                        onPageChange={handlePageChange} 
                      />
                  </div>
              </div>
          )}
      </div>

    </div>
  );
};
