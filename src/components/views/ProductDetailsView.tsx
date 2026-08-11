import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductDetailsView() {
    const { selectedProduct, navigate, addToCart, toggleWishlist, wishlist, formatPrice } = useStore();
    const [currentImage, setCurrentImage] = useState(0);

    if (!selectedProduct) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 h-[70vh] bg-white w-full">
                <p className="text-gray-500">Product not found.</p>
                <button onClick={() => navigate('home')} className="mt-4 text-[#FF6A00] font-bold hover:underline">Return Home</button>
            </div>
        );
    }

    const isWishlisted = wishlist.includes(selectedProduct.id);
    const images = selectedProduct.images && selectedProduct.images.length > 0 
        ? selectedProduct.images 
        : [selectedProduct.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80'];

    const brand = selectedProduct.brand || 'Nexmart';
    const hasRating = selectedProduct.rating !== undefined && selectedProduct.rating !== null && !isNaN(selectedProduct.rating);
    const description = selectedProduct.description || 'No description available.';

    return (
        <div className="w-full min-h-screen bg-white text-[#111111] pb-32 pt-6">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
                {/* Breadcrumb / Back Navigation */}
                <div className="flex items-center gap-2 mb-8 text-gray-500 text-sm font-medium">
                    <button onClick={() => navigate('home')} className="hover:text-[#111111] transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </button>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                    <span className="capitalize">{selectedProduct.category || 'General'}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                    <span className="truncate max-w-[200px] text-[#111111]">{selectedProduct.title}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* LEFT COLUMN: Large Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full aspect-[4/3] sm:aspect-square bg-[#F8F8F8] rounded-3xl p-8 sm:p-12 flex items-center justify-center relative overflow-hidden border border-[#ECECEC] group"
                        >
                            <button 
                                onClick={() => toggleWishlist(selectedProduct.id)}
                                aria-label={`${isWishlisted ? 'Remove from' : 'Add to'} wishlist`}
                                className="absolute top-6 right-6 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center z-10 hover:scale-105 active:scale-95 transition-all focus:outline-none border border-[#ECECEC] shadow-sm"
                            >
                                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-[#FF6A00] text-[#FF6A00]' : 'text-gray-400 hover:text-[#FF6A00]'}`} />
                            </button>
                            
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={currentImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    src={images[currentImage]} 
                                    alt={selectedProduct.title} 
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80';
                                    }}
                                    className="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" 
                                />
                            </AnimatePresence>
                        </motion.div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                {images.map((img, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setCurrentImage(i)}
                                        aria-label={`View image ${i + 1}`}
                                        className={`w-24 h-24 rounded-2xl bg-[#F8F8F8] border-2 overflow-hidden flex-shrink-0 transition-all focus:outline-none ${currentImage === i ? 'border-[#FF6A00] shadow-md opacity-100' : 'border-transparent opacity-50 hover:opacity-100 hover:border-[#ECECEC]'}`}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`Thumbnail ${i + 1}`} 
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80';
                                            }}
                                            className="w-full h-full object-cover mix-blend-multiply" 
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Product Info & Actions */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-4">
                        <div className="mb-8">
                            <h2 className="text-sm font-bold text-[#FF6A00] uppercase tracking-wider mb-3 flex items-center gap-2">
                                {brand}
                                {selectedProduct.category && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500">{selectedProduct.category}</span>
                                    </>
                                )}
                            </h2>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] leading-tight mb-4">
                                {selectedProduct.title}
                            </h1>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-white border border-[#ECECEC] px-3 py-1.5 rounded-full">
                                    <Star className="w-4 h-4 fill-[#FF6A00] text-[#FF6A00]" />
                                    <span className="font-bold text-sm text-[#111111]">{hasRating ? selectedProduct.rating : 'New'}</span>
                                </div>
                                {hasRating && (
                                    <span className="text-gray-500 text-sm font-medium hover:text-[#111111] cursor-pointer transition-colors underline underline-offset-4 decoration-gray-200 hover:decoration-gray-400">
                                        {selectedProduct.reviews || 0} Reviews
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-[#F8F8F8] border border-[#ECECEC] rounded-3xl p-6 sm:p-8 mb-8">
                            <div className="flex items-end gap-4 flex-wrap mb-2">
                                <span className="text-4xl sm:text-5xl font-black text-[#111111]">{formatPrice(selectedProduct.price)}</span>
                                {selectedProduct.originalPrice && (
                                    <span className="text-xl text-gray-500 font-bold line-through mb-1.5">{formatPrice(selectedProduct.originalPrice)}</span>
                                )}
                            </div>
                            {selectedProduct.discount && (
                                <div className="inline-block bg-[#FF6A00]/10 text-[#FF6A00] px-3 py-1 rounded-full font-bold text-sm mb-4">
                                    Save {selectedProduct.discount}
                                </div>
                            )}
                            
                            <p className="text-gray-600 text-sm font-medium mb-6 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#FF6A00]" />
                                In stock and ready to ship
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => {
                                        addToCart(selectedProduct);
                                        navigate('checkout');
                                    }}
                                    className="flex-1 bg-[#FF6A00] hover:bg-[#E65C00] text-white px-8 py-4 sm:py-5 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
                                >
                                    Buy Now
                                </button>
                                <button 
                                    onClick={() => {
                                        addToCart(selectedProduct);
                                        toast.success(`${selectedProduct.title} added to cart!`);
                                    }}
                                    className="flex-1 bg-white hover:bg-gray-50 text-[#111111] border border-[#ECECEC] px-8 py-4 sm:py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <h3 className="text-xl font-black mb-4">About this product</h3>
                            <p className="text-gray-600 text-base leading-relaxed font-medium">
                                {description}
                            </p>
                        </div>

                        {/* Modern Specification Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#ECECEC] pt-10">
                            <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                                <Truck className="w-6 h-6 text-[#FF6A00] mb-3" />
                                <h4 className="font-bold text-[#111111] text-sm mb-1">Fast Delivery</h4>
                                <p className="text-gray-500 text-xs">Arrives in 2-3 days</p>
                            </div>
                            <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                                <ShieldCheck className="w-6 h-6 text-[#FF6A00] mb-3" />
                                <h4 className="font-bold text-[#111111] text-sm mb-1">Warranty</h4>
                                <p className="text-gray-500 text-xs">1 Year Included</p>
                            </div>
                            <div className="bg-white border border-[#ECECEC] rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                                <RotateCcw className="w-6 h-6 text-[#FF6A00] mb-3" />
                                <h4 className="font-bold text-[#111111] text-sm mb-1">Free Returns</h4>
                                <p className="text-gray-500 text-xs">30-day guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
