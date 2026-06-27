import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetailsView() {
    const { selectedProduct, navigate, addToCart, toggleWishlist, wishlist, formatPrice } = useStore();
    const [currentImage, setCurrentImage] = useState(0);

    if (!selectedProduct) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 h-[70vh]">
                <p className="text-gray-500">Product not found.</p>
                <button onClick={() => navigate('home')} className="mt-4 text-blue-600 font-bold hover:underline">Return Home</button>
            </div>
        );
    }

    const isWishlisted = wishlist.includes(selectedProduct.id);
    const images = selectedProduct.images && selectedProduct.images.length > 0 
        ? selectedProduct.images 
        : [selectedProduct.image];

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-4 md:py-8 pb-32">
            <button 
                onClick={() => navigate('home')} 
                className="mb-6 p-3 bg-gray-50 hover:bg-gray-100 rounded-full inline-flex items-center gap-2 transition-colors font-medium text-sm text-gray-700"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Image Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full aspect-square bg-gray-50 rounded-[2rem] p-8 flex items-center justify-center relative overflow-hidden"
                    >
                        <button 
                            onClick={() => toggleWishlist(selectedProduct.id)}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center z-10 hover:scale-105 active:scale-95 transition-all"
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
                                    className={`w-20 h-20 rounded-xl bg-gray-50 border-2 overflow-hidden flex-shrink-0 transition-all ${currentImage === i ? 'border-[#1e3a8a] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="thumbnail" className="w-full h-full object-cover mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8">
                    <div className="flex items-center gap-2 mb-4">
                        {selectedProduct.brand && <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{selectedProduct.brand}</span>}
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{selectedProduct.category}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
                        {selectedProduct.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg">{selectedProduct.rating}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500 font-medium underline decoration-gray-300 underline-offset-4">{selectedProduct.reviews} reviews</span>
                    </div>

                    <div className="flex items-end gap-4 mb-8">
                        <span className="text-5xl font-black text-gray-900">{formatPrice(selectedProduct.price)}</span>
                        {selectedProduct.originalPrice && (
                            <span className="text-xl text-gray-400 font-bold line-through mb-1">{formatPrice(selectedProduct.originalPrice)}</span>
                        )}
                        {selectedProduct.discount && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded font-black text-sm mb-2">{selectedProduct.discount}</span>
                        )}
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed mb-10">
                        {selectedProduct.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <button 
                            onClick={() => {
                                addToCart(selectedProduct);
                                navigate('cart');
                            }}
                            className="flex-1 bg-black text-white px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10"
                        >
                            Buy Now
                        </button>
                        <button 
                            onClick={() => {
                                addToCart(selectedProduct);
                                alert(`${selectedProduct.title} added to cart!`);
                            }}
                            className="sm:w-32 bg-white text-black border-2 border-gray-200 px-8 py-5 rounded-2xl font-bold flex items-center justify-center hover:border-black transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <ShoppingCart className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Features/Trust */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-8 mt-auto">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Truck className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">Free Next-Day Delivery</h4>
                                <p className="text-xs text-gray-500 mt-1">Available for Prime members</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><ShieldCheck className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">2-Year AI Warranty</h4>
                                <p className="text-xs text-gray-500 mt-1">Automatic replacement guarantee</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><RotateCcw className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">30-Day Returns</h4>
                                <p className="text-xs text-gray-500 mt-1">No questions asked</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
