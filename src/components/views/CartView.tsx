import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth, useUser, SignInButton } from '@clerk/nextjs';

export default function CartView() {
    const { cart, removeFromCart, updateCartQuantity, formatPrice, navigate } = useStore();
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    const handleCheckout = async () => {
        navigate('checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 pb-32 px-4 h-[70vh]">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <ShoppingCartIcon className="w-10 h-10 text-gray-300 drop-shadow-md" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Your cart is empty</h2>
                <p className="text-gray-400 mb-8 text-center max-w-sm">Ask the AI Orb to find you something amazing, or browse the homepage.</p>
                <button onClick={() => navigate('home')} className="bg-white text-black px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back to Store
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-8 pb-32 md:pb-12">
            <div className="flex items-center gap-3 mb-8">
                <button 
                    onClick={() => navigate('home')} 
                    aria-label="Back to Store"
                    className="p-2 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-300" />
                </button>
                <h1 className="text-3xl font-black text-white">Your Cart</h1>
                <div className="ml-auto bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    {cart.length} items
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="flex-1 space-y-4">
                    {cart.map((item) => (
                        <motion.div 
                            key={item.product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/10 md:bg-white/5 border border-white/15 md:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.7)] rounded-2xl p-4 flex gap-4 items-center relative backdrop-blur-md hover:bg-white/15 transition-colors"
                        >
                            <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                                <img 
                                    src={item.product.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80'} 
                                    alt={item.product.title} 
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80';
                                    }}
                                    className="max-w-full max-h-full object-contain mix-blend-screen" 
                                />
                            </div>
                            
                            <div className="flex flex-col flex-1 min-w-0">
                                <h3 className="font-extrabold text-white text-lg leading-tight truncate pr-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{item.product.title}</h3>
                                <p className="text-sm text-white/70 font-bold mb-3 drop-shadow-sm">{item.product.category || 'General'}</p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-black text-lg text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{formatPrice(item.product.price)}</span>
                                    
                                    <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1 border border-white/10">
                                        <button 
                                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} 
                                            aria-label={`Decrease quantity of ${item.product.title}`}
                                            className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-4 text-center text-white">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} 
                                            aria-label={`Increase quantity of ${item.product.title}`}
                                            className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.product.id)} 
                                aria-label={`Remove ${item.product.title} from cart`}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors p-1 bg-white/5 rounded-full backdrop-blur-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Checkout Summary */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white/10 md:bg-white/5 backdrop-blur-xl border border-white/15 md:border-white/10 rounded-3xl p-6 shadow-2xl sticky top-6">
                        <h2 className="text-xl font-black mb-6 text-white drop-shadow-sm">Order Summary</h2>
                        
                        <div className="space-y-3 text-sm text-white/80 mb-6 font-semibold">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-emerald-400 font-bold">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (8%)</span>
                                <span className="text-white font-bold">{formatPrice(tax)}</span>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-white font-bold">Total</span>
                                <span className="text-3xl font-black text-white">{formatPrice(total)}</span>
                            </div>
                        </div>

                        {isSignedIn ? (
                            <button 
                                onClick={handleCheckout}
                                disabled={isCheckingOut || cart.length === 0}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCheckingOut ? (
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" /> Proceed to Checkout
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="w-full">
                                <SignInButton mode="modal" signUpFallbackRedirectUrl="/?payment=success">
                                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                        <User className="w-5 h-5" /> Sign in to Checkout
                                    </button>
                                </SignInButton>
                            </div>
                        )}
                        
                        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Sparkles className="w-3 h-3 text-emerald-400" /> AI verified secure checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShoppingCartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    )
}
