import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { Heart, X, ArrowLeft } from 'lucide-react';
import { marketplaceProducts } from '@/lib/marketplaceData';
import ProductVariantModal from '../ui/ProductVariantModal';
import { Product } from '@/lib/api';
import AuthGate from '../ui/AuthGate';

export default function WishlistView() {
    const { wishlist, addToCart, toggleWishlist, navigate } = useStore();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const wishlistProducts = marketplaceProducts.filter(p => wishlist.includes(p.id as any));

    const handleMoveToBag = (product: any) => {
        setSelectedProduct(product as Product);
    };

    const handleConfirmSize = (size: string) => {
        if (selectedProduct) {
            addToCart(selectedProduct, 1, size);
            toggleWishlist(selectedProduct.id); // Remove from wishlist after moving to bag
        }
    };

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
                    <h1 className="text-xl md:text-2xl font-bold text-[#111111]">Your Wishlist</h1>
                </div>
            </div>
        <AuthGate
            icon={<Heart className="w-10 h-10 text-rose-400" />}
            pageName="Wishlist"
            subtitle="Save your favourite products and access them anytime after logging in."
        >
            {wishlistProducts.length === 0 ? (
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full mt-4">
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4 bg-white rounded-3xl border border-[#ECECEC] p-8 shadow-sm">
                        <div className="w-20 h-20 bg-[#F8F8F8] border border-[#ECECEC] rounded-full flex items-center justify-center mb-2">
                            <Heart className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#111111]">No favorites yet</h2>
                        <p className="text-gray-500 max-w-md">Tap the heart icon on any product to save it for later.</p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                            <button 
                                onClick={() => navigate('home')}
                                className="px-8 py-3 bg-[#FF6A00] hover:bg-[#E65C00] text-white rounded-full font-bold transition-all shadow-sm w-full sm:w-auto"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full bg-white min-h-screen text-[#111111] py-8 pb-32 font-sans">
                    <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8">
                        <div className="flex items-center gap-3 mb-8">
                            <h1 className="text-xl font-bold text-[#111111]">
                                My Wishlist <span className="font-normal text-gray-500">{wishlistProducts.length} items</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {wishlistProducts.map((product) => (
                                <div key={product.id} className="min-w-0 max-w-full flex flex-col border border-gray-100 hover:shadow-lg transition-shadow bg-white relative group">
                                    
                                    {/* Remove Button */}
                                    <button 
                                        onClick={() => toggleWishlist(product.id as any)}
                                        className="absolute top-2 right-2 z-10 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Image */}
                                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 cursor-pointer" onClick={() => navigate('product', product as any)}>
                                        <img 
                                            src={product.image} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 text-center border-t border-gray-100 flex-1 flex flex-col justify-center">
                                        <h3 className="text-xs text-gray-500 truncate font-medium mb-1">{product.title}</h3>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-sm font-bold text-[#111111]">Rs.{Math.floor(product.price)}</span>
                                            <span className="text-xs text-gray-400 line-through">Rs.{Math.floor(product.price * 1.5)}</span>
                                            <span className="text-[10px] font-bold text-[#FF6A00]">(33% OFF)</span>
                                        </div>
                                    </div>

                                    {/* Move to Cart */}
                                    <button 
                                        onClick={() => handleMoveToBag(product)}
                                        className="w-full py-2.5 text-xs font-bold tracking-widest text-[#FF6A00] uppercase hover:bg-[#FF6A00] hover:text-white transition-colors border-t border-gray-100"
                                    >
                                        MOVE TO CART
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedProduct && (
                        <ProductVariantModal
                            isOpen={!!selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                            product={selectedProduct}
                            onConfirm={handleConfirmSize}
                        />
                    )}
                </div>
            )}
        </AuthGate>
        </div>
    );
}
