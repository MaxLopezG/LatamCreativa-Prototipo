
import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, 
  Download, Calendar, ArrowUpRight, ArrowDownLeft, MoreHorizontal, 
  PieChart, Activity, ArrowLeft, Filter, CheckCircle2, Box, Briefcase, Video,
  Trophy, Star
} from 'lucide-react';

interface EarningsViewProps {
  onBack?: () => void;
  onNavigate?: (path: string) => void;
}

// Mock Data for Transactions
const TRANSACTIONS = [
  { id: 't1', title: 'Cyberpunk Asset Pack Vol. 2', type: 'asset', date: '29 Oct, 2024', amount: 45.00, status: 'completed', buyer: 'Studio X' },
  { id: 't2', title: 'Curso Blender Avanzado', type: 'course', date: '28 Oct, 2024', amount: 24.99, status: 'completed', buyer: 'Juan P.' },
  { id: 't3', title: 'Modelado Personaje RPG', type: 'freelance', date: '28 Oct, 2024', amount: 350.00, status: 'pending', buyer: 'IndieGames LLC' },
  { id: 't4', title: 'Retiro a PayPal', type: 'withdrawal', date: '25 Oct, 2024', amount: -1200.00, status: 'completed', buyer: 'Latam Creativa' },
  { id: 't5', title: 'Sci-Fi Texture Pack', type: 'asset', date: '24 Oct, 2024', amount: 12.50, status: 'completed', buyer: 'Maria L.' },
  { id: 't6', title: 'Consultoría VFX', type: 'freelance', date: '23 Oct, 2024', amount: 150.00, status: 'completed', buyer: 'TechCorp' },
];

// Mock Data for Chart (Line)
const MONTHLY_DATA = [
  { month: 'May', market: 450, freelance: 300, course: 100 },
  { month: 'Jun', market: 550, freelance: 400, course: 250 },
  { month: 'Jul', market: 400, freelance: 200, course: 350 },
  { month: 'Ago', market: 800, freelance: 500, course: 300 },
  { month: 'Sep', market: 650, freelance: 450, course: 350 },
  { month: 'Oct', market: 900, freelance: 800, course: 400 },
];

// Calculate totals and max for scaling
const CHART_DATA = MONTHLY_DATA.map(d => ({
  ...d,
  total: d.market + d.freelance + d.course
}));
const MAX_REVENUE = Math.max(...CHART_DATA.map(d => d.total)) * 1.2; // 20% padding

