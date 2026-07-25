import { SearchContext, SearchContextManager } from './SearchContextManager';
import { extractStructuredQuery } from './queryParser';

export class ResultRefinementEngine {
    static refine(activeContext: SearchContext, followUpQuery: string): SearchContext | null {
        // 1. Interpret conversational refinement request (extract structured constraints)
        // Pass empty array for products since we don't scan the master catalog
        const parsedFollowUp = extractStructuredQuery(followUpQuery, []);

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 [Refinement] Detected Refinement Request`, { followUpQuery, parsedFollowUp });
        }

        // 2. Clone active context to keep it immutable
        const newContext: SearchContext = {
            ...activeContext,
            id: activeContext.id, // keep the same session ID
            metadata: {
                ...activeContext.metadata,
                updatedAt: Date.now()
            },
            productSnapshot: [...activeContext.productSnapshot],
            structuredQuery: {
                ...activeContext.structuredQuery
            }
        };

        const lowerQuery = followUpQuery.toLowerCase();
        const isSort = lowerQuery.includes('cheapest') || lowerQuery.includes('expensive') || lowerQuery.includes('highest rated') || lowerQuery.includes('newest');
        const isSlice = lowerQuery.includes('top') || lowerQuery.includes('first') || lowerQuery.includes('only') || lowerQuery.includes('keep');

        let productsBefore = newContext.productSnapshot.length;

        // Apply Brand Filter
        if (parsedFollowUp.brand) {
            newContext.productSnapshot = newContext.productSnapshot.filter(p => p.brand.toLowerCase() === parsedFollowUp.brand!.toLowerCase());
            newContext.structuredQuery.brand = parsedFollowUp.brand; // update structured query
        }

        // Apply Attribute Filters
        if (parsedFollowUp.filters.length > 0) {
            parsedFollowUp.filters.forEach(filter => {
                newContext.productSnapshot = newContext.productSnapshot.filter(p => {
                    if (!p.attributes) return false;
                    return Object.values(p.attributes).some((val: any) => 
                        typeof val === 'string' && val.toLowerCase() === filter.toLowerCase()
                    );
                });
                if (!newContext.structuredQuery.filters.includes(filter)) {
                    newContext.structuredQuery.filters.push(filter);
                }
            });
        }

        // Apply Price Filter
        if (parsedFollowUp.price) {
            const { min = 0, max = Infinity } = parsedFollowUp.price;
            newContext.productSnapshot = newContext.productSnapshot.filter(p => p.price >= min && p.price <= max);
            newContext.structuredQuery.price = parsedFollowUp.price;
        }

        // Apply Sorting
        if (isSort) {
            if (lowerQuery.includes('cheapest')) {
                newContext.sortState = 'cheapest_first';
                newContext.productSnapshot.sort((a, b) => a.price - b.price);
            } else if (lowerQuery.includes('expensive')) {
                newContext.sortState = 'expensive_first';
                newContext.productSnapshot.sort((a, b) => b.price - a.price);
            } else if (lowerQuery.includes('highest rated') || lowerQuery.includes('rating')) {
                newContext.sortState = 'highest_rated';
                newContext.productSnapshot.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else if (lowerQuery.includes('newest')) {
                newContext.sortState = 'newest';
                // no-op if we don't have date added in snapshot, but architecture is prepared
            }
        }

        // Apply Slice Operations
        if (isSlice) {
            const sliceMatch = lowerQuery.match(/(top|first|only|keep)\s*(\d+)/i) || lowerQuery.match(/(show)\s*(only)?\s*(\d+)/i);
            if (sliceMatch) {
                const limit = parseInt(sliceMatch[sliceMatch.length - 1], 10);
                if (!isNaN(limit) && limit > 0) {
                    newContext.productSnapshot = newContext.productSnapshot.slice(0, limit);
                }
            }
        }
        
        newContext.totalResultCount = newContext.productSnapshot.length;

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 [Refinement] Products Before: ${productsBefore} | After: ${newContext.totalResultCount}`);
            console.log(`🔍 [Refinement] Updated Context`, newContext);
        }

        return newContext;
    }
}
