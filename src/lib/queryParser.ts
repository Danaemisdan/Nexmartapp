import { parseQueryIntent, CanonicalTaxonomy } from './taxonomy';

export interface PriceConstraint {
    max?: number;
    min?: number;
}

export interface StructuredQuery {
    category?: string;
    subcategory?: string;
    productType?: string;
    brand?: string;
    filters: string[];
    price?: PriceConstraint;
    keywords: string[];
    rawIntent?: CanonicalTaxonomy;
}

export class QueryRegistry {
    private static brands = new Set<string>();
    private static attributes = new Set<string>();
    private static isBuilt = false;

    static build(products: any[]) {
        if (this.isBuilt) return;
        
        products.forEach(p => {
            if (p.brand) {
                this.brands.add(p.brand.toLowerCase());
            }
            if (p.tags && Array.isArray(p.tags)) {
                p.tags.forEach((t: string) => this.attributes.add(t.toLowerCase()));
            }
            if (p.attributes) {
                // If there are key-value attributes like color, material, etc.
                Object.values(p.attributes).forEach((val: any) => {
                    if (typeof val === 'string') {
                        this.attributes.add(val.toLowerCase());
                    }
                });
            }
        });
        
        this.isBuilt = true;
    }

    static isBrand(word: string): boolean {
        return this.brands.has(word.toLowerCase());
    }

    static isAttribute(word: string): boolean {
        return this.attributes.has(word.toLowerCase());
    }
}

export function extractStructuredQuery(query: string, products: any[]): StructuredQuery {
    // 1. Build registries if not built (Constant time after first run)
    QueryRegistry.build(products);

    const lower = query.toLowerCase();
    
    // 2. Base words
    const stopWords = ['suggest', 'recommend', 'concern', 'which', 'was', 'my', 'any', 'please', 'can', 'could', 'would', 'like', 'me', 'some', 'the', 'for', 'best', 'cheap', 'find', 'show', 'need', 'want', 'you', 'top', 'rated', 'expensive', 'i', 'have', 'a', 'looking', 'to', 'buy', 'in', 'on', 'with', 'and', 'or', 'of', 'are', 'is', 'it', 'under', 'below', 'less', 'than', 'cheaper', 'an'];
    const rawWords = lower.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2);
    
    // 3. Price Extraction
    let price: PriceConstraint | undefined = undefined;
    const underMatch = lower.match(/(under|below|less than|cheaper than)\s*(\d+)/i);
    const aboveMatch = lower.match(/(above|over|more than)\s*(\d+)/i);
    const betweenMatch = lower.match(/between\s*(\d+)\s*and\s*(\d+)/i);

    if (betweenMatch) {
        price = { min: parseInt(betweenMatch[1], 10), max: parseInt(betweenMatch[2], 10) };
    } else if (underMatch) {
        price = { max: parseInt(underMatch[2], 10) };
    } else if (aboveMatch) {
        price = { min: parseInt(aboveMatch[2], 10) };
    }

    // 4. Taxonomy Intent
    const rawIntent = parseQueryIntent(lower);
    
    // 5. Brand & Filter Extraction
    let brand: string | undefined = undefined;
    const filters: string[] = [];
    const keywords: string[] = [];

    rawWords.forEach(word => {
        if (stopWords.includes(word)) {
            return;
        }

        if (!brand && QueryRegistry.isBrand(word)) {
            brand = word;
        } else if (QueryRegistry.isAttribute(word)) {
            if (!filters.includes(word)) filters.push(word);
        }
        
        keywords.push(word); // Keep all meaningful words as keywords to preserve identical ranking behaviour
    });

    // Synonym expansion
    if (rawIntent && rawIntent.aliases) {
        rawIntent.aliases.forEach(alias => {
            if (!keywords.includes(alias)) {
                keywords.push(alias);
            }
        });
    }

    return {
        category: rawIntent?.category,
        subcategory: rawIntent?.subcategory,
        productType: rawIntent?.productType,
        brand,
        filters,
        price,
        keywords,
        rawIntent
    };
}
