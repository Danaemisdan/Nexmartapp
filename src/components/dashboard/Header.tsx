import React from 'react';
import { Search, ShoppingCart, Heart, User, Sparkles, Menu, Package } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';
import AgentOrb from '../os/AgentOrb';

interface HeaderProps {
    isLoggedIn: boolean;
    onOpenAuth: () => void;
    agentProps: any;
}

export default function Header({ isLoggedIn, onOpenAuth, agentProps }: HeaderProps) {
    const { getCartCount, navigate } = useStore();
    const cartCount = getCartCount();

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 pb-2 md:pb-0">
            {/* Top Announcement Bar */}
            <div className="bg-black text-white text-[10px] md:text-xs font-bold py-1.5 md:py-2 text-center flex items-center justify-center gap-2 tracking-wider">
                <Sparkles className="w-3 h-3 text-yellow-400" /> 
                AI Picks Just for You - Smarter Shopping, Better Choices! 
                <span onClick={() => {}} className="hidden md:inline cursor-pointer ml-4 hover:text-gray-300">Download App 📱</span>
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
                <div className="flex items-center justify-between h-14 md:h-20 gap-4">
                    {/* Logo & Mobile Menu */}
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 -ml-2 text-gray-600">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div 
                            onClick={() => navigate('home')}
                            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <img src="/logo-full.png" alt="Nexmart" className="h-8 md:h-10" />
                        </div>
                    </div>

                    {/* Search Bar - Hidden on mobile, handled by AgentOrb */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 text-sm rounded-full focus:ring-0 focus:border-[#1e3a8a] block pl-12 p-3 transition-all placeholder:text-gray-400 font-medium" 
                            placeholder="Ask AI to find anything..." 
                        />
                        <button className="absolute inset-y-1 right-1 bg-[#1e3a8a] text-white px-4 rounded-full text-xs font-bold hover:bg-[#172554] transition-colors">
                            Search
                        </button>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <button onClick={() => navigate('wishlist')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#1e3a8a] transition-colors group">
                            <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold">Wishlist</span>
                        </button>
                        
                        <button onClick={() => navigate('cart')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#1e3a8a] transition-colors relative group">
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
                            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#1e3a8a] transition-colors group">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">JD</div>
                                <span className="text-[10px] font-bold">Profile</span>
                            </button>
                        ) : (
                            <button onClick={onOpenAuth} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#1e3a8a] transition-colors group">
                                <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold">Sign In</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Actions (Right aligned) */}
                    <div className="flex md:hidden items-center gap-4">
                        <button onClick={() => navigate('cart')} className="relative text-gray-900">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1.5 bg-[#1e3a8a] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Desktop Secondary Nav */}
                <div className="hidden md:flex items-center justify-between border-t border-gray-100 py-3">
                    <button onClick={() => navigate('categories')} className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#1e3a8a] transition-colors">
                        <Menu className="w-4 h-4" /> All Categories
                    </button>
                    
                    <div className="flex items-center gap-8 text-sm font-bold text-gray-600">
                        <span onClick={() => navigate('home')} className="cursor-pointer text-[#1e3a8a] border-b-2 border-[#1e3a8a] pb-1">Home</span>
                        <span onClick={() => navigate('home')} className="cursor-pointer hover:text-gray-900 flex items-center gap-1">
                            AI Picks <span className="bg-[#1e3a8a] text-white text-[9px] px-1.5 py-0.5 rounded-sm">NEW</span>
                        </span>
                        <span onClick={() => navigate('deals')} className="cursor-pointer hover:text-gray-900">Deals</span>
                        <span onClick={() => {}} className="cursor-pointer hover:text-gray-900 flex items-center gap-1"><Package className="w-4 h-4"/> Track Order</span>
                    </div>
                </div>

                {/* Center Notch for the AgentOrb (Mobile & Desktop) */}
                <div className="flex justify-center items-center flex-shrink-0 -mb-16 md:-mb-24 z-[60] relative">
                    <AgentOrb {...agentProps} />
                </div>
            </div>
        </header>
    );
}
