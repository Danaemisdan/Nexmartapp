import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, User, MapPin, Package, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';
// Removed Clerk imports
import ProfileDropdown from '../ui/ProfileDropdown';
import { AnimatePresence } from 'framer-motion';

export default function MarketplaceHeader({ onLogoClick }: { onLogoClick?: () => void }) {
    const { getCartCount, navigate, searchQuery, setSearchQuery, setAddressModalOpen, activeView } = useStore();
    const cartCount = getCartCount();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('search');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-[#ECECEC] shadow-sm">
            <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-3">
                <div className="flex items-center gap-6 lg:gap-8 w-full">
                    
                    {/* Left: Logo */}
                    <div 
                        onClick={() => {
                            if (onLogoClick) onLogoClick();
                            else navigate('home');
                        }}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                    >
                        <img src="/yellow-x-logo.png" alt="Nexmart" className="h-10 md:h-12 object-contain drop-shadow-sm rounded" />
                        <span className="text-[#111111] font-black text-xl md:text-2xl tracking-tighter hidden sm:block">NEXMART</span>
                    </div>

                    {/* Left-Mid: Location (Hidden on mobile) */}
                    <div 
                        onClick={() => setAddressModalOpen(true)}
                        className="hidden lg:flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors flex-shrink-0"
                    >
                        <MapPin className="w-5 h-5 text-[#FF6A00]" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 font-bold leading-none">Deliver to</span>
                            <span className="text-sm text-[#111111] font-bold leading-tight">New York 10001</span>
                        </div>
                    </div>

                    {/* Center: Search Bar (Dominant) */}
                    <div className="flex-1 flex justify-center w-full">
                        <form onSubmit={handleSearch} className="w-full relative group max-w-3xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF6A00] transition-colors" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for products, brands and more..." 
                                className="w-full bg-[#F0F5FF] border border-transparent hover:bg-[#E8F0FE] focus:bg-white focus:border-[#FF6A00]/50 rounded-lg pl-12 pr-6 py-2.5 text-sm font-medium text-[#111111] placeholder:text-gray-500 transition-all outline-none shadow-inner"
                            />
                            <button type="submit" className="hidden">Submit</button>
                        </form>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                        <div 
                            className="relative hidden md:flex"
                            onMouseEnter={() => setShowProfileDropdown(true)}
                            onMouseLeave={() => setShowProfileDropdown(false)}
                        >
                            <button onClick={() => navigate('account')} className={`flex items-center gap-2 transition-colors font-semibold text-sm py-4 ${activeView === 'account' ? 'text-[#FF6A00]' : 'text-[#111111] hover:text-[#FF6A00]'}`}>
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                                <ChevronDown className="w-3 h-3 text-gray-400 ml-[-2px]" />
                            </button>
                            <AnimatePresence>
                                {showProfileDropdown && <ProfileDropdown />}
                            </AnimatePresence>
                        </div>
                        
                        <button onClick={() => navigate('wishlist')} className={`hidden lg:flex items-center gap-2 transition-colors font-semibold text-sm ${activeView === 'wishlist' ? 'text-[#FF6A00]' : 'text-[#111111] hover:text-[#FF6A00]'}`}>
                            <Heart className="w-5 h-5" />
                            <span>Wishlist</span>
                        </button>
                        
                        <button onClick={() => navigate('orders')} className={`hidden lg:flex items-center gap-2 transition-colors font-semibold text-sm ${activeView === 'orders' ? 'text-[#FF6A00]' : 'text-[#111111] hover:text-[#FF6A00]'}`}>
                            <Package className="w-5 h-5" />
                            <span>Orders</span>
                        </button>

                        <button onClick={() => navigate('cart')} className={`flex items-center gap-2 transition-colors font-semibold text-sm relative group ${activeView === 'cart' || activeView === 'checkout' || activeView === 'checkout_address' || activeView === 'checkout_payment' ? 'text-[#FF6A00]' : 'text-[#111111] hover:text-[#FF6A00]'}`}>
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#FF6A00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden sm:block">Cart</span>
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}
