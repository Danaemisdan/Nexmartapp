import React from 'react';
import { motion, Variants } from 'framer-motion';
import MarketplaceBannerCarousel from '../dashboard/MarketplaceBannerCarousel';
import CategoryGrid from '../dashboard/CategoryGrid';
import ProductShelf from '../dashboard/ProductShelf';
import { getFeaturedProducts, getProductsByCategory } from '@/lib/marketplaceData';
import { getCategoryColor } from '@/lib/theme';

interface HomeViewProps {
    aiProducts: any[];
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

export default function HomeView({ aiProducts }: HomeViewProps) {
    const todayDeals = getFeaturedProducts();
    const furniture = getProductsByCategory('furniture');
    const fashion = getProductsByCategory('fashion');
    const electronics = getProductsByCategory('electronics');
    const beauty = getProductsByCategory('beauty');
    const groceries = getProductsByCategory('groceries');
    const medicine = getProductsByCategory('medicine');
    const sports = getProductsByCategory('sports');

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full flex flex-col bg-white px-4 md:px-8 lg:px-12 py-4 gap-6 pb-24"
        >
            {/* 1. Large Promotional Carousel */}
            <MarketplaceBannerCarousel />

            {/* 2. Featured Categories */}
            <CategoryGrid />

            {/* 3. Today's Deals Shelf */}
            <ProductShelf 
                title="Today's Deals" 
                products={todayDeals} 
                variant="deal" 
                backgroundColor={getCategoryColor('deals')} 
            />

            {/* 4. Furniture Shelf */}
            {furniture.length > 0 && <ProductShelf title="Furniture" products={furniture} backgroundColor={getCategoryColor('furniture')} />}
            
            {/* 5. Fashion Shelf */}
            {fashion.length > 0 && <ProductShelf title="Fashion & Apparel" products={fashion} backgroundColor={getCategoryColor('fashion')} />}
            
            {/* 6. Electronics Shelf */}
            {electronics.length > 0 && <ProductShelf title="Best of Electronics" products={electronics} backgroundColor={getCategoryColor('electronics')} />}
            
            {/* 7. Beauty Shelf */}
            {beauty.length > 0 && <ProductShelf title="Beauty & Personal Care" products={beauty} backgroundColor={getCategoryColor('beauty')} />}
            
            {/* 8. Groceries Shelf */}
            {groceries.length > 0 && <ProductShelf title="Daily Groceries" products={groceries} backgroundColor={getCategoryColor('groceries')} />}
            
            {/* 9. Medicines Shelf */}
            {medicine.length > 0 && <ProductShelf title="Health & Medicines" products={medicine} backgroundColor={getCategoryColor('medicine')} />}
            
            {/* 10. Sports Shelf */}
            {sports.length > 0 && <ProductShelf title="Sports & Fitness" products={sports} backgroundColor={getCategoryColor('sports')} />}

            {/* 11. Recommended Products */}
            <ProductShelf title="Recommended For You" products={todayDeals} backgroundColor={getCategoryColor('deals')} />

        </motion.div>
    );
}
