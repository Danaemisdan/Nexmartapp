import React from 'react';
import Hero from '../dashboard/Hero';
import CategoriesRow from '../dashboard/CategoriesRow';
import TrustBadges from '../dashboard/TrustBadges';
import ProductCarousel from '../dashboard/ProductCarousel';
import { useStore } from '@/lib/StoreContext';

interface HomeViewProps {
    aiProducts: any[];
}

export default function HomeView({ aiProducts }: HomeViewProps) {
    const { products, navigate, addToCart } = useStore();

    // Take the first 10 for deals, and next 10 for picks
    const dealsProducts = products.slice(0, 10);
    const picksProducts = products.slice(10, 20);

    return (
        <div className="flex flex-col pb-24 md:pb-10">
            <Hero />
            <CategoriesRow />
            <TrustBadges />

            {/* If AI has outputted products from a search, show those, otherwise show Deals and Picks */}
            {aiProducts.length > 0 ? (
                <ProductCarousel 
                    title="AI Search Results" 
                    subtitle={`Found ${aiProducts.length} items based on your request.`}
                    products={aiProducts} 
                    type="deals"
                    onProductClick={(p) => navigate('product', p)}
                    onAddToCart={(p) => addToCart(p)}
                />
            ) : (
                <>
                    <ProductCarousel 
                        title={<span>🔥 Today's Best Deals</span>} 
                        products={dealsProducts} 
                        type="deals"
                        onProductClick={(p) => navigate('product', p)}
                        onAddToCart={(p) => addToCart(p)}
                    />
                    <ProductCarousel 
                        title={<span>✨ AI Picks for You</span>} 
                        subtitle="Handpicked by Nexmart AI based on your preferences"
                        products={picksProducts} 
                        type="ai_picks"
                        onProductClick={(p) => navigate('product', p)}
                        onAddToCart={(p) => addToCart(p)}
                    />
                </>
            )}
        </div>
    );
}
