export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    rating: number;
    reviews: number;
    image: string;
    images?: string[];
    category: string;
    brand?: string;
    stock?: number;
    thumbnail?: string;
    discountPercentage?: number;
    business_id?: string;
}

const DUMMY_PRODUCTS: Product[] = [
    { id: '1', title: 'Premium Wireless Headphones', description: 'Noise cancelling overhead headphones.', price: 299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', category: 'Electronics', rating: 4.8, reviews: 120 },
    { id: '2', title: 'Smart Home Speaker', description: 'Voice-controlled smart speaker with rich sound.', price: 99, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', category: 'Smart Home', rating: 4.5, reviews: 85 },
    { id: '3', title: 'Minimalist Mechanical Keyboard', description: 'RGB mechanical keyboard with cherry mx switches.', price: 149, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80', category: 'Electronics', rating: 4.9, reviews: 300 },
    { id: '4', title: 'Smart Watch Series X', description: 'Fitness tracker and smart notifications on your wrist.', price: 199, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80', category: 'Wearables', rating: 4.6, reviews: 210 },
    { id: '5', title: '4K Ultra HD Drone', description: 'Foldable drone with 4K camera and 3-axis gimbal.', price: 599, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80', category: 'Electronics', rating: 4.7, reviews: 180 },
    { id: '6', title: 'Professional Camera Lens', description: '50mm f/1.4 prime lens for stunning portraits.', price: 899, image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800&q=80', category: 'Photography', rating: 4.9, reviews: 450 },
    { id: '7', title: 'Designer Sunglasses', description: 'Polarized UV400 sunglasses with classic frame.', price: 129, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', category: 'Accessories', rating: 4.4, reviews: 95 },
    { id: '8', title: 'Aesthetic Coffee Maker', description: 'Pour-over coffee maker with double mesh filter.', price: 45, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80', category: 'Kitchen', rating: 4.8, reviews: 320 }
];

export async function fetchProducts(limit = 100, offset = 0): Promise<Product[]> {
    try {
        // 1. Try to fetch from our local Ovaloop Inventory API
        const localRes = await fetch(`/api/products?limit=${limit}&offset=${offset}`);
        if (localRes.ok) {
            const ovaloopData = await localRes.json();
            if (ovaloopData && ovaloopData.length > 0) {
                return ovaloopData.map((p: any) => {
                    const isMapped = p.title !== undefined;
                    return {
                        id: p.id,
                        title: isMapped ? p.title : p.name,
                        description: isMapped ? p.description || '' : (p.product_description || `Premium ${p.category_name} product`),
                        price: isMapped ? p.price : (parseFloat(p.selling_price) || 0),
                        originalPrice: isMapped ? p.originalPrice : ((parseFloat(p.selling_price) || 0) * 1.2),
                        discount: isMapped ? p.discount : '-20%',
                        rating: isMapped ? p.rating : (Math.round((4.5 + Math.random() * 0.5) * 10) / 10),
                        reviews: isMapped ? p.reviews : (Math.floor(Math.random() * 500) + 10),
                        image: isMapped ? p.image : (p.image_path || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'),
                        images: [isMapped ? p.image : (p.image_path || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80')],
                        category: isMapped ? p.category : (p.category_name || 'General'),
                        brand: isMapped ? p.brand : (p.business_name || ''),
                        stock: isMapped ? p.stock : (parseFloat(p.stock_unit) || 0),
                        business_id: p.business_id || ''
                    };
                });
            }
        }
        
        return DUMMY_PRODUCTS;
    } catch (e) {
        console.error("Failed to fetch products:", e);
        return DUMMY_PRODUCTS;
    }
}
