import React from 'react';
import { Search, ShoppingCart, Heart, User, Sparkles, Menu, Package } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function Header() {
    const { getCartCount, activeView, navigate } = useStore();
    const { isSignedIn } = useAuth();
    const cartCount = getCartCount();

    return (
        <header className="sticky top-0 z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/10 pb-2 md:pb-0">
            {/* Top Announcement Bar */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white text-[10px] md:text-xs font-bold py-1.5 md:py-2 text-center flex items-center justify-center gap-2 tracking-wider border-b border-white/10">
                <Sparkles className="w-3 h-3 text-yellow-400" /> 
                AI Picks Just for You - Smarter Shopping, Better Choices!
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
                {/* Header Layout */}
                <div className="flex items-center justify-between h-16 md:h-20 relative">
                    
                    {/* Left: Logo & Menu */}
                    <div className="flex items-center gap-4 z-10">
                        <button onClick={() => navigate('categories')} className="md:hidden p-2 -ml-2 text-white/70 hover:text-white transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div 
                            onClick={() => navigate('home')}
                            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity shrink-0 relative"
                        >
                            <motion.img layoutId="main-logo" src="/logo-icon.png" alt="Nexmart" className="h-8 md:h-10" />
                            <span className="text-white font-black text-lg tracking-tighter hidden sm:block">NEXMART</span>
                        </div>
                    </div>

                    {/* Center: Agent Orb Placeholder (Orb rendered outside to prevent clipping) */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex justify-center items-center z-[60]">
                        {/* Empty to preserve centering */}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-3 md:gap-6">
                        <button onClick={() => navigate('wishlist')} className="hidden md:flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors group">
                            <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold">Wishlist</span>
                        </button>
                        
                        <button onClick={() => navigate('cart')} className="hidden md:flex flex-col items-center md:gap-1 text-white/90 md:text-white/70 hover:text-white transition-colors relative group">
                            <div className="relative">
                                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-yellow-500 text-[#050505] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold">Cart</span>
                        </button>
                        
                        {isSignedIn ? (
                            <>
                                <button onClick={() => navigate('orders')} className={`flex flex-col items-center gap-1 transition-colors group ${activeView === 'orders' ? 'text-yellow-400' : 'text-white/70 hover:text-white'}`}>
                                    <Package className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="hidden md:block text-[10px] font-bold">Orders</span>
                                </button>
                                <UserButton />
                            </>
                        ) : (
                            <SignInButton mode="modal">
                                <button className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors group">
                                    <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="hidden md:block text-[10px] font-bold">Sign In</span>
                                </button>
                            </SignInButton>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
