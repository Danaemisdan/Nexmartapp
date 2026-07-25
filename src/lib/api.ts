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
    
    // Product Taxonomy Foundation
    subcategory?: string;
    productType?: string;
    tags?: string[];
    attributes?: Record<string, string>;
}

const DUMMY_PRODUCTS: Product[] = [];

export async function fetchProducts(limit = 100, offset = 0): Promise<Product[]> {
    try {
        const localRes = await fetch(`/api/products?limit=${limit}&offset=${offset}`).catch(e => { console.warn("Local fetch failed:", e.message); return null; });

        let combinedProducts: Product[] = [];

        // 2. Process and Normalize Local Products
        if (localRes && localRes.ok) {
            try {
                const ovaloopData = await localRes.json();
                if (ovaloopData && ovaloopData.length > 0) {
                    const localNormalized = ovaloopData.map((p: any) => {
                        const isMapped = p.title !== undefined;
                        return {
                            id: p.id.toString(),
                            title: isMapped ? p.title : p.name,
                            description: isMapped ? p.description || '' : (p.product_description || `Premium ${p.category_name} product`),
                            price: isMapped ? p.price : (parseFloat(p.selling_price) || 0),
                            originalPrice: isMapped ? p.originalPrice : ((parseFloat(p.selling_price) || 0) * 1.2),
                            discount: isMapped ? p.discount : '-20%',
                            rating: isMapped ? p.rating : (Math.round((4.5 + Math.random() * 0.5) * 10) / 10),
                            image: isMapped ? p.image : (p.image_path || ''),
                            images: [isMapped ? p.image : (p.image_path || '')],
                            category: isMapped ? p.category : (p.category_name || 'General'),
                            brand: isMapped ? p.brand : (p.business_name || ''),
                            stock: isMapped ? p.stock : (parseFloat(p.stock_unit) || 0),
                            business_id: p.business_id || '',
                            subcategory: p.subcategory,
                            productType: p.productType,
                            tags: p.tags || [],
                            attributes: p.attributes || {}
                        };
                    });
                    combinedProducts = [...combinedProducts, ...localNormalized];
                }
            } catch (e) {
                console.error("Failed to parse local products", e);
            }
        }

        // Ensure we don't have duplicates by ID
        const uniqueProducts = Array.from(new Map(combinedProducts.map(p => [p.id, p])).values());
        return uniqueProducts;
    } catch (e: any) {
        console.warn("Failed to fetch products globally:", e.message);
        return [];
    }
}
