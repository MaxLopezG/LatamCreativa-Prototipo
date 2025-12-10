
import React, { useState } from 'react';
import { Store, Filter, Box, Plus, Search, ShoppingBag, Tag, Compass, Library } from 'lucide-react';
import { ASSET_ITEMS } from '../data/content';
import { AssetCard } from '../components/cards/AssetCard';
import { Pagination } from '../components/common/Pagination';

interface AssetsViewProps {
    activeCategory: string;
    onAssetSelect?: (id: string) => void;
    onCreateClick?: () => void;
    onSave?: (id: string, image: string) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ activeCategory, onAssetSelect, onCreateClick, onSave }) => {
    const [viewMode, setViewMode] = useState<'explore' | 'library'>('explore');

    // Filter logic
    const filteredAssets = activeCategory === 'Home'
        ? ASSET_ITEMS
        : ASSET_ITEMS.filter(a => a.category === activeCategory || activeCategory.includes(a.category));

    // Mock Purchased Assets
    const purchasedAssets = ASSET_ITEMS.slice(0, 4);

    const displayAssets = viewMode === 'explore'
        ? (filteredAssets.length > 0 ? filteredAssets : ASSET_ITEMS)
        : purchasedAssets;

    return (
        <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-0 pb-16 transition-colors animate-fade-in bg-[#0f0f12] min-h-screen">

            {/* Cinematic Hero Banner - Full Width */}
            <div className="relative -mx-6 md:-mx-10 2xl:-mx-16 h-[500px] flex items-center justify-center overflow-hidden mb-12">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1614726365723-49cfae96c69e?q=80&w=2000&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 animate-subtle-zoom"
                        alt="Market Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0f0f12]/80 to-[#0f0f12]"></div>

                    {/* Vibrant Glows - Emerald/Teal Theme */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
                </div>

                <div className="relative z-10 px-6 w-full max-w-5xl text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
                        <Store className="h-3 w-3" /> Marketplace Oficial
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                        Assets Premium para <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Tus Proyectos</span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                        Modelos 3D, texturas, scripts y plugins listos para producción. Ahorra tiempo y eleva la calidad de tu trabajo.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar modelos, texturas, scripts..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-emerald-500/50 transition-all backdrop-blur-xl shadow-2xl"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <button className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation & Toolbar */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-2 md:gap-6 bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-white/10 w-fit">
                    <button
                        onClick={() => setViewMode('explore')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'explore'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Compass className="h-4 w-4" /> Explorar
                    </button>
                    <button
                        onClick={() => setViewMode('library')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'library'
                                ? 'bg-emerald-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Library className="h-4 w-4" /> Mis Assets
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={onCreateClick}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all font-bold text-sm"
                    >
                        <Plus className="h-4 w-4" /> Vender Asset
                    </button>

                    {viewMode === 'explore' && (
                        <>
                            <div className="h-8 w-px bg-white/10 hidden md:block mx-2"></div>

                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                <Filter className="h-4 w-4" /> Filtros
                            </button>

                            <select className="bg-white/5 border border-white/10 text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer focus:bg-black/50 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                <option>Más populares</option>
                                <option>Recientes</option>
                                <option>Precio: Menor a Mayor</option>
                            </select>
                        </>
                    )}
                </div>
            </div>

            {/* Header Info */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {viewMode === 'explore' ? <Store className="h-6 w-6 text-emerald-500" /> : <ShoppingBag className="h-6 w-6 text-emerald-500" />}
                    {viewMode === 'explore'
                        ? (activeCategory === 'Home' ? 'Todos los Assets' : activeCategory)
                        : 'Biblioteca de Assets'}
                </h2>
                <p className="text-slate-400 mt-1 text-sm">
                    {viewMode === 'explore'
                        ? `${displayAssets.length} productos de alta calidad disponibles`
                        : `${displayAssets.length} items listos para descargar`
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-16">
                {displayAssets.map((asset) => (
                    <AssetCard
                        key={asset.id}
                        asset={asset}
                        onClick={() => onAssetSelect?.(asset.id)}
                        onSave={onSave}
                    />
                ))}
                {displayAssets.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="flex flex-col items-center">
                            <ShoppingBag className="h-16 w-16 mb-4 text-emerald-900/50" />
                            <p className="text-lg text-slate-400 mb-2">
                                {viewMode === 'library' ? 'No has adquirido ningún asset aún.' : 'No se encontraron assets.'}
                            </p>
                            {viewMode === 'library' && (
                                <button onClick={() => setViewMode('explore')} className="mt-2 text-emerald-400 hover:text-emerald-300 font-bold">
                                    Explorar tienda
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {displayAssets.length > 0 && <Pagination currentPage={1} onPageChange={() => { }} />}
        </div>
    );
};
