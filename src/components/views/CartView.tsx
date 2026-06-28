import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CartView() {
    const { cart, updateCartQuantity, removeFromCart, clearCart, navigate, formatPrice } = useStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const customer = {
                firstname: "Test",
                lastname: "User",
                phone: "08012345678",
                address: "Nexmart Delivery Location"
            };
            
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, customer })
            });
            
            const data = await res.json();
            
            if (res.ok && data.success) {
                clearCart();
                toast.success(`Checkout Successful! Your AI has processed the order.\nRef: ${data.group_order_reference}`);
                navigate('home');
            } else {
                toast.error(`Checkout Failed: ${data.error || 'Unknown error'}`);
            }
        } catch (e: any) {
            toast.error(`Checkout Error: ${e.message}`);
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 pb-32 px-4 h-[70vh]">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCartIcon className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-xs">Ask the AI Orb to find you something amazing, or browse the homepage.</p>
                <button onClick={() => navigate('home')} className="bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#172554] transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back to Store
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-8 pb-32 md:pb-12">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate('home')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-3xl font-black text-gray-900">Your Cart</h1>
                <div className="ml-auto bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
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
                            className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center shadow-sm relative"
                        >
                            <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                                <img src={item.product.image} alt={item.product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                            </div>
                            
                            <div className="flex flex-col flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight truncate pr-8">{item.product.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{item.product.category}</p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-black text-lg">{formatPrice(item.product.price)}</span>
                                    
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1 border border-gray-100">
                                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="text-gray-500 hover:text-black">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="text-gray-500 hover:text-black">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => removeFromCart(item.product.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Checkout Summary */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-6">
                        <h2 className="text-xl font-black mb-6">Order Summary</h2>
                        
                        <div className="space-y-3 text-sm text-gray-600 mb-6 font-medium">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-emerald-500 font-bold">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (8%)</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-900 font-bold">Total</span>
                                <span className="text-3xl font-black text-gray-900">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 shadow-xl shadow-black/10"
                        >
                            {isCheckingOut ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                            ) : (
                                <><CreditCard className="w-5 h-5" /> Checkout Securely</>
                            )}
                        </button>
                        
                        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Sparkles className="w-3 h-3 text-emerald-500" /> AI verified secure checkout
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
