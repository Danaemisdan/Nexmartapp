import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Package, RefreshCcw, ChevronRight, Star, X } from 'lucide-react';
import AuthGate from '../../ui/AuthGate';


// Define the Order types so it's ready for the backend
type OrderStatus = 'DELIVERED' | 'REFUND_CREDITED' | 'PROCESSING' | 'SHIPPED';

interface OrderItem {
    id: string;
    brand: string;
    title: string;
    size: string;
    image: string;
    tag?: string;
    date?: Date;
}

interface Order {
    id: string;
    status: OrderStatus;
    dateText: string;
    date: Date;
    amount?: number;
    items: OrderItem[];
    exchangeAvailableTill?: string;
}

type TimeFilter = 'anytime' | 'last30' | 'last6months' | 'lastyear';

export default function OrdersView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filterTab, setFilterTab] = useState<'status' | 'time'>('status');

    // Filter state
    const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([]);
    const [selectedTime, setSelectedTime] = useState<TimeFilter>('anytime');

    // Pending (in-modal) filter state — only applied on "Show Results"
    const [pendingStatuses, setPendingStatuses] = useState<OrderStatus[]>([]);
    const [pendingTime, setPendingTime] = useState<TimeFilter>('anytime');

    // This state simulates what would be fetched from the backend
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Simulate an API call to fetch original order history
        setTimeout(() => {
            setOrders([
                {
                    id: 'ORD-1234',
                    status: 'DELIVERED',
                    dateText: 'On Wed, 29 Jul, 4:10 PM',
                    date: new Date('2026-07-29'),
                    exchangeAvailableTill: '5 Aug',
                    items: [
                        {
                            id: 'ITEM-1',
                            brand: 'Libas',
                            title: 'Women Floral Daily Cotton Straight Kurta',
                            size: 'XL',
                            image: 'https://images.unsplash.com/photo-1610411706689-c5c2fcbc224e?q=80&w=150&auto=format&fit=crop'
                        }
                    ]
                },
                {
                    id: 'ORD-5678',
                    status: 'REFUND_CREDITED',
                    dateText: 'Fri, 17 Jul, 3:57 PM',
                    date: new Date('2026-07-17'),
                    amount: 1399.00,
                    items: [
                        {
                            id: 'ITEM-2',
                            brand: 'Indo Era',
                            title: 'Women Ethnic Motifs Embroidered Regular Thread Work Kurta',
                            size: 'XXL',
                            image: 'https://images.unsplash.com/photo-1583391733958-d6e0938f6d26?q=80&w=150&auto=format&fit=crop'
                        }
                    ]
                },
                {
                    id: 'ORD-9012',
                    status: 'REFUND_CREDITED',
                    dateText: 'Thu, 9 Jul, 5:17 PM',
                    date: new Date('2026-07-09'),
                    amount: 729.00,
                    items: [
                        {
                            id: 'ITEM-3',
                            brand: 'LULU & SKY',
                            title: 'Polka Dot Print Ruffles Net Wrap Top',
                            size: 'L',
                            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=150&auto=format&fit=crop',
                            tag: 'FWD'
                        }
                    ]
                }
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const togglePendingStatus = (status: OrderStatus) => {
        setPendingStatuses(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const openFilters = () => {
        setPendingStatuses([...selectedStatuses]);
        setPendingTime(selectedTime);
        setShowFilters(true);
        setFilterTab('status');
    };

    const applyFilters = () => {
        setSelectedStatuses(pendingStatuses);
        setSelectedTime(pendingTime);
        setShowFilters(false);
    };

    const clearAllFilters = () => {
        setPendingStatuses([]);
        setPendingTime('anytime');
        setSelectedStatuses([]);
        setSelectedTime('anytime');
        setShowFilters(false);
    };

    const getTimeLabel = (t: TimeFilter) => {
        if (t === 'anytime') return 'anytime';
        if (t === 'last30') return 'last 30 days';
        if (t === 'last6months') return 'last 6 months';
        return 'last year';
    };

    const activeFilterCount = selectedStatuses.length + (selectedTime !== 'anytime' ? 1 : 0);

    // Apply all filters
    const filteredOrders = orders.filter(order => {
        // Search filter
        const matchesSearch = searchQuery === '' || order.items.some(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Status filter
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(order.status);

        // Time filter
        const now = new Date();
        let matchesTime = true;
        if (selectedTime === 'last30') {
            const cutoff = new Date(now); cutoff.setDate(now.getDate() - 30);
            matchesTime = order.date >= cutoff;
        } else if (selectedTime === 'last6months') {
            const cutoff = new Date(now); cutoff.setMonth(now.getMonth() - 6);
            matchesTime = order.date >= cutoff;
        } else if (selectedTime === 'lastyear') {
            const cutoff = new Date(now); cutoff.setFullYear(now.getFullYear() - 1);
            matchesTime = order.date >= cutoff;
        }

        return matchesSearch && matchesStatus && matchesTime;
    });

    const statusOptions: { value: OrderStatus; label: string }[] = [
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'PROCESSING', label: 'Processing' },
        { value: 'SHIPPED', label: 'Shipped' },
        { value: 'REFUND_CREDITED', label: 'Returned' },
    ];

    const timeOptions: { value: TimeFilter; label: string }[] = [
        { value: 'anytime', label: 'Anytime' },
        { value: 'last30', label: 'Last 30 days' },
        { value: 'last6months', label: 'Last 6 months' },
        { value: 'lastyear', label: 'Last year' },
    ];


    return (
        <AuthGate
            icon={<Package className="w-10 h-10 text-gray-400" />}
            pageName="Orders"
            subtitle="Login to view your order history, track shipments, and manage returns."
        >
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Filter Modal */}
            {showFilters && (
                <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-[#111111]">Filters</h3>
                            <div className="flex items-center gap-4">
                                <button onClick={clearAllFilters} className="text-[#FF6A00] font-bold text-sm hover:text-[#E65C00] transition-colors">Clear All</button>
                                <button onClick={() => setShowFilters(false)} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Split Layout */}
                        <div className="flex min-h-[360px]">
                            {/* Left Tab Nav */}
                            <div className="w-36 border-r border-gray-100 bg-white flex flex-col pt-2">
                                <button
                                    onClick={() => setFilterTab('status')}
                                    className={`flex items-center gap-2 px-4 py-4 text-sm font-medium text-left transition-colors ${
                                        filterTab === 'status' ? 'bg-gray-50 text-[#111111] font-bold border-l-2 border-[#FF6A00]' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <SlidersHorizontal className="w-4 h-4" /> Status
                                    {pendingStatuses.length > 0 && <span className="ml-auto w-4 h-4 bg-[#FF6A00] text-white text-[9px] font-black rounded-full flex items-center justify-center">{pendingStatuses.length}</span>}
                                </button>
                                <button
                                    onClick={() => setFilterTab('time')}
                                    className={`flex items-center gap-2 px-4 py-4 text-sm font-medium text-left transition-colors ${
                                        filterTab === 'time' ? 'bg-gray-50 text-[#111111] font-bold border-l-2 border-[#FF6A00]' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <Package className="w-4 h-4" /> Time
                                    {pendingTime !== 'anytime' && <span className="ml-auto w-4 h-4 bg-[#FF6A00] text-white text-[9px] font-black rounded-full flex items-center justify-center">1</span>}
                                </button>
                            </div>

                            {/* Right Panel */}
                            <div className="flex-1 p-6">
                                {filterTab === 'status' && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-4">Order Status</p>
                                        <div className="flex flex-col gap-3">
                                            {statusOptions.map(opt => (
                                                <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                                                    <div
                                                        onClick={() => togglePendingStatus(opt.value)}
                                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                                            pendingStatuses.includes(opt.value)
                                                                ? 'bg-[#FF6A00] border-[#FF6A00]'
                                                                : 'border-gray-300 group-hover:border-gray-400'
                                                        }`}
                                                    >
                                                        {pendingStatuses.includes(opt.value) && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className={`text-sm ${pendingStatuses.includes(opt.value) ? 'font-bold text-[#111111]' : 'text-gray-600'}`}>{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {filterTab === 'time' && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-4">Order Time</p>
                                        <div className="flex flex-col gap-3">
                                            {timeOptions.map(opt => (
                                                <label key={opt.value} onClick={() => setPendingTime(opt.value)} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                        pendingTime === opt.value ? 'border-[#FF6A00]' : 'border-gray-300 group-hover:border-gray-400'
                                                    }`}>
                                                        {pendingTime === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />}
                                                    </div>
                                                    <span className={`text-sm ${pendingTime === opt.value ? 'font-bold text-[#111111]' : 'text-gray-600'}`}>{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100">
                            <button
                                onClick={applyFilters}
                                className="w-full py-3 bg-[#FF6A00] hover:bg-[#E65C00] text-white font-bold text-sm rounded-lg transition-colors shadow-md shadow-orange-500/20"
                            >
                                Show Results ({filteredOrders.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-100 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#111111]">All orders</h2>
                    <p className="text-sm text-gray-500 mt-1">from {getTimeLabel(selectedTime)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#FF6A00] w-64"
                        />
                    </div>
                    <button
                        onClick={openFilters}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-colors relative ${
                            activeFilterCount > 0
                                ? 'border-[#FF6A00] text-[#FF6A00] bg-orange-50'
                                : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="w-4 h-4 bg-[#FF6A00] text-white text-[9px] font-black rounded-full flex items-center justify-center">{activeFilterCount}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Active Filter Pills */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {selectedStatuses.map(s => (
                        <div key={s} className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-[#FF6A00]/30 rounded-full text-xs font-bold text-[#FF6A00]">
                            {statusOptions.find(o => o.value === s)?.label}
                            <button onClick={() => { setSelectedStatuses(selectedStatuses.filter(x => x !== s)); }} className="hover:text-[#E65C00]"><X className="w-3 h-3" /></button>
                        </div>
                    ))}
                    {selectedTime !== 'anytime' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-[#FF6A00]/30 rounded-full text-xs font-bold text-[#FF6A00]">
                            {timeOptions.find(o => o.value === selectedTime)?.label}
                            <button onClick={() => setSelectedTime('anytime')} className="hover:text-[#E65C00]"><X className="w-3 h-3" /></button>
                        </div>
                    )}
                    <button onClick={clearAllFilters} className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors underline">
                        Clear All
                    </button>
                </div>
            )}

            {/* Restock Section */}
            <div className="bg-[#F8F9FA] rounded-xl p-6 mb-8">
                <h3 className="text-[15px] font-bold text-[#111111] mb-4">Restock These products</h3>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                    {/* Placeholder Restock Items */}
                    {[
                        { brand: 'LOreal Paris', name: 'Hyaluron Moisture...', oldPrice: 1315, price: 802, off: '39%', size: '750-1000 ML', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=100' },
                        { brand: 'LOreal Professionnel', name: 'Absolut Repair Mask...', oldPrice: 999, price: 899, off: '10%', size: '200-250 ML', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=100' },
                        { brand: 'Aqualogica', name: 'Aqualogica Mid Nigh...', oldPrice: 499, price: 414, off: '17%', size: '100-150 ML', img: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=100' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3 min-w-[280px] shrink-0 cursor-pointer hover:shadow-sm transition-shadow">
                            <img src={item.img} alt={item.brand} className="w-12 h-16 object-cover rounded" />
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-[#111111] truncate">{item.brand}</h4>
                                <p className="text-[11px] text-gray-500 truncate mb-1">{item.name}</p>
                                <div className="flex items-center gap-1 text-[11px]">
                                    <span className="line-through text-gray-400">₹{item.oldPrice}</span>
                                    <span className="font-bold text-[#111111]">₹{item.price}</span>
                                    <span className="text-[#FF6A00] font-bold">{item.off} OFF</span>
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1 block">{item.size}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="flex flex-col gap-6">
                {isLoading ? (
                    <div className="p-8 flex justify-center items-center">
                        <RefreshCcw className="w-6 h-6 animate-spin text-[#FF6A00]" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No orders found.
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            
                            {/* Order Header */}
                            <div className={`px-5 py-4 border-b border-gray-100 flex items-start gap-3 ${order.status === 'DELIVERED' ? 'bg-[#F8F9FA]' : ''}`}>
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                    {order.status === 'DELIVERED' ? (
                                        <Package className="w-4 h-4 text-[#00BFA5]" />
                                    ) : (
                                        <RefreshCcw className="w-4 h-4 text-[#00BFA5]" />
                                    )}
                                </div>
                                <div>
                                    {order.status === 'DELIVERED' ? (
                                        <>
                                            <h4 className="font-bold text-[#00BFA5] text-[15px] flex items-center gap-2">
                                                Delivered <img src="/yellow-x-logo.png" alt="Nexmart" className="h-3 opacity-50 rounded-sm" />
                                            </h4>
                                            <p className="text-xs text-gray-500">{order.dateText}</p>
                                        </>
                                    ) : order.status === 'REFUND_CREDITED' ? (
                                        <>
                                            <h4 className="font-bold text-[#111111] text-[15px]">Refund Credited</h4>
                                            <p className="text-xs text-gray-500 mt-1">Your refund of <span className="font-bold">₹{order.amount?.toFixed(2)}</span> for the return has been processed successfully on {order.dateText}.</p>
                                            <button className="text-[11px] font-bold text-red-500 mt-1 uppercase tracking-wider">View Refund details</button>
                                        </>
                                    ) : (
                                        <h4 className="font-bold text-[#111111] text-[15px]">{order.status}</h4>
                                    )}
                                </div>
                            </div>
                            
                            {/* Order Items */}
                            <div className={`p-5 ${order.status !== 'DELIVERED' ? 'pb-0' : ''}`}>
                                {order.items.map(item => (
                                    <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors mb-4">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image} alt={item.title} className="w-14 h-20 object-cover rounded shadow-sm" />
                                            <div>
                                                {item.tag ? (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded italic">{item.tag}</span>
                                                        <h5 className="font-bold text-[#111111] text-sm">{item.brand}</h5>
                                                    </div>
                                                ) : (
                                                    <h5 className="font-bold text-[#111111] text-sm mb-1">{item.brand}</h5>
                                                )}
                                                <p className="text-xs text-gray-600 mb-1">{item.title}</p>
                                                <p className="text-xs text-gray-500">Size: {item.size}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                ))}
                                
                                {order.status === 'DELIVERED' && (
                                    <>
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            <button className="flex-1 min-w-[120px] py-2.5 border border-gray-200 rounded text-xs font-bold text-[#111111] hover:border-gray-400 flex items-center justify-center gap-2">
                                                <RefreshCcw className="w-3.5 h-3.5" /> Style Exchange
                                            </button>
                                            <button className="flex-1 min-w-[120px] py-2.5 border border-gray-200 rounded text-xs font-bold text-[#111111] hover:border-gray-400 flex items-center justify-center gap-2">
                                                <RefreshCcw className="w-3.5 h-3.5" /> Size Exchange
                                            </button>
                                            <button className="flex-1 min-w-[120px] py-2.5 border border-gray-200 rounded text-xs font-bold text-[#111111] hover:border-gray-400 flex items-center justify-center gap-2">
                                                <RefreshCcw className="w-3.5 h-3.5" /> Return Item
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-gray-50 py-2 px-3 rounded">
                                            <div className="w-3.5 h-3.5 rounded-full bg-[#00BFA5] flex items-center justify-center text-white font-bold text-[8px]">✓</div>
                                            Exchange/Return available till <span className="font-bold text-[#111111]">{order.exchangeAvailableTill}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {/* Review Section */}
                            <div className={`bg-gradient-to-r from-purple-50 to-white px-5 py-3 border-t border-gray-100 flex items-center gap-3 ${order.status !== 'DELIVERED' ? 'mt-4' : ''}`}>
                                <div className="flex items-center gap-1">
                                    <Star className={`w-4 h-4 ${order.status === 'DELIVERED' ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    <Star className={`w-4 h-4 ${order.status === 'DELIVERED' ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    <Star className={`w-4 h-4 ${order.status === 'DELIVERED' ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    <Star className="w-4 h-4 text-gray-300" />
                                    <Star className="w-4 h-4 text-gray-300" />
                                </div>
                                <span className="text-xs text-gray-600">Review & get a chance to <span className="text-[#00BFA5] font-bold">win NexmartCash!</span></span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        </AuthGate>
    );
}

