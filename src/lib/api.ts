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
}

export async function fetchProducts(): Promise<Product[]> {
    try {
        // 1. Try to fetch from our local Ovaloop Inventory API
        const localRes = await fetch('/api/products');
        if (localRes.ok) {
            const ovaloopData = await localRes.json();
            if (ovaloopData && ovaloopData.length > 0) {
                return ovaloopData.map((p: any) => ({
                    id: p.id,
                    title: p.name,
                    description: p.product_description || `Premium ${p.category_name} product from ${p.business_name}`,
                    price: parseFloat(p.selling_price) || 0,
                    originalPrice: (parseFloat(p.selling_price) || 0) * 1.2, // Fake 20% discount for UI
                    discount: '-20%',
                    rating: 4.5 + (Math.random() * 0.5), // Ovaloop doesn't have rating
                    reviews: Math.floor(Math.random() * 500) + 10,
                    // Ovaloop might have null images, use a placeholder if needed
                    image: p.image_path || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
                    images: [p.image_path || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'],
                    category: p.category_name,
                    brand: p.business_name,
                    stock: parseFloat(p.stock_unit) || 0
                }));
            }
        }
        
        // 2. Fallback to DummyJSON if Ovaloop is empty
        const res = await fetch('https://dummyjson.com/products?limit=100');
        const data = await res.json();
        
        return data.products.map((p: any) => ({
            id: p.id.toString(),
            title: p.title,
            description: p.description,
            price: p.price,
            originalPrice: +(p.price / (1 - (p.discountPercentage || 0) / 100)).toFixed(2),
            discount: `-${Math.round(p.discountPercentage || 0)}%`,
            rating: p.rating,
            reviews: Array.isArray(p.reviews) ? p.reviews.length : (typeof p.reviews === 'number' ? p.reviews : Math.floor(Math.random() * 500) + 10),
            image: p.thumbnail,
            images: p.images,
            category: p.category,
            brand: p.brand,
            stock: p.stock
        }));
    } catch (e) {
        console.error("Failed to fetch products:", e);
        return [];
    }
}
