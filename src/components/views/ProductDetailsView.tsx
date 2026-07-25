import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductDetailsView() {
    const { selectedProduct, navigate, addToCart, toggleWishlist, wishlist, formatPrice } = useStore();
    const [currentImage, setCurrentImage] = useState(0);

    if (!selectedProduct) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 h-[70vh]">
                <p className="text-gray-400">Product not found.</p>
                <button onClick={() => navigate('home')} className="mt-4 text-yellow-400 font-bold hover:underline">Return Home</button>
            </div>
        );
    }

    const isWishlisted = wishlist.includes(selectedProduct.id);
    const images = selectedProduct.images && selectedProduct.images.length > 0 
        ? selectedProduct.images 
        : [selectedProduct.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80'];

    const brand = selectedProduct.brand || 'Generic';
    const hasRating = selectedProduct.rating !== undefined && selectedProduct.rating !== null && !isNaN(selectedProduct.rating);
    const description = selectedProduct.description || 'No description available.';

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-4 md:py-8 pb-32">
            <button 
                onClick={() => navigate('home')} 
                className="mb-6 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full inline-flex items-center gap-2 transition-colors font-medium text-sm text-white"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Image Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full aspect-square bg-white/95 rounded-[2rem] p-8 flex items-center justify-center relative overflow-hidden shadow-2xl border border-white/20"
                    >
                        <button 
                            onClick={() => toggleWishlist(selectedProduct.id)}
                            aria-label={`${isWishlisted ? 'Remove from' : 'Add to'} wishlist`}
                            className="absolute top-6 right-6 w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center z-10 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 border border-white/20"
                        >
                            <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                        </button>
                        
                        <AnimatePresence mode="wait">
                                <motion.img 
                                    key={currentImage}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    src={images[currentImage]} 
                                    alt={selectedProduct.title} 
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80';
                                    }}
                                    className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-2xl" 
                                />
                        </AnimatePresence>
                    </motion.div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                            {images.map((img, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentImage(i)}
                                    aria-label={`View image ${i + 1}`}
                                    className={`w-20 h-20 rounded-xl bg-white/90 border-2 overflow-hidden flex-shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${currentImage === i ? 'border-yellow-400 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
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

                {/* Product Info */}
                <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-white/15 text-white font-extrabold border border-white/20 px-3 py-1 rounded-full text-xs uppercase tracking-wider drop-shadow-sm">{brand}</span>
                        <span className="bg-sky-500/20 text-sky-200 border border-sky-400/40 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider drop-shadow-sm">{selectedProduct.category || 'General'}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        {selectedProduct.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                            <span className="font-bold text-lg text-white drop-shadow-sm">{hasRating ? selectedProduct.rating : 'New'}</span>
                        </div>
                        {hasRating && (
                            <>
                                <span className="text-white/30">|</span>
                                <span className="text-white/80 font-semibold underline decoration-white/40 hover:text-white transition-colors underline-offset-4">{selectedProduct.reviews || 0} reviews</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-end gap-4 mb-8 flex-wrap">
                        <span className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">{formatPrice(selectedProduct.price)}</span>
                        {selectedProduct.originalPrice && (
                            <span className="text-lg md:text-xl text-white/60 font-bold line-through mb-1">{formatPrice(selectedProduct.originalPrice)}</span>
                        )}
                        {selectedProduct.discount && (
                            <span className="bg-red-500 text-white px-2.5 py-1 rounded font-black text-sm mb-2 shadow-md">{selectedProduct.discount}</span>
                        )}
                    </div>

                    <p className="text-white/90 text-base md:text-lg leading-relaxed mb-10 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {description}
                    </p>

                    <div className="flex flex-col gap-3 mb-12">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={() => {
                                    addToCart(selectedProduct);
                                    navigate('cart');
                                }}
                                className="flex-1 bg-white text-black px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/10"
                            >
                                Buy Now
                            </button>
                            <button 
                                onClick={() => {
                                    addToCart(selectedProduct);
                                    toast.success(`${selectedProduct.title} added to cart!`);
                                }}
                                aria-label="Add to cart"
                                className="sm:w-32 bg-white/10 text-white border border-white/20 px-8 py-5 rounded-2xl font-bold flex items-center justify-center hover:bg-white/20 hover:border-white/40 transition-all hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
                            >
                                <ShoppingCart className="w-6 h-6" />
                            </button>
                        </div>
                        <button 
                            onClick={() => toast.success('Checking your Nexmart Credit limit...', { icon: '✨' })}
                            className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/30"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
                            <Sparkles className="w-5 h-5 text-yellow-200 drop-shadow-md" />
                            Buy Now, Pay Later
                        </button>
                    </div>

                    {/* Features/Trust */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-8 mt-auto">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30"><Truck className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-sm text-white">Free Next-Day Delivery</h4>
                                <p className="text-xs text-white/80 font-medium mt-1">Available for Prime members</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-sky-500/20 rounded-lg text-sky-300 border border-sky-400/40"><ShieldCheck className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-sm text-white">2-Year AI Warranty</h4>
                                <p className="text-xs text-white/80 font-medium mt-1">Automatic replacement guarantee</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30"><RotateCcw className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-sm text-white">30-Day Returns</h4>
                                <p className="text-xs text-white/80 font-medium mt-1">No questions asked</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
