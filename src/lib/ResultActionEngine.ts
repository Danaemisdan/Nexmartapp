import { SearchContext } from './SearchContextManager';

export enum ActionType {
    COMPARE_PRODUCTS = 'COMPARE_PRODUCTS',
    SELECT_PRODUCT = 'SELECT_PRODUCT',
    VIEW_DETAILS = 'VIEW_DETAILS',
    ADD_TO_CART_PLACEHOLDER = 'ADD_TO_CART_PLACEHOLDER',
    SAVE_PRODUCT_PLACEHOLDER = 'SAVE_PRODUCT_PLACEHOLDER',
    CLEAR_REFINEMENTS_PLACEHOLDER = 'CLEAR_REFINEMENTS_PLACEHOLDER',
    UNKNOWN = 'UNKNOWN'
}

export interface ActionEngineResponse {
    action: ActionType;
    resolvedIds: string[];
    updatedContext: SearchContext;
    fallbackMessage?: string;
}

export class ResultActionEngine {
    private static resolveProductReferences(query: string, context: SearchContext): string[] {
        const lower = query.toLowerCase();
        const resolvedIds: string[] = [];
        const snapshots = context.productSnapshot;

        if (snapshots.length === 0) return [];

        const indexMap: Record<string, number> = {
            'first': 0, 'one': 0, '1': 0,
            'second': 1, 'two': 1, '2': 1,
            'third': 2, 'three': 2, '3': 2,
            'fourth': 3, 'four': 3, '4': 3,
            'fifth': 4, 'five': 4, '5': 4,
            'last': snapshots.length - 1
        };

        // Handle "top X" or "first X"
        const sliceMatch = lower.match(/(top|first)\s*(two|three|four|five|1|2|3|4|5)/);
        if (sliceMatch) {
            const numStr = sliceMatch[2];
            const numMap: Record<string, number> = { 'two': 2, 'three': 3, 'four': 4, 'five': 5, '1':1, '2':2, '3':3, '4':4, '5':5 };
            const limit = numMap[numStr] || 1;
            for (let i = 0; i < Math.min(limit, snapshots.length); i++) {
                resolvedIds.push(snapshots[i].id);
            }
            return resolvedIds;
        }

        // Handle individual explicit references ("first", "second", etc.)
        Object.keys(indexMap).forEach(key => {
            if (lower.match(new RegExp(`\\b${key}\\b`))) {
                const idx = indexMap[key];
                if (idx >= 0 && idx < snapshots.length) {
                    if (!resolvedIds.includes(snapshots[idx].id)) {
                        resolvedIds.push(snapshots[idx].id);
                    }
                }
            }
        });

        // Handle "current", "this", "selected" using existing context state if possible
        if (resolvedIds.length === 0 && (lower.includes('current') || lower.includes('this') || lower.includes('selected'))) {
            if (context.selectedProductId) resolvedIds.push(context.selectedProductId);
            else if (context.selectedProductIds && context.selectedProductIds.length > 0) {
                resolvedIds.push(...context.selectedProductIds);
            }
        }

        // Handle "them", "all", "these"
        if (resolvedIds.length === 0 && (lower.includes('them') || lower.includes('all') || lower.includes('these'))) {
            // For a comparison, it makes sense to compare at most 4 items.
            for (let i = 0; i < Math.min(4, snapshots.length); i++) {
                resolvedIds.push(snapshots[i].id);
            }
        }

        // Handle brand or title matching
        if (resolvedIds.length === 0) {
            const stopWords = new Set(['add', 'to', 'cart', 'buy', 'the', 'a', 'an', 'show', 'me', 'this', 'that', 'it', 'for', 'with', 'and', 'compare', 'select', 'choose', 'keep', 'details', 'open', 'more', 'about', 'save', 'wishlist']);
            const queryTokens = lower.split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stopWords.has(w));
            
            snapshots.forEach(p => {
                const titleLower = (p.title || p.name || '').toLowerCase();
                const brandLower = (p.brand || '').toLowerCase();
                
                for (const token of queryTokens) {
                    if (brandLower === token || brandLower.includes(token) || titleLower.includes(token)) {
                        if (!resolvedIds.includes(p.id)) {
                            resolvedIds.push(p.id);
                        }
                        break;
                    }
                }
            });
        }

        // Fallback: If no explicit reference found, but there is only 1 product in context, assume that one.
        if (resolvedIds.length === 0 && snapshots.length === 1) {
            resolvedIds.push(snapshots[0].id);
        }

        return resolvedIds;
    }

    private static determineActionType(query: string): ActionType {
        const lower = query.toLowerCase();
        if (lower.includes('compare')) return ActionType.COMPARE_PRODUCTS;
        if (lower.includes('select') || lower.includes('choose') || lower.includes('keep this')) return ActionType.SELECT_PRODUCT;
        if (lower.includes('details') || lower.includes('open') || lower.includes('more about')) return ActionType.VIEW_DETAILS;
        if (lower.includes('add') || lower.includes('buy')) return ActionType.ADD_TO_CART_PLACEHOLDER;
        if (lower.includes('save') || lower.includes('wishlist')) return ActionType.SAVE_PRODUCT_PLACEHOLDER;
        if (lower.includes('clear') || lower.includes('reset')) return ActionType.CLEAR_REFINEMENTS_PLACEHOLDER;
        
        return ActionType.UNKNOWN;
    }

    static execute(context: SearchContext, query: string): ActionEngineResponse {
        const start = performance.now();
        
        const actionType = this.determineActionType(query);
        const resolvedIds = this.resolveProductReferences(query, context);

        if (process.env.NODE_ENV === 'development') {
            console.log(`⚡ [Result Action Engine]`);
            console.log(`Detected Action: ${actionType}`);
            console.log(`Resolved Product References:`, resolvedIds);
        }

        const newContext: SearchContext = {
            ...context,
            metadata: {
                ...context.metadata,
                updatedAt: Date.now()
            }
        };

        if (resolvedIds.length === 0) {
            let fallback = "Which product are you referring to?";
            if (actionType === ActionType.COMPARE_PRODUCTS) fallback = "Which products would you like to compare? (e.g. 'the first two')";
            
            return {
                action: actionType,
                resolvedIds,
                updatedContext: newContext,
                fallbackMessage: fallback
            };
        }

        // Apply context updates based on action
        if (actionType === ActionType.SELECT_PRODUCT || actionType === ActionType.VIEW_DETAILS || actionType === ActionType.ADD_TO_CART_PLACEHOLDER || actionType === ActionType.SAVE_PRODUCT_PLACEHOLDER) {
            newContext.selectedProductId = resolvedIds[0];
            newContext.selectedProductIds = resolvedIds;
        } else if (actionType === ActionType.COMPARE_PRODUCTS) {
            newContext.selectedProductIds = resolvedIds;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`⚡ [Result Action Engine] Updated Context:`, newContext);
            console.log(`⚡ [Result Action Engine] Execution Time: ${(performance.now() - start).toFixed(2)}ms`);
        }

        return {
            action: actionType,
            resolvedIds,
            updatedContext: newContext
        };
    }
}
