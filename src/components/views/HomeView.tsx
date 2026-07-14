import React from 'react';
import AmazonStyleCarousel from '../dashboard/AmazonStyleCarousel';
import CategoriesRow from '../dashboard/CategoriesRow';
import TrustBadges from '../dashboard/TrustBadges';
import ProductCarousel from '../dashboard/ProductCarousel';
import { useStore } from '@/lib/StoreContext';

interface HomeViewProps {
    aiProducts: any[];
}

export default function HomeView({ aiProducts }: HomeViewProps) {
    const { products, navigate, addToCart } = useStore();

    // Filter out the AI enriched products to showcase them
    const newProducts = products.filter((p: any) => p.description && p.description.length > 15).slice(0, 10);
    const dealsProducts = products.slice(0, 10);
    const picksProducts = products.slice(10, 20);

    return (
        <div className="flex flex-col pb-24 md:pb-10">
            <AmazonStyleCarousel />

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
                    {newProducts.length > 0 && (
                        <ProductCarousel 
                            title={<span>🆕 New Products</span>} 
                            subtitle="Freshly updated with AI descriptions and images!"
                            products={newProducts} 
                            type="deals"
                            onProductClick={(p) => navigate('product', p)}
                            onAddToCart={(p) => addToCart(p)}
                        />
                    )}
                    
                    <ProductCarousel 
                        title={<span>🔥 Today's Best Deals</span>} 
                        products={dealsProducts} 
                        type="deals"
                        onProductClick={(p) => navigate('product', p)}
                        onAddToCart={(p) => addToCart(p)}
                    />
                    
                    <CategoriesRow />
                    
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
            
            <TrustBadges />
        </div>
    );
}
