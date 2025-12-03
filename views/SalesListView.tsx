
import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, Box, Video, Briefcase, Eye, 
  MoreHorizontal, TrendingUp, Calendar, ArrowUp, ArrowDown, 
  Pause, Play, Edit, Trash2, CheckCircle2 
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { useSalesController } from '../hooks/useSalesController';
import { SaleItem, SortConfig } from '../types';

interface SalesListViewProps {
  type: string;
  onBack: () => void;
}

// --- ATOMIC SUB-COMPONENTS ---

const SalesKPIs = ({ totalProducts, totalRevenue }: { totalProducts: number, totalRevenue: number }) => (
  <div className="flex gap-4">
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl flex flex-col items-end">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Productos</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{totalProducts}</span>
      </div>
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl flex flex-col items-end">
          <span className="text-xs text-slate-500 font-bold uppercase">Ingresos Totales</span>
          <span className="text-xl font-bold text-emerald-500">${totalRevenue.toLocaleString()}</span>
      </div>
  </div>
);

const SortableHeader = ({ 
    label, 
    sortKey, 
    currentSort, 
    onSort,
    align = 'left'
}: { 
    label: string, 
    sortKey: keyof SaleItem, 
    currentSort: SortConfig | null, 
    onSort: (k: keyof SaleItem) => void,
    align?: 'left' | 'right'
}) => (
    <th 
      className={`px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${align === 'right' ? 'text-right' : ''}`}
      onClick={() => onSort(sortKey)}
    >
        <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : ''}`}>
            {label}
            {currentSort?.key === sortKey && (
                currentSort.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-amber-500" /> : <ArrowDown className="h-3 w-3 text-amber-500" />
            )}
        </div>
    </th>
);

interface SalesTableRowProps { 
    item: SaleItem; 
    onToggleStatus: (id: string) => void; 
    onDelete: (id: string) => void; 
}

const SalesTableRow: React.FC<SalesTableRowProps> = ({ item, onToggleStatus, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu on click outside could be handled globally, keeping it simple here
    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group relative">
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
                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                  className={`p-2 rounded-lg transition-colors ${isMenuOpen ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    <MoreHorizontal className="h-5 w-5" />
                </button>

                {isMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                        <div className="absolute right-12 top-10 w-48 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in origin-top-right">
                            <button className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Eye className="h-4 w-4" /> Ver Detalle
                            </button>
                            <button className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Edit className="h-4 w-4" /> Editar
                            </button>
                            <button 
                              onClick={() => { onToggleStatus(item.id); setIsMenuOpen(false); }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 text-slate-600 dark:text-slate-300"
                            >
                                {item.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                {item.status === 'Active' ? 'Pausar' : 'Activar'}
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-white/5 my-1"></div>
                            <button 
                                onClick={() => { onDelete(item.id); setIsMenuOpen(false); }}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-500"
                            >
                                <Trash2 className="h-4 w-4" /> Eliminar
                            </button>
                        </div>
                    </>
                )}
            </td>
        </tr>
    );
};

// --- MAIN VIEW COMPONENT ---

export const SalesListView: React.FC<SalesListViewProps> = ({ type, onBack }) => {
  const { state, actions } = useSalesController(type);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

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
            <SalesKPIs totalProducts={state.stats.totalProducts} totalRevenue={state.stats.totalRevenue} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/10 relative z-20">
          <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input 
                  type="text" 
                  value={state.searchQuery}
                  onChange={(e) => actions.setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre..." 
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-amber-500 rounded-xl py-2 pl-10 pr-4 text-sm outline-none transition-all"
              />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto items-center">
             <div className="relative">
                 <button 
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors text-sm font-medium ${
                        state.filterStatus !== 'All' 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                 >
                     <Filter className="h-4 w-4" /> 
                     {state.filterStatus === 'All' ? 'Todos los estados' : state.filterStatus === 'Active' ? 'Activos' : 'Pausados'}
                 </button>
                 
                 {isFilterMenuOpen && (
                     <>
                        <div className="fixed inset-0 z-20" onClick={() => setIsFilterMenuOpen(false)}></div>
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1A1A1C] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-30 animate-fade-in">
                            {(['All', 'Active', 'Paused'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => { actions.setFilterStatus(status); setIsFilterMenuOpen(false); }}
                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex justify-between items-center ${state.filterStatus === status ? 'text-amber-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                                >
                                    {status === 'All' ? 'Todos' : status === 'Active' ? 'Activos' : 'Pausados'}
                                    {state.filterStatus === status && <CheckCircle2 className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                     </>
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
                          <SortableHeader label="Precio" sortKey="price" currentSort={state.sortConfig} onSort={actions.handleSort} />
                          <SortableHeader label="Ventas" sortKey="salesCount" currentSort={state.sortConfig} onSort={actions.handleSort} />
                          <SortableHeader label="Ingresos" sortKey="totalRevenue" currentSort={state.sortConfig} onSort={actions.handleSort} align="right" />
                          <th className="px-6 py-4"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5 relative">
                      {state.items.map((item) => (
                          <SalesTableRow 
                            key={item.id} 
                            item={item} 
                            onToggleStatus={actions.toggleItemStatus} 
                            onDelete={actions.deleteItem}
                          />
                      ))}
                  </tbody>
              </table>
              
              {state.items.length === 0 && (
                  <div className="py-20 text-center text-slate-500 dark:text-slate-400">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-lg font-medium">No se encontraron productos</p>
                      <p className="text-sm">Intenta ajustar los filtros o tu búsqueda.</p>
                  </div>
              )}
          </div>
          
          {state.items.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 mt-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                          Mostrando {state.items.length} de {state.totalCount}
                      </span>
                      <Pagination 
                        currentPage={state.currentPage} 
                        totalPages={state.totalPages}
                        onPageChange={actions.setPage} 
                      />
                  </div>
              </div>
          )}
      </div>

    </div>
  );
};
