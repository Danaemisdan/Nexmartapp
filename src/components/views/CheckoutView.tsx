import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { ShieldCheck, MapPin, Tag, Truck } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export default function CheckoutView() {
    const { activeView, cart, navigate, showToast, clearCart } = useStore();
    const { isSignedIn } = useAuth();
    const [selectedAddress, setSelectedAddress] = useState<string>('home');
    const [selectedPayment, setSelectedPayment] = useState<string>('upi');
    const [isProcessing, setIsProcessing] = useState(false);

    const isAddressStep = activeView === 'checkout_address' || activeView === 'checkout';
    const isPaymentStep = activeView === 'checkout_payment';

    const totalMRP = cart.reduce((sum, item) => sum + (Math.floor(item.product.price * 1.5) * item.quantity), 0);
    const totalDiscount = cart.reduce((sum, item) => sum + ((Math.floor(item.product.price * 1.5) - item.product.price) * item.quantity), 0);
    const totalAmount = totalMRP - totalDiscount + 23; // 23 is platform fee

    const handleNext = () => {
        if (isAddressStep) {
            navigate('checkout_payment');
        } else {
            handlePlaceOrder();
        }
    };

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        // Simulate order placement
        setTimeout(() => {
            setIsProcessing(false);
            showToast('Order placed successfully!', 'success');
            clearCart();
            navigate('orders');
        }, 1500);
    };

    return (
        <div className="w-full bg-white min-h-screen text-[#111111] font-sans pb-32 flex flex-col">
            {/* Header / Progress Bar */}
            <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
                <div className="max-w-[1000px] mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex-1" />
                    <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
                        <span className="text-[#00BFA5] cursor-pointer hover:underline" onClick={() => navigate('cart')}>BAG</span>
                        <span className="text-[#00BFA5]">----------</span>
                        <span className={`cursor-pointer ${isPaymentStep ? 'text-[#00BFA5] hover:underline' : 'text-[#00BFA5] border-b-2 border-[#00BFA5] pb-1'}`} onClick={() => navigate('checkout_address')}>ADDRESS</span>
                        <span className={isPaymentStep ? "text-[#00BFA5]" : "text-gray-300"}>----------</span>
                        <span className={isPaymentStep ? "text-[#00BFA5] border-b-2 border-[#00BFA5] pb-1" : "text-gray-500"}>PAYMENT</span>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <div className="flex items-center gap-1 text-gray-500">
                            <ShieldCheck className="w-5 h-5 text-[#00BFA5]" />
                            <span className="text-xs font-bold tracking-widest uppercase">100% SECURE</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto w-full px-4 pt-8 flex flex-col md:flex-row gap-8 flex-1">
                
                {/* Left Column: Flow Content */}
                <div className="flex-1 pr-0 md:pr-4">
                    {isAddressStep && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-[#111111]">Select Delivery Address</h2>
                                <button className="text-xs font-bold text-[#FF6A00] border border-gray-200 px-4 py-2 rounded uppercase hover:border-[#FF6A00]">ADD NEW ADDRESS</button>
                            </div>

                            <div className="border border-gray-200 rounded p-4 mb-4 bg-gray-50">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">DEFAULT ADDRESS</span>
                                <div className="flex items-start gap-3">
                                    <input 
                                        type="radio" 
                                        name="address" 
                                        checked={selectedAddress === 'home'}
                                        onChange={() => setSelectedAddress('home')}
                                        className="mt-1 accent-[#FF6A00]" 
                                    />
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-[#111111]">John Doe</span>
                                            <span className="px-2 py-0.5 bg-green-50 text-[#00BFA5] border border-[#00BFA5]/20 text-[10px] font-bold rounded-full uppercase tracking-wider">HOME</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                            Flat number-4, 2-77, adesh villa, block-2, rajendra nagar, sector-5, Sahibabad<br/>
                                            Ghaziabad, Uttar Pradesh - 201005
                                        </p>
                                        <p className="text-sm text-gray-600 mb-4">Mobile: <span className="font-medium text-[#111111]">8447450354</span></p>
                                        <button className="text-xs font-bold text-gray-600 hover:text-[#FF6A00] uppercase border border-gray-300 hover:border-[#FF6A00] rounded px-4 py-1.5 transition-colors">EDIT</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isPaymentStep && (
                        <div>
                            <div className="border border-gray-200 rounded p-4 mb-6 bg-white">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                                    <Tag className="w-5 h-5 text-[#00BFA5]" />
                                    <div>
                                        <span className="font-bold text-sm text-[#111111]">Bank Offer</span>
                                        <p className="text-xs text-gray-500">10% Instant Discount on IDFC FIRST SWYP Credit Card on min spend of ₹850</p>
                                    </div>
                                </div>
                                
                                <h2 className="text-base font-bold text-[#111111] mb-4">Choose Payment Mode</h2>
                                
                                <div className="flex border border-gray-200 rounded overflow-hidden">
                                    {/* Payment Sidebar */}
                                    <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col">
                                        <button 
                                            onClick={() => setSelectedPayment('cod')}
                                            className={`py-4 px-4 text-left text-sm font-bold border-l-4 transition-colors ${selectedPayment === 'cod' ? 'border-[#FF6A00] bg-white text-[#FF6A00]' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            Cash On Delivery
                                        </button>
                                        <button 
                                            onClick={() => setSelectedPayment('upi')}
                                            className={`py-4 px-4 text-left text-sm font-bold border-l-4 transition-colors ${selectedPayment === 'upi' ? 'border-[#FF6A00] bg-white text-[#FF6A00]' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            UPI (Google Pay)
                                        </button>
                                        <button 
                                            onClick={() => setSelectedPayment('cards')}
                                            className={`py-4 px-4 text-left text-sm font-bold border-l-4 transition-colors ${selectedPayment === 'cards' ? 'border-[#FF6A00] bg-white text-[#FF6A00]' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            Credit/Debit Card
                                        </button>
                                    </div>

                                    {/* Payment Content */}
                                    <div className="flex-1 p-6 bg-white">
                                        {selectedPayment === 'cod' && (
                                            <div className="animate-in fade-in duration-300">
                                                <h3 className="font-bold text-[#111111] mb-2">Cash on Delivery (Cash/UPI)</h3>
                                                <p className="text-sm text-gray-500 mb-6">Pay when you receive the order.</p>
                                                <button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full bg-[#FF6A00] hover:bg-[#E65C00] text-white py-3.5 rounded text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2">
                                                    {isProcessing ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                                                    PLACE ORDER
                                                </button>
                                            </div>
                                        )}

                                        {selectedPayment === 'upi' && (
                                            <div className="animate-in fade-in duration-300">
                                                <h3 className="font-bold text-[#111111] mb-2">Pay via UPI</h3>
                                                <p className="text-sm text-gray-500 mb-6">Enter your UPI ID to receive a payment request.</p>
                                                <input type="text" placeholder="Enter UPI ID (e.g. name@bank)" className="w-full border border-gray-300 rounded px-4 py-3 text-sm mb-6 focus:outline-none focus:border-[#FF6A00]" />
                                                <button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full bg-[#FF6A00] hover:bg-[#E65C00] text-white py-3.5 rounded text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2">
                                                    {isProcessing ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                                                    PAY NOW
                                                </button>
                                            </div>
                                        )}

                                        {selectedPayment === 'cards' && (
                                            <div className="animate-in fade-in duration-300">
                                                <h3 className="font-bold text-[#111111] mb-2">Credit/Debit Card</h3>
                                                <p className="text-sm text-gray-500 mb-6">Please ensure your card is active for online transactions.</p>
                                                <input type="text" placeholder="Card Number" className="w-full border border-gray-300 rounded px-4 py-3 text-sm mb-4 focus:outline-none focus:border-[#FF6A00]" />
                                                <div className="flex gap-4 mb-6">
                                                    <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#FF6A00]" />
                                                    <input type="text" placeholder="CVV" className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#FF6A00]" />
                                                </div>
                                                <button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full bg-[#FF6A00] hover:bg-[#E65C00] text-white py-3.5 rounded text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2">
                                                    {isProcessing ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                                                    PAY NOW
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Column: Pricing Summary */}
                <div className="w-full md:w-[340px] flex-shrink-0">
                    {/* Delivery Estimates */}
                    <div className="mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">DELIVERY ESTIMATES</span>
                        <div className="flex items-start gap-3">
                            <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <span className="text-sm font-bold text-[#111111]">Estimated delivery by <span className="text-[#00BFA5]">20 Aug 2026</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">PRICE DETAILS ({cart.length} Items)</span>
                        
                        <div className="space-y-3 text-sm text-[#111111] mb-4">
                            <div className="flex justify-between">
                                <span>Total MRP</span>
                                <span>₹{totalMRP}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount on MRP</span>
                                <span className="text-[#00BFA5]">- ₹{totalDiscount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coupon Discount</span>
                                <span className="text-[#FF6A00] cursor-pointer">Apply Coupon</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>₹23</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Fee</span>
                                <span className="text-[#00BFA5]">FREE</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-[#111111] text-base">Total Amount</span>
                                <span className="font-bold text-[#111111] text-base">₹{totalAmount}</span>
                            </div>
                        </div>

                        {isAddressStep && (
                            <button 
                                onClick={handleNext}
                                className="w-full bg-[#FF6A00] hover:bg-[#E65C00] text-white py-3.5 rounded text-sm font-bold tracking-widest uppercase transition-colors"
                            >
                                CONTINUE
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
