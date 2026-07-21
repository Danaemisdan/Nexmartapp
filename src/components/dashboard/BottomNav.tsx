import React from 'react';
import { Search, ShoppingCart, Heart, User, Home, Package } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';

export default function BottomNav() {
    const { navigate, activeView, getCartCount } = useStore();
    const cartCount = getCartCount();

    return (
        <nav className="md:hidden fixed bottom-0 w-full bg-[#050505]/70 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-3 pb-8 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <button onClick={() => navigate('home')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'home' ? 'text-yellow-400' : 'text-white/50 hover:text-white'}`}>
                <Home className={`w-6 h-6 ${activeView === 'home' ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">Home</span>
            </button>
            <button onClick={() => navigate('search')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'search' ? 'text-yellow-400' : 'text-white/50 hover:text-white'}`}>
                <Search className={`w-6 h-6 ${activeView === 'search' ? 'text-yellow-400' : ''}`} />
                <span className="text-[10px] font-bold">Search</span>
            </button>
            
            {/* Center space for AgentOrb notch */}
            <div className="w-16"></div>

            <button onClick={() => navigate('wishlist')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'wishlist' ? 'text-yellow-400' : 'text-white/50 hover:text-white'}`}>
                <Heart className={`w-6 h-6 ${activeView === 'wishlist' ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">Wishlist</span>
            </button>
            <button onClick={() => navigate('cart')} className={`flex flex-col items-center gap-1 transition-colors relative ${activeView === 'cart' ? 'text-yellow-400' : 'text-white/50 hover:text-white'}`}>
                <ShoppingCart className={`w-6 h-6 ${activeView === 'cart' ? 'fill-current' : ''}`} />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-yellow-500 text-[#050505] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                        {cartCount}
                    </span>
                )}
                <span className="text-[10px] font-bold">Cart</span>
            </button>
        </nav>
    );
}
