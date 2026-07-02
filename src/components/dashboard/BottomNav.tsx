import React from 'react';
import { Search, ShoppingCart, Heart, User, Home, Package } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';

export default function BottomNav() {
    const { navigate, activeView, getCartCount } = useStore();
    const cartCount = getCartCount();

    return (
        <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 px-6 py-3 pb-8 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <button onClick={() => navigate('home')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'home' ? 'text-[#1e3a8a]' : 'text-gray-400 hover:text-gray-600'}`}>
                <Home className={`w-6 h-6 ${activeView === 'home' ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">Home</span>
            </button>
            <button onClick={() => navigate('orders')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'orders' ? 'text-[#1e3a8a]' : 'text-gray-400 hover:text-gray-600'}`}>
                <Package className={`w-6 h-6 ${activeView === 'orders' ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">Orders</span>
            </button>
            
            {/* Center space for AgentOrb notch */}
            <div className="w-16"></div>

            <button onClick={() => navigate('wishlist')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'wishlist' ? 'text-[#1e3a8a]' : 'text-gray-400 hover:text-gray-600'}`}>
                <Heart className={`w-6 h-6 ${activeView === 'wishlist' ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">Wishlist</span>
            </button>
            <button onClick={() => navigate('cart')} className={`flex flex-col items-center gap-1 transition-colors relative ${activeView === 'cart' ? 'text-[#1e3a8a]' : 'text-gray-400 hover:text-gray-600'}`}>
                <ShoppingCart className={`w-6 h-6 ${activeView === 'cart' ? 'fill-current' : ''}`} />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#1e3a8a] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {cartCount}
                    </span>
                )}
                <span className="text-[10px] font-bold">Cart</span>
            </button>
        </nav>
    );
}
