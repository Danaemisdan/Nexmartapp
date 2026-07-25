import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from './api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating_desc';

export interface FilterState {
    category: string;
    brand: string;
    minPrice: number | null;
    maxPrice: number | null;
    minRating: number | null;
}

export function filterAndSortProducts(
    products: Product[],
    query: string,
    filters: FilterState,
    sortOption: SortOption
): Product[] {
    let result = products;

    // 1. Search Query
    if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q))
        );
    }

    // 2. Filters
    if (filters.category) {
        result = result.filter(p => p.category === filters.category);
    }
    if (filters.brand) {
        result = result.filter(p => p.brand === filters.brand);
    }
    if (filters.minPrice !== null) {
        result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
        result = result.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.minRating !== null) {
        result = result.filter(p => p.rating >= filters.minRating!);
    }

    // 3. Sorting
    result = [...result];
    switch (sortOption) {
        case 'price_asc':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'rating_desc':
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'relevance':
        default:
            break;
    }

    return result;
}
