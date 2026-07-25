import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, CreditCard, User, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth, useUser, SignInButton } from '@clerk/nextjs';

export default function CheckoutView() {
    const { cart, formatPrice, navigate, clearCart } = useStore();
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('standard');
    
    // Form state
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.primaryPhoneNumber?.phoneNumber || '',
        address: '',
        city: ''
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shippingCost = shippingMethod === 'express' ? 15 : 0;
    const total = subtotal + tax + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city) {
            toast.error('Please fill in all required delivery fields.');
            return;
        }

        setIsCheckingOut(true);
        try {
            const customer = {
                firstname: formData.firstName,
                lastname: formData.lastName,
                phone: formData.phone,
                address: `${formData.address}, ${formData.city}`
            };
            
            const res = await fetch('/api/payment/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, customer, totalAmount: total })
            });
            
            const data = await res.json();
            
            if (res.ok && data.success && data.checkoutUrl) {
                toast.success('Redirecting to secure payment gateway...');
                setTimeout(() => {
                    window.location.href = data.checkoutUrl;
                }, 800);
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
            <div className="flex flex-col items-center justify-center pt-24 h-[70vh]">
                <h2 className="text-3xl font-black text-white mb-3">Your cart is empty</h2>
                <button onClick={() => navigate('home')} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all mt-6">
                    Continue Shopping
                </button>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 h-[70vh]">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                    <User className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Sign in to checkout</h2>
                <p className="text-gray-400 mb-8 max-w-md text-center">You need an account to place an order securely.</p>
                <SignInButton mode="modal" signUpFallbackRedirectUrl="/?payment=success">
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        Sign In Now
                    </button>
                </SignInButton>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-h-[80vh]">
            <div className="flex items-center gap-4 mb-6 px-4 md:px-0 mt-4 md:mt-0 flex-shrink-0">
                <button onClick={() => navigate('cart')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                        Checkout
                    </h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar px-4 md:px-0 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Information */}
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <MapPin className="w-5 h-5 text-blue-400" /> Delivery Information
                            </h2>
                            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">First Name *</label>
                                        <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Last Name *</label>
                                        <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number *</label>
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Street Address *</label>
                                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">City *</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                                </div>
                            </form>
                        </div>

                        {/* Shipping Options */}
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <Truck className="w-5 h-5 text-emerald-400" /> Shipping Method
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`border rounded-2xl p-4 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="shipping" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="w-4 h-4 accent-emerald-500" />
                                            <span className="font-bold">Standard</span>
                                        </div>
                                        <span className="font-medium text-emerald-400">Free</span>
                                    </div>
                                    <p className="text-sm text-gray-400 pl-7">3-5 business days</p>
                                </label>
                                <label className={`border rounded-2xl p-4 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-4 h-4 accent-emerald-500" />
                                            <span className="font-bold">Express</span>
                                        </div>
                                        <span className="font-medium text-white">$15.00</span>
                                    </div>
                                    <p className="text-sm text-gray-400 pl-7">1-2 business days</p>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 sticky top-0">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto hide-scrollbar pr-2">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                                            <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover mix-blend-overlay" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h3 className="font-medium text-sm text-white truncate">{item.product.title}</h3>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                                                <span className="font-bold text-sm text-white">{formatPrice(item.product.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-3 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax (8%)</span>
                                    <span className="text-white font-medium">{formatPrice(tax)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-white font-medium">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between items-end pt-3 mt-3 border-t border-white/10">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <button type="submit" form="checkout-form" disabled={isCheckingOut} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isCheckingOut ? (
                                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" /> Pay Securely
                                        </>
                                    )}
                                </button>
                                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-bit encrypted secure checkout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