// Mock Data for Top Products
const TOP_ITEMS = [
  { id: 1, title: 'Curso Blender: Personajes', type: 'course', sales: 142, revenue: 3540, image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=200&fit=crop' },
  { id: 2, title: 'Cyberpunk City Assets', type: 'asset', sales: 320, revenue: 2800, image: 'https://images.unsplash.com/photo-1614726365723-49cfae96c69e?q=80&w=200&fit=crop' },
  { id: 3, title: 'Rigging Service Standard', type: 'freelance', sales: 15, revenue: 1500, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&fit=crop' },
  { id: 4, title: 'Ultimate Texture Pack', type: 'asset', sales: 89, revenue: 890, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&fit=crop' },
  { id: 5, title: 'Unreal Engine Masterclass', type: 'course', sales: 24, revenue: 720, image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=200&fit=crop' },
];

export const EarningsView: React.FC<EarningsViewProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'withdrawals'>('all');
  const [topItemsFilter, setTopItemsFilter] = useState<'all' | 'course' | 'asset' | 'freelance'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredTopItems = topItemsFilter === 'all' 
    ? TOP_ITEMS 
    : TOP_ITEMS.filter(item => item.type === topItemsFilter);

  // Filter transactions based on active tab
  const filteredTransactions = activeTab === 'all' 
    ? TRANSACTIONS 
    : activeTab === 'withdrawals' 
      ? TRANSACTIONS.filter(t => t.type === 'withdrawal') 
      : TRANSACTIONS.filter(t => t.type !== 'withdrawal');

  // Chart Generation Helpers
  const SVG_HEIGHT = 300;
  const SVG_WIDTH = 1000;
  const X_STEP = SVG_WIDTH / (CHART_DATA.length - 1);

  const getPoints = (key: 'market' | 'freelance' | 'course') => {
    return CHART_DATA.map((d, i) => {
      const x = i * X_STEP;
      const y = SVG_HEIGHT - (d[key] / MAX_REVENUE) * SVG_HEIGHT;
      return `${x},${y}`;
    }).join(' ');
  };

  const marketPoints = getPoints('market');
  const freelancePoints = getPoints('freelance');
  const coursePoints = getPoints('course');

  return (
    <div className="w-full max-w-[2560px] mx-auto px-6 md:px-10 2xl:px-16 pt-8 pb-16 transition-colors animate-fade-in">
      
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                Panel de Ingresos
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestiona tus ganancias y retiros</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>Oct 2024</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-colors">
                <Wallet className="h-4 w-4" /> Retirar dinero
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
                <Download className="h-4 w-4" /> Exportar Reporte
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Total Earnings */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                      <DollarSign className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                      <TrendingUp className="h-3 w-3" /> +15.3%
                  </div>
              </div>
              <div className="relative z-10">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ingresos Totales</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">$12,450.00</h3>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          </div>

          {/* Card 2: Available Balance */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/10 rounded-xl text-white backdrop-blur-md">
                      <Wallet className="h-6 w-6" />
                  </div>
                  <button className="text-xs font-bold bg-amber-500 text-black px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20">
                      Retirar
                  </button>
              </div>
              <div className="relative z-10">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Disponible para Retiro</p>
                  <h3 className="text-3xl font-bold">$1,458.50</h3>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          </div>

          {/* Card 3: Pending Clearance */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                      <Activity className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                      En proceso
                  </div>
              </div>
              <div className="relative z-10">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pendiente de Liberación</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">$350.00</h3>
              </div>
          </div>

          {/* Card 4: Monthly Sales Count */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                      <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">
                      <TrendingUp className="h-3 w-3" /> +8
                  </div>
              </div>
              <div className="relative z-10">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ventas este mes</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">42</h3>
              </div>
          </div>

      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Main Chart (Line Chart) */}
          <div className="lg:col-span-2 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Rendimiento Mensual</h3>
                  
                  <div className="flex items-center gap-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Market
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div> Freelance
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Cursos
                      </div>
                  </div>

                  <select className="bg-slate-100 dark:bg-white/5 border-none text-xs font-bold rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-300 outline-none cursor-pointer">
                      <option>Últimos 6 meses</option>
                      <option>Este año</option>
                  </select>
              </div>
              
              <div className="flex-1 relative min-h-[300px] w-full">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400 pointer-events-none pb-6">
                      <div className="border-b border-dashed border-slate-200 dark:border-white/5 w-full h-0"></div>
                      <div className="border-b border-dashed border-slate-200 dark:border-white/5 w-full h-0"></div>
                      <div className="border-b border-dashed border-slate-200 dark:border-white/5 w-full h-0"></div>
                      <div className="border-b border-dashed border-slate-200 dark:border-white/5 w-full h-0"></div>
                      <div className="border-b border-slate-200 dark:border-white/10 w-full h-0"></div>
                  </div>

                  {/* SVG Chart */}
                  <svg 
                    className="absolute inset-0 w-full h-full overflow-visible pb-6" 
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
                    preserveAspectRatio="none"
                  >
                      {/* Lines */}
                      <polyline 
                        fill="none" 
                        stroke="#F43F5E" 
                        strokeWidth="4" 
                        points={marketPoints} 
                        vectorEffect="non-scaling-stroke"
                        className="drop-shadow-md"
                      />
                      <polyline 
                        fill="none" 
                        stroke="#06B6D4" 
                        strokeWidth="4" 
                        points={freelancePoints} 
                        vectorEffect="non-scaling-stroke"
                        className="drop-shadow-md"
                      />
                      <polyline 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="4" 
                        points={coursePoints} 
                        vectorEffect="non-scaling-stroke"
                        className="drop-shadow-md"
                      />

                      {/* Interactive Dots / Overlay */}
                      {CHART_DATA.map((d, i) => {
                          const x = i * X_STEP;
                          const yMarket = SVG_HEIGHT - (d.market / MAX_REVENUE) * SVG_HEIGHT;
                          const yFreelance = SVG_HEIGHT - (d.freelance / MAX_REVENUE) * SVG_HEIGHT;
                          const yCourse = SVG_HEIGHT - (d.course / MAX_REVENUE) * SVG_HEIGHT;
                          const isHovered = hoveredIndex === i;

                          return (
                              <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} className="cursor-pointer">
                                  {/* Hit Area Rect */}
                                  <rect x={x - (X_STEP/2)} y="0" width={X_STEP} height={SVG_HEIGHT} fill="transparent" />
                                  
                                  {/* Vertical Guide Line */}
                                  <line 
                                    x1={x} y1="0" x2={x} y2={SVG_HEIGHT} 
                                    stroke="currentColor" 
                                    strokeWidth="1" 
                                    strokeDasharray="4 4"
                                    className={`text-slate-300 dark:text-white/20 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
                                    vectorEffect="non-scaling-stroke"
                                  />

                                  {/* Dots */}
                                  <circle cx={x} cy={yMarket} r="6" fill="#F43F5E" stroke="white" strokeWidth="2" className={`transition-all duration-200 ${isHovered ? 'r-8' : ''}`} />
                                  <circle cx={x} cy={yFreelance} r="6" fill="#06B6D4" stroke="white" strokeWidth="2" className={`transition-all duration-200 ${isHovered ? 'r-8' : ''}`} />
                                  <circle cx={x} cy={yCourse} r="6" fill="#10B981" stroke="white" strokeWidth="2" className={`transition-all duration-200 ${isHovered ? 'r-8' : ''}`} />
                              </g>
                          );
                      })}
                  </svg>

                  {/* Tooltip Overlay (HTML) */}
                  {hoveredIndex !== null && (
                      <div 
                        className="absolute top-0 pointer-events-none bg-slate-900/90 dark:bg-white/10 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-white/20 z-20 min-w-[140px] animate-fade-in"
                        style={{ left: `${(hoveredIndex * (100 / (CHART_DATA.length - 1)))}%`, transform: 'translate(-50%, -120%)' }}
                      >
                          <div className="font-bold text-sm mb-2 pb-2 border-b border-white/20 text-center">{CHART_DATA[hoveredIndex].month}</div>
                          <div className="flex justify-between items-center gap-4 text-xs mb-1">
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Market</span>
                              <span className="font-mono">${CHART_DATA[hoveredIndex].market}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4 text-xs mb-1">
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> Free</span>
                              <span className="font-mono">${CHART_DATA[hoveredIndex].freelance}</span>
                          </div>
                          <div className="flex justify-between items-center gap-4 text-xs">
                              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Edu</span>
                              <span className="font-mono">${CHART_DATA[hoveredIndex].course}</span>
                          </div>
                      </div>
                  )}

                  {/* X Axis Labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 font-bold px-0">
                      {CHART_DATA.map((d, i) => (
                          <div key={i} className="flex-1 text-center" style={{ width: 0 }}>{d.month}</div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Sources Breakdown */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Fuentes de Ingreso</h3>
              
              <div className="flex-1 flex flex-col justify-center space-y-6">
                  {/* Item 1 */}
                  <div>
                      <div className="flex justify-between text-sm mb-2">
                          <button 
                            onClick={() => onNavigate?.('earnings/sales/asset')}
                            className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
                          >
                              <Box className="h-4 w-4 text-rose-500" /> Marketplace
                          </button>
                          <span className="font-bold text-slate-900 dark:text-white">55%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 w-[55%] rounded-full"></div>
                      </div>
                  </div>

                  {/* Item 2 */}
                  <div>
                      <div className="flex justify-between text-sm mb-2">
                          <button 
                            onClick={() => onNavigate?.('earnings/sales/freelance')}
                            className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
                          >
                              <Briefcase className="h-4 w-4 text-cyan-500" /> Freelance
                          </button>
                          <span className="font-bold text-slate-900 dark:text-white">30%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 w-[30%] rounded-full"></div>
                      </div>
                  </div>

                  {/* Item 3 */}
                  <div>
                      <div className="flex justify-between text-sm mb-2">
                          <button 
                            onClick={() => onNavigate?.('earnings/sales/course')}
                            className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
                          >
                              <Video className="h-4 w-4 text-emerald-500" /> Cursos
                          </button>
                          <span className="font-bold text-slate-900 dark:text-white">15%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[15%] rounded-full"></div>
                      </div>
                  </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                  <p className="text-xs text-slate-500 text-center">
                      Basado en los últimos 30 días
                  </p>
              </div>
          </div>

      </div>

      {/* Top Selling Products Section */}
      <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" /> Rendimiento de Productos
              </h3>
              <div className="flex gap-2">
                  {[
                      { id: 'all', label: 'Todo' },
                      { id: 'asset', label: 'Assets' },
                      { id: 'course', label: 'Cursos' },
                      { id: 'freelance', label: 'Freelance' }
                  ].map(tab => (
                      <button 
                          key={tab.id}
                          onClick={() => setTopItemsFilter(tab.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                              topItemsFilter === tab.id 
                              ? 'bg-amber-500 text-white border-amber-500' 
                              : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                          {tab.label}
                      </button>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopItems.map((item, index) => (
                  <div key={item.id} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-4 rounded-xl flex items-center gap-4 hover:border-amber-500/30 transition-colors group">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute top-0 left-0 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg">
                              #{index + 1}
                          </div>
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate pr-2 group-hover:text-amber-500 transition-colors">
                                  {item.title}
                              </h4>
                              <div className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                                  {item.type}
                              </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                              <div className="text-slate-500">
                                  <span className="font-bold text-slate-900 dark:text-white">{item.sales}</span> ventas
                              </div>
                              <div className="text-emerald-500 font-bold">
                                  ${item.revenue.toLocaleString()}
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
              {filteredTopItems.length === 0 && (
                  <div className="col-span-full py-8 text-center text-slate-500 text-sm">
                      No hay datos para esta categoría.
                  </div>
              )}
          </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Transacciones Recientes</h3>
              
              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-full md:w-auto">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                      Todas
                  </button>
                  <button 
                    onClick={() => setActiveTab('sales')}
                    className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'sales' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                      Ventas
                  </button>
                  <button 
                    onClick={() => setActiveTab('withdrawals')}
                    className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'withdrawals' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                      Retiros
                  </button>
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-bold uppercase text-xs">
                      <tr>
                          <th className="px-6 py-4">Concepto</th>
                          <th className="px-6 py-4">Tipo</th>
                          <th className="px-6 py-4">Cliente / Destino</th>
                          <th className="px-6 py-4">Fecha</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4 text-right">Monto</th>
                          <th className="px-6 py-4"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      {filteredTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                  {tx.title}
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      {tx.type === 'asset' && <Box className="h-4 w-4 text-rose-500" />}
                                      {tx.type === 'course' && <Video className="h-4 w-4 text-emerald-500" />}
                                      {tx.type === 'freelance' && <Briefcase className="h-4 w-4 text-cyan-500" />}
                                      {tx.type === 'withdrawal' && <ArrowUpRight className="h-4 w-4 text-slate-400" />}
                                      <span className="capitalize text-slate-600 dark:text-slate-300">
                                          {tx.type === 'withdrawal' ? 'Retiro' : tx.type}
                                      </span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                  {tx.buyer}
                              </td>
                              <td className="px-6 py-4 text-slate-500 text-xs">
                                  {tx.date}
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                      tx.status === 'completed' 
                                      ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                  }`}>
                                      {tx.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                                      {tx.status === 'completed' ? 'Completado' : 'Pendiente'}
                                  </span>
                              </td>
                              <td className={`px-6 py-4 text-right font-bold text-base ${
                                  tx.amount < 0 ? 'text-slate-500' : 'text-slate-900 dark:text-white'
                              }`}>
                                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreHorizontal className="h-5 w-5" />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          <div className="p-4 border-t border-slate-200 dark:border-white/10 text-center">
              <button className="text-sm font-bold text-amber-500 hover:text-amber-400 hover:underline transition-colors">
                  Ver historial completo
              </button>
          </div>
      </div>

    </div>
  );
};
