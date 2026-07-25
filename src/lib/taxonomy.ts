import { normalizeTaxonomyTerm } from './normalizer';

export interface StructuredIntent {
    category?: string;
    subcategory?: string;
    productType?: string;
    concern?: string;
}

export interface CanonicalTaxonomy extends StructuredIntent {
    aliases: string[];
}

export const canonicalTaxonomies: CanonicalTaxonomy[] = [
    // Beauty
    { category: 'beauty', subcategory: 'skincare', productType: 'moisturizer', aliases: ['moisturizer', 'moisturizers', 'face cream', 'face lotion', 'hydrating cream'] },
    { category: 'beauty', subcategory: 'haircare', productType: 'shampoo', aliases: ['shampoo', 'shampoos', 'hair wash'] },
    { category: 'beauty', subcategory: 'makeup', productType: 'lipstick', aliases: ['lipstick', 'lipsticks', 'lip color'] },
    { category: 'beauty', subcategory: 'makeup', productType: 'mascara', aliases: ['mascara', 'mascaras'] },
    { category: 'beauty', subcategory: 'fragrances', productType: 'perfume', aliases: ['perfume', 'perfumes', 'fragrance', 'fragrances', 'cologne'] },
    { category: 'beauty', subcategory: 'skincare', aliases: ['skin', 'skincare', 'skin care'] },
    { category: 'beauty', subcategory: 'haircare', aliases: ['hair', 'haircare', 'hair care'] },
    { category: 'beauty', subcategory: 'makeup', aliases: ['makeup', 'cosmetics'] },
    { category: 'beauty', aliases: ['beauty'] },
    
    // Electronics
    { category: 'electronics', subcategory: 'audio', productType: 'earbuds', aliases: ['earbuds', 'wireless earbuds', 'airpods'] },
    { category: 'electronics', subcategory: 'audio', productType: 'headphones', aliases: ['headphones', 'headset', 'earphones'] },
    { category: 'electronics', subcategory: 'computers', productType: 'laptop', aliases: ['laptop', 'laptops', 'macbook', 'notebook'] },
    { category: 'electronics', subcategory: 'computers', productType: 'keyboard', aliases: ['keyboard', 'keyboards', 'gaming keyboard'] },
    { category: 'electronics', subcategory: 'smartphones', productType: 'phone', aliases: ['phone', 'phones', 'smartphone', 'smartphones', 'iphone'] },
    { category: 'electronics', aliases: ['electronics', 'tech', 'gadgets'] },
    
    // Health
    { category: 'health', subcategory: 'supplements', productType: 'protein', concern: 'muscle', aliases: ['protein', 'protein powder', 'whey'] },
    { category: 'health', subcategory: 'supplements', aliases: ['supplement', 'supplements', 'vitamins'] },
    { category: 'health', aliases: ['health', 'wellness'] },
    
    // Fashion
    { category: 'fashion', subcategory: 'mens', productType: 'shirt', aliases: ['shirt', 'shirts', 'tshirt'] },
    { category: 'fashion', subcategory: 'womens', productType: 'dress', aliases: ['dress', 'dresses'] },
    { category: 'fashion', subcategory: 'footwear', productType: 'shoes', aliases: ['shoes', 'sneakers', 'boots', 'footwear'] },
    { category: 'fashion', aliases: ['clothes', 'clothing', 'fashion', 'apparel', 'wear'] },
    
    // Home & Kitchen
    { category: 'home', subcategory: 'kitchen', productType: 'cookware', aliases: ['frying pan', 'pan', 'cookware', 'pot'] },
    { category: 'home', subcategory: 'kitchen', productType: 'blender', aliases: ['blender', 'blenders'] },
    { category: 'home', subcategory: 'furniture', aliases: ['furniture', 'sofa', 'couch', 'chair', 'table'] },
    { category: 'home', subcategory: 'kitchen', aliases: ['kitchen'] },
    { category: 'home', aliases: ['home', 'house'] },
    
    // Pet Care
    { category: 'pets', subcategory: 'dog', productType: 'food', aliases: ['dog food', 'dog treats'] },
    { category: 'pets', subcategory: 'cat', productType: 'food', aliases: ['cat food', 'cat treats'] },
    { category: 'pets', aliases: ['pet care', 'pets', 'pet'] },
    
    // Food / Groceries
    { category: 'food', subcategory: 'groceries', productType: 'coffee', aliases: ['coffee', 'coffee beans'] },
    { category: 'food', aliases: ['food', 'groceries', 'grocery', 'snacks'] },
    
    // Accessories
    { category: 'accessories', subcategory: 'watches', productType: 'watch', aliases: ['watch', 'watches', 'smartwatch'] },
    { category: 'accessories', aliases: ['accessories', 'jewelry', 'jewellery'] },
    
    // Others
    { category: 'baby', aliases: ['baby care', 'baby', 'infant'] },
    { category: 'sports', aliases: ['sports', 'fitness', 'gym', 'workout'] },
    { category: 'automotive', aliases: ['automotive', 'car', 'auto'] },
    { category: 'books', aliases: ['books', 'book'] },
    { category: 'office', aliases: ['office', 'stationery'] },
    { category: 'toys', aliases: ['toys', 'toy', 'games'] },
    { category: 'garden', aliases: ['garden', 'outdoor'] }
];

export function parseQueryIntent(query: string): CanonicalTaxonomy | undefined {
    const normalizedQuery = normalizeTaxonomyTerm(query);
    if (!normalizedQuery) return undefined;
    
    // Check against canonical taxonomy aliases
    for (const taxonomy of canonicalTaxonomies) {
        for (const alias of taxonomy.aliases) {
            const normalizedAlias = normalizeTaxonomyTerm(alias);
            if (normalizedQuery.includes(normalizedAlias)) {
                // Return the full taxonomy (including aliases) for synonym expansion
                return taxonomy;
            }
        }
    }
    
    return undefined;
}
