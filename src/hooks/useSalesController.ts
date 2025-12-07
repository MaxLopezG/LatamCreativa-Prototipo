
import { useState, useMemo, useCallback } from 'react';
import { SaleItem, SortConfig, SortDirection } from '../types';

// --- Mock Data Service (Simulating API) ---
const generateMockSales = (type: string): SaleItem[] => {
  const count = 45;
  const items: SaleItem[] = [];
  
  const titles = {
    asset: ['Cyberpunk City Pack', 'Forest Vegetation', 'Sci-Fi Weapons', 'Medieval Castle Kit', 'Space Station Props', 'Realistic Materials Vol.1'],
    course: ['Master en Blender 4.0', 'Introducción a ZBrush', 'Unreal Engine 5 Blueprints', 'Concept Art Fundamentals'],
    freelance: ['Modelado de Personajes 3D', 'Rigging para Videojuegos', 'Consultoría de Optimización', 'Creación de Props']
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

// --- Hook Implementation ---
export const useSalesController = (type: string, itemsPerPage: number = 8) => {
  const [items, setItems] = useState<SaleItem[]>(() => generateMockSales(type));
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Paused'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Sort Logic
  const processedData = useMemo(() => {
    let data = [...items];

    // Search
    if (searchQuery) {
      data = data.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter
    if (filterStatus !== 'All') {
      data = data.filter(item => item.status === filterStatus);
    }

    // Sort
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

  // Pagination Logic
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Actions
  const handleSort = useCallback((key: keyof SaleItem) => {
    setSortConfig(current => {
      let direction: SortDirection = 'asc';
      if (current && current.key === key && current.direction === 'asc') {
        direction = 'desc';
      }
      return { key, direction };
    });
  }, []);

  const toggleItemStatus = useCallback((id: string) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'Active' ? 'Paused' : 'Active' };
      }
      return item;
    }));
  }, []);

  const deleteItem = useCallback((id: string) => {
      // In real app: call API
      setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const setPage = useCallback((page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Stats
  const stats = useMemo(() => ({
      totalProducts: items.length,
      totalRevenue: items.reduce((acc, curr) => acc + curr.totalRevenue, 0),
      activeCount: items.filter(i => i.status === 'Active').length
  }), [items]);

  return {
    state: {
      items: paginatedData,
      filterStatus,
      searchQuery,
      sortConfig,
      currentPage,
      totalPages,
      stats,
      totalCount: processedData.length
    },
    actions: {
      setFilterStatus,
      setSearchQuery,
      handleSort,
      toggleItemStatus,
      deleteItem,
      setPage
    }
  };
};
