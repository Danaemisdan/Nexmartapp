import { getCategoryColor } from './theme';

export interface Category {
    id: string;
    name: string;
    image: string;
    color: string;
}

export interface PromoBanner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    backgroundColor: string;
    textColor: string;
}

export const marketplaceCategories: Category[] = [
    { id: 'fashion', name: 'Fashion', image: '/categories/cat_fashion.jpg', color: getCategoryColor('fashion') },
    { id: 'home', name: 'Home', image: '/categories/cat_home.jpg', color: getCategoryColor('home') },
    { id: 'beauty', name: 'Beauty', image: '/categories/cat_beauty.jpg', color: getCategoryColor('beauty') },
    { id: 'electronics', name: 'Electronics & Appliances', image: '/categories/cat_electronics.jpg', color: getCategoryColor('electronics') },
    { id: 'groceries', name: 'Food & Groceries', image: '/categories/cat_groceries.jpg', color: getCategoryColor('groceries') },
    { id: 'medicine', name: 'Health & Medicine', image: '/categories/cat_medicine.jpg', color: getCategoryColor('medicine') },
    { id: 'sports', name: 'Sports & Fitness', image: '/categories/cat_sports.jpg', color: getCategoryColor('sports') },
];

export const promoBanners: PromoBanner[] = [
    {
        id: 'banner1',
        title: 'Big Fashion Festival',
        subtitle: '50-80% Off on Top Brands',
        image: '/banners/fashion_banner.jpg',
        backgroundColor: '#FFEBEE',
        textColor: '#C62828'
    },
    {
        id: 'banner2',
        title: 'Home Upgrade Sale',
        subtitle: 'Up to 60% Off Furniture',
        image: '/banners/home_banner.jpg',
        backgroundColor: '#E3F2FD',
        textColor: '#1565C0'
    },
    {
        id: 'banner3',
        title: 'Electronics Blowout',
        subtitle: 'Latest Gadgets at Unbeatable Prices',
        image: '/banners/electronics_banner.jpg',
        backgroundColor: '#F3E5F5',
        textColor: '#6A1B9A'
    }
];

export interface MarketplaceProduct {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: string;
    image: string;
    brand: string;
    discount?: string;
    isAssured?: boolean;
    categoryId: string;
}

export const marketplaceProducts: MarketplaceProduct[] = [
    { id: 'mp1', title: 'Premium Wireless Headphones', price: 99, originalPrice: 199, rating: 4.5, reviews: '1.2k', image: '/placeholders/prod-headphones.jpg', brand: 'Sony', discount: '50% Off', isAssured: true, categoryId: 'electronics' },
    { id: 'mp2', title: 'Smart Fitness Watch Series 6', price: 149, originalPrice: 249, rating: 4.8, reviews: '4.5k', image: '/placeholders/prod-watch.jpg', brand: 'Fitbit', discount: '40% Off', isAssured: true, categoryId: 'electronics' },
    { id: 'mp3', title: 'Modern Velvet Sofa Couch', price: 499, originalPrice: 899, rating: 4.6, reviews: '890', image: '/placeholders/prod-sofa.jpg', brand: 'UrbanHome', discount: '44% Off', isAssured: true, categoryId: 'furniture' },
    { id: 'mp4', title: 'Advanced Repair Night Serum', price: 45, originalPrice: 85, rating: 4.9, reviews: '2.1k', image: '/placeholders/prod-serum.jpg', brand: 'Loreal', discount: '47% Off', isAssured: false, categoryId: 'beauty' },
    { id: 'mp5', title: 'Classic White Sneakers', price: 65, originalPrice: 110, rating: 4.7, reviews: '3.2k', image: '/placeholders/prod-sneakers.jpg', brand: 'Nike', discount: '40% Off', isAssured: true, categoryId: 'fashion' },
    { id: 'mp6', title: 'Daily Multivitamin Supplements', price: 15, originalPrice: 25, rating: 4.4, reviews: '5k+', image: '/placeholders/prod-vitamins.jpg', brand: 'Centrum', discount: '40% Off', isAssured: true, categoryId: 'medicine' },
    { id: 'mp7', title: 'Bluetooth Over-Ear Headset', price: 79, originalPrice: 149, rating: 4.3, reviews: '800', image: '/placeholders/prod-headset.jpg', brand: 'JBL', discount: '47% Off', isAssured: true, categoryId: 'electronics' },
    { id: 'mp8', title: 'Minimalist Coffee Table', price: 129, originalPrice: 299, rating: 4.2, reviews: '450', image: '/placeholders/prod-coffeetable.jpg', brand: 'IKEA', discount: '56% Off', isAssured: false, categoryId: 'furniture' },
    { id: 'mp9', title: 'Hydrating Facial Moisturizer', price: 29, originalPrice: 50, rating: 4.8, reviews: '1.5k', image: '/placeholders/prod-moisturizer.jpg', brand: 'Cetaphil', discount: '42% Off', isAssured: true, categoryId: 'beauty' },
    { id: 'mp10', title: 'Running Shoes Men', price: 85, originalPrice: 150, rating: 4.6, reviews: '2.8k', image: '/placeholders/prod-runningshoes.jpg', brand: 'Adidas', discount: '43% Off', isAssured: true, categoryId: 'fashion' },
    { id: 'mp11', title: 'Immunity Booster Tablets', price: 12, originalPrice: 20, rating: 4.7, reviews: '6k+', image: '/placeholders/prod-tablets.jpg', brand: 'NatureMade', discount: '40% Off', isAssured: true, categoryId: 'medicine' },
    { id: 'mp12', title: 'Organic Apples 1kg', price: 4, originalPrice: 8, rating: 4.5, reviews: '900', image: '/placeholders/prod-apples.jpg', brand: 'FreshFarm', discount: '50% Off', isAssured: true, categoryId: 'groceries' },
    { id: 'mp13', title: 'Yoga Mat Non-Slip', price: 22, originalPrice: 45, rating: 4.8, reviews: '3k+', image: '/placeholders/prod-yogamat.jpg', brand: 'Lululemon', discount: '51% Off', isAssured: true, categoryId: 'sports' }
];

export const getProductsByCategory = (categoryId: string) => {
    return marketplaceProducts.filter(p => p.categoryId === categoryId);
};

export const getFeaturedProducts = () => {
    return marketplaceProducts.slice(0, 10);
};
