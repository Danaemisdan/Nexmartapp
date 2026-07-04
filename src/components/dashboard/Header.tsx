import React from 'react';
import { Search, ShoppingCart, Heart, User, Sparkles, Menu, Package } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';

export default function Header() {
    const { getCartCount, activeView, navigate, isLoggedIn, setIsAuthModalOpen } = useStore();
    const cartCount = getCartCount();

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 pb-2 md:pb-0">
            {/* Top Announcement Bar */}
            <div className="bg-black text-white text-[10px] md:text-xs font-bold py-1.5 md:py-2 text-center flex items-center justify-center gap-2 tracking-wider">
                <Sparkles className="w-3 h-3 text-yellow-400" /> 
                AI Picks Just for You - Smarter Shopping, Better Choices!
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
                {/* 3-Column Header Layout */}
                <div className="grid grid-cols-3 items-center h-16 md:h-20 gap-4">
                    
                    {/* Left: Logo & Search */}
                    <div className="flex items-center gap-4 justify-start">
                        <button onClick={() => navigate('categories')} className="md:hidden p-2 -ml-2 text-gray-600 hover:text-[#1e3a8a] transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div 
                            onClick={() => navigate('home')}
                            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                        >
                            <img src="/logo-full.png" alt="Nexmart" className="h-8 md:h-10" />
                        </div>
                        
                        <div className="hidden lg:flex flex-1 max-w-[300px] relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 text-xs rounded-full focus:ring-0 focus:border-[#1e3a8a] block pl-10 p-2.5 transition-all placeholder:text-gray-400 font-medium" 
                                placeholder="Ask AI..." 
                            />
                        </div>
                    </div>

                    {/* Center: Agent Orb Placeholder (Orb rendered outside to prevent clipping) */}
                    <div className="flex justify-center items-center relative z-[60]">
                        {/* Empty to preserve grid layout */}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-3 md:gap-6">
                        <button onClick={() => navigate('wishlist')} className="hidden md:flex flex-col items-center gap-1 text-gray-500 hover:text-[#1e3a8a] transition-colors group">
                            <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold">Wishlist</span>
                        </button>
                        
                        <button onClick={() => navigate('cart')} className="hidden md:flex flex-col items-center md:gap-1 text-gray-900 md:text-gray-500 hover:text-[#1e3a8a] transition-colors relative group">
                            <div className="relative">
                                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-[#1e3a8a] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold">Cart</span>
                        </button>
                        
                        {isLoggedIn ? (
                            <button onClick={() => navigate('orders')} className={`flex flex-col items-center gap-1 transition-colors group ${activeView === 'orders' ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform ${activeView === 'orders' ? 'bg-[#1e3a8a] text-white' : 'bg-blue-100 text-blue-600'}`}>JD</div>
                                <span className="hidden md:block text-[10px] font-bold">Orders</span>
                            </button>
                        ) : (
                            <button onClick={() => setIsAuthModalOpen(true)} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#1e3a8a] transition-colors group">
                                <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="hidden md:block text-[10px] font-bold">Sign In</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Desktop Secondary Nav */}
                <div className="hidden md:flex items-center justify-between border-t border-gray-100 py-3">
                    <button onClick={() => navigate('categories')} className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#1e3a8a] transition-colors">
                        <Menu className="w-4 h-4" /> All Categories
                    </button>
                    
                    <div className="flex items-center gap-8 text-sm font-bold text-gray-600">
                        <span onClick={() => navigate('home')} className={`cursor-pointer pb-1 ${activeView === 'home' ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]' : 'hover:text-gray-900'}`}>Home</span>
                        <span onClick={() => navigate('home')} className={`cursor-pointer flex items-center gap-1 ${activeView === 'home' ? 'text-gray-900' : 'hover:text-gray-900'}`}>
                            AI Picks <span className="bg-[#1e3a8a] text-white text-[9px] px-1.5 py-0.5 rounded-sm">NEW</span>
                        </span>
                        <span onClick={() => navigate('deals')} className={`cursor-pointer pb-1 ${activeView === 'deals' ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]' : 'hover:text-gray-900'}`}>Deals</span>
                        <span onClick={() => navigate('orders')} className={`cursor-pointer hover:text-gray-900 flex items-center gap-1 ${activeView === 'orders' ? 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]' : ''}`}><Package className="w-4 h-4"/> Track Order</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
