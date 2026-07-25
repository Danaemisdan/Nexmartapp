import { StructuredQuery } from './queryParser';

export interface ProductSnapshot {
    id: string;
    name: string;
    title?: string;
    brand: string;
    category: string;
    price: number;
    rating: number;
    attributes: Record<string, any>;
}

export interface SearchContextMetadata {
    createdAt: number;
    updatedAt: number;
    source: string;
}

export interface SearchContext {
    id: string;
    contextVersion: number;
    status: 'ACTIVE' | 'STALE';
    searchIntent: 'NEW_SEARCH' | 'RESULT_REFINEMENT' | 'RESULT_ACTION';
    structuredQuery: StructuredQuery;
    productSnapshot: ProductSnapshot[];
    sortState: any | null; // Null initially as per spec
    metadata: SearchContextMetadata;
    totalResultCount: number;
    selectedProductId?: string;
    selectedProductIds?: string[];
}

export class SearchContextManager {
    private static activeContext: SearchContext | null = null;

    private static generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    static create(query: StructuredQuery, products: any[]): SearchContext {
        if (this.activeContext) {
            this.activeContext.status = 'STALE';
        }

        const snapshots: ProductSnapshot[] = products.map(p => {
            const attributes: Record<string, any> = {};
            if (p.tags && Array.isArray(p.tags)) {
                p.tags.forEach((t: string) => { attributes[t] = t });
            }
            if (p.attributes) {
                Object.assign(attributes, p.attributes);
            }
            
            return {
                id: p.id ? p.id.toString() : '',
                name: p.title || p.name || '',
                title: p.title || p.name || '',
                brand: p.brand || '',
                category: p.category || '',
                price: p.price || 0,
                rating: p.rating || 0,
                attributes
            };
        });

        const newContext: SearchContext = {
            id: this.generateId(),
            contextVersion: 1,
            status: 'ACTIVE',
            searchIntent: 'NEW_SEARCH',
            structuredQuery: query,
            productSnapshot: snapshots,
            sortState: null,
            metadata: {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                source: 'SEARCH'
            },
            totalResultCount: products.length
        };

        this.activeContext = newContext;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 [Search Context] Created`, {
                id: newContext.id,
                status: newContext.status,
                searchIntent: newContext.searchIntent,
                productCount: newContext.totalResultCount,
                query: newContext.structuredQuery
            });
        }

        return newContext;
    }

    static replace(query: StructuredQuery, products: any[]): SearchContext {
        if (this.activeContext && process.env.NODE_ENV === 'development') {
            console.log(`🔍 [Search Context] Replaced`);
        }
        return this.create(query, products);
    }

    static get(): SearchContext | null {
        return this.activeContext;
    }

    static getProductIds(): string[] {
        if (!this.activeContext) return [];
        return this.activeContext.productSnapshot.map(s => s.id);
    }

    static hasActive(): boolean {
        return this.activeContext !== null && this.activeContext.status === 'ACTIVE';
    }

    static update(newContext: SearchContext): void {
        this.activeContext = newContext;
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 [Search Context] Updated via Refinement`, newContext);
        }
    }

    static clear(): void {
        if (this.activeContext) {
            this.activeContext.status = 'STALE';
            this.activeContext = null;
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔍 [Search Context] Cleared`);
            }
        }
    }
}
