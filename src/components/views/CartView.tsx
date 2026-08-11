import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/StoreContext';
import { X, ChevronRight, ChevronLeft, ShieldCheck, Tag, Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import AuthGate from '../ui/AuthGate';


export default function CartView() {
    const { cart, removeFromCart, updateCartQuantity, navigate, toggleWishlist } = useStore();
    const { isLoaded, isSignedIn } = useAuth();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    
    // Auto-select items when they are added to cart
    useEffect(() => {
        const newSelected = cart.map(item => item.product.id);
        setSelectedItems(newSelected);
    }, [cart.length]);

    const handleSelectAll = () => {
        if (selectedItems.length === cart.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.map(item => item.product.id));
        }
    };

    const handleSelectItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleBulkRemove = () => {
        selectedItems.forEach(id => removeFromCart(id));
        setSelectedItems([]);
    };

    const handleBulkMoveToWishlist = () => {
        selectedItems.forEach(id => {
            const item = cart.find(c => c.product.id === id);
            if (item) {
                toggleWishlist(item.product.id);
                removeFromCart(id);
            }
        });
        setSelectedItems([]);
    };

    const totalMRP = cart.reduce((sum, item) => sum + (Math.floor(item.product.price * 1.5) * item.quantity), 0);
    const totalDiscount = cart.reduce((sum, item) => sum + ((Math.floor(item.product.price * 1.5) - item.product.price) * item.quantity), 0);
    const totalAmount = totalMRP - totalDiscount + 23; // 23 is platform fee

    const handleCheckout = () => {
        navigate('checkout_address');
    };

    if (cart.length === 0) {
        if (!isLoaded) return <div className="h-[70vh] flex items-center justify-center">Loading...</div>;
        // Guest with empty cart → show login nudge
        if (!isSignedIn) {
            return (
                <div className="flex flex-col h-full bg-[#F8F8F8] pb-24 md:pb-0 min-h-screen text-[#111111]">
                    <div className="sticky top-0 bg-white border-b border-[#ECECEC] z-10 px-6 py-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4 max-w-[1400px] mx-auto w-full">
                            <button 
                                onClick={() => navigate('home')}
                                className="p-2 -ml-2 bg-white hover:bg-gray-50 border border-[#ECECEC] text-[#111111] rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl md:text-2xl font-bold text-[#111111]">Your Cart</h1>
                        </div>
                    </div>
                <AuthGate
                    icon={<ShoppingBag className="w-10 h-10 text-gray-400" />}
                    pageName="Cart"
                    subtitle="Login to save your cart across devices and get exclusive member discounts."
                >
                    {/* This is never shown since AuthGate shows the gate */}
                    <></>
                </AuthGate>
                </div>
            );
        }
        // Signed-in user with empty cart
        return (
            <div className="flex flex-col h-full bg-[#F8F8F8] pb-24 md:pb-0 min-h-screen text-[#111111]">
                <div className="sticky top-0 bg-white border-b border-[#ECECEC] z-10 px-6 py-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4 max-w-[1400px] mx-auto w-full">
                        <button 
                            onClick={() => navigate('home')}
                            className="p-2 -ml-2 bg-white hover:bg-gray-50 border border-[#ECECEC] text-[#111111] rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-[#111111]">Your Cart</h1>
                    </div>
                </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full mt-4">
                <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4 bg-white rounded-3xl border border-[#ECECEC] p-8 shadow-sm">
                    <div className="w-20 h-20 bg-[#F8F8F8] border border-[#ECECEC] rounded-full flex items-center justify-center mb-2">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#111111]">Hey, it feels so light!</h2>
                    <p className="text-gray-500 max-w-md">There is nothing in your cart. Let's add some items.</p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                        <button 
                            onClick={() => navigate('wishlist')}
                            className="px-8 py-3 bg-white text-[#FF6A00] border-2 border-[#FF6A00] hover:bg-[#FF6A00] hover:text-white rounded-full font-bold transition-all shadow-sm w-full sm:w-auto"
                        >
                            Add Items from Wishlist
                        </button>
                        <button 
                            onClick={() => navigate('home')}
                            className="px-8 py-3 bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full font-bold transition-all shadow-sm w-full sm:w-auto"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white min-h-screen text-[#111111] font-sans pb-32">
            {/* Header / Progress Bar */}
            <div className="sticky top-0 bg-white border-b border-[#ECECEC] z-40 px-6 py-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4 w-1/3">
                    <button 
                        onClick={() => navigate('home')}
                        className="p-2 -ml-2 bg-white hover:bg-gray-50 border border-[#ECECEC] text-[#111111] rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-[#111111] hidden md:block">Your Cart</h1>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase justify-center flex-1">
                    <span className="text-[#00BFA5] border-b-2 border-[#00BFA5] pb-1">CART</span>
                    <span className="text-gray-300">----------</span>
                    <span className="text-gray-500">ADDRESS</span>
                    <span className="text-gray-300">----------</span>
                    <span className="text-gray-500">PAYMENT</span>
                </div>
                <div className="flex-1 flex justify-end w-1/3">
                    <div className="flex items-center gap-1 text-gray-500">
                        <ShieldCheck className="w-5 h-5 text-[#00BFA5]" />
                        <span className="text-xs font-bold tracking-widest uppercase">100% SECURE</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto w-full px-4 pt-8 flex flex-col md:flex-row gap-8">
                
                {/* Left Column: Items */}
                <div className="flex-1 pr-0 md:pr-4">
                    {/* Delivery Pin Code */}
                    <div className="border border-gray-200 rounded p-4 flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-[#111111]">Check delivery time & services</span>
                        <button className="text-xs font-bold text-[#FF6A00] border border-[#FF6A00] px-4 py-2 rounded">
                            ENTER PIN CODE
                        </button>
                    </div>

                    {/* Offers */}
                    <div className="border border-gray-200 rounded p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-[#111111]" />
                            <span className="font-bold text-sm text-[#111111]">Offers (14)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer" />
                            <div className="flex-1 flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-[#111111]">10% Instant Discount</p>
                                    <p className="text-xs text-gray-500">On IDFC FIRST SWYP Credit Card on min spend of ₹850</p>
                                    <button className="text-xs font-bold text-[#FF6A00] mt-1">View Eligible Styles {'>'}</button>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
                        </div>
                    </div>

                    {/* Selection Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleSelectAll}>
                            <input type="checkbox" checked={selectedItems.length === cart.length && cart.length > 0} onChange={handleSelectAll} className="accent-[#FF6A00] w-4 h-4 cursor-pointer" />
                            <span className="font-bold text-sm text-[#111111]">{selectedItems.length}/{cart.length} ITEMS SELECTED</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <button onClick={handleBulkRemove} className="hover:text-[#111111] transition-colors" disabled={selectedItems.length === 0}>REMOVE</button>
                            <span className="w-px h-3 bg-gray-300" />
                            <button onClick={handleBulkMoveToWishlist} className="hover:text-[#111111] transition-colors" disabled={selectedItems.length === 0}>MOVE TO WISHLIST</button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="border border-gray-200 rounded mb-4 divide-y divide-gray-100">
                        {cart.map((item, idx) => (
                            <div key={`${item.product.id}-${idx}`} className="p-4 relative hover:bg-gray-50 transition-colors">
                                <button 
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-[#111111] p-1 bg-white hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <input type="checkbox" checked={selectedItems.includes(item.product.id)} onChange={() => handleSelectItem(item.product.id)} className="accent-[#FF6A00] w-4 h-4 absolute top-2 left-2 z-10 cursor-pointer" />
                                        <img src={item.product.image} alt={item.product.title} className="w-28 h-36 object-contain bg-white border border-gray-100" />
                                    </div>
                                    <div className="flex-1 pr-8">
                                        <h3 className="font-bold text-sm text-[#111111] truncate mb-1">{item.product.title}</h3>
                                        <p className="text-xs text-gray-500 mb-2">Sold by: Nexmart Verified</p>
                                        
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-2 py-1 rounded flex items-center gap-1 text-xs font-bold text-[#111111]">
                                                Size: {item.size || 'M'} <ChevronDown className="w-3 h-3" />
                                            </div>
                                            <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-2 py-1 rounded flex items-center gap-1 text-xs font-bold text-[#111111]">
                                                Qty: {item.quantity} <ChevronDown className="w-3 h-3" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-sm text-[#111111]">₹{Math.floor(item.product.price)}</span>
                                            <span className="text-xs text-gray-400 line-through">₹{Math.floor(item.product.price * 1.5)}</span>
                                            <span className="text-xs font-bold text-[#FF6A00]">(33% OFF)</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                            <span className="font-bold">14 days</span> return available
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add More from Wishlist */}
                    <div 
                        onClick={() => navigate('wishlist')}
                        className="border border-gray-200 rounded p-4 flex items-center justify-between cursor-pointer hover:shadow-sm hover:border-gray-300 transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-gray-500" />
                            <span className="font-bold text-sm text-[#111111]">Add More From Wishlist</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Right Column: Pricing & Checkout */}
                <div className="w-full md:w-[340px] flex-shrink-0">
                    
                    {/* Coupons */}
                    <div className="mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">COUPONS</span>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Tag className="w-5 h-5 text-[#111111]" />
                                <span className="font-bold text-sm text-[#111111]">Apply Coupons</span>
                            </div>
                            <button className="text-xs font-bold text-[#FF6A00] border border-[#FF6A00] px-4 py-1.5 rounded uppercase hover:bg-orange-50 transition-colors">
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Donation */}
                    <div className="mb-6">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">SUPPORT TRANSFORMATIVE SOCIAL WORK</span>
                        <div className="flex items-center gap-2 mb-3">
                            <input type="checkbox" className="w-4 h-4 accent-[#FF6A00]" />
                            <span className="font-bold text-sm text-[#111111]">Donate and make a difference</span>
                        </div>
                        <div className="flex gap-3 mb-2">
                            {['₹10', '₹20', '₹50', '₹100'].map(amt => (
                                <button key={amt} className="flex-1 py-2 border border-gray-200 rounded-full text-sm font-bold text-[#111111] hover:border-[#FF6A00]">
                                    {amt}
                                </button>
                            ))}
                        </div>
                        <button className="text-xs font-bold text-[#FF6A00]">Know More</button>
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
                                <span className="text-[#FF6A00] cursor-pointer hover:underline">Apply Coupon</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee <span className="text-[#FF6A00] text-xs cursor-pointer ml-1 hover:underline">Know More</span></span>
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

                        <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                            By placing the order, you agree to Nexmart's <span className="text-[#FF6A00] font-bold cursor-pointer hover:underline">Terms of Use</span> and <span className="text-[#FF6A00] font-bold cursor-pointer hover:underline">Privacy Policy</span>
                        </p>

                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-[#FF6A00] hover:bg-[#E65C00] text-white py-3.5 rounded text-sm font-bold tracking-widest uppercase transition-colors"
                        >
                            PLACE ORDER
                        </button>
                    </div>
                </div>

            </div>

            {/* You May Also Like */}
            <div className="bg-rose-50/50 mt-12 py-8 border-t border-rose-100">
                <div className="max-w-[1000px] mx-auto px-4">
                    <h3 className="text-base font-bold text-[#111111] mb-4">You may also like:</h3>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                        {['All', 'Lipstick', 'Perfume', 'Earrings', 'Cups and Mugs', 'Assorted Gifts', 'Handbags', 'Watches', 'Jewellery Set'].map((cat, i) => (
                            <button 
                                key={cat}
                                className={`px-4 py-2 border rounded-full whitespace-nowrap text-sm font-bold transition-colors
                                    ${i === 0 ? 'border-[#FF6A00] text-[#FF6A00] bg-white' : 'border-gray-200 text-[#111111] bg-white hover:border-gray-400'}
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Temporary ChevronDown since it was missing in lucide import
function ChevronDown(props: any) {
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
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}
