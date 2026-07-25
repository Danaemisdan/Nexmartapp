import { SearchContextManager } from './SearchContextManager';
import { extractStructuredQuery } from './queryParser';

export enum IntentType {
    NEW_SEARCH = 'NEW_SEARCH',
    RESULT_REFINEMENT = 'RESULT_REFINEMENT',
    RESULT_ACTION = 'RESULT_ACTION',
    GENERAL_CHAT = 'GENERAL_CHAT',
    UNKNOWN = 'UNKNOWN'
}

export interface RoutingDecision {
    intent: IntentType;
    action?: string; // e.g. ADD_TO_CART, WISHLIST, CHECKOUT
    isRefinement: boolean;
}

export class IntentRouter {
    static determineIntent(query: string, hasActiveContext: boolean): RoutingDecision {
        const lower = query.toLowerCase();
        
        // 1. Check for General Chat & FAQ Questions
        const chatIndicators = ['hi', 'hello', 'hey', 'greetings', 'thank', 'thanks', 'how are you'];
        if (chatIndicators.some(w => lower === w || lower.startsWith(`${w} `) || lower.endsWith(` ${w}`) || lower.includes(` ${w} `))) {
            return { intent: IntentType.GENERAL_CHAT, action: 'CHAT_GREETING', isRefinement: false };
        }

        // FAQ: Catalog / Platform Overview
        if ((lower.includes('what') || lower.includes('which') || lower.includes('list') || lower.includes('tell me') || lower.includes('do you sell') || lower.includes('do you have') || lower.includes('kind of') || lower.includes('types of')) && 
            (lower.includes('products') || lower.includes('items') || lower.includes('catalog') || lower.includes('sell') || lower.includes('offer') || lower.includes('platform') || lower.includes('website') || lower.includes('store') || lower.includes('available'))) {
            const specificCategories = ['laptop', 'phone', 'headphone', 'earbud', 'monitor', 'screen', 'audio', 'sound', 'camera', 'drone', 'watch', 'skincare', 'beauty', 'tv', 'television', 'gadget', 'speaker', 'keyboard', 'mouse'];
            const hasSpecificCategory = specificCategories.some(cat => lower.includes(cat));
            if (!hasSpecificCategory || lower.includes('on your website') || lower.includes('on your platform') || lower.includes('on your store') || lower.includes('on your e-commerce') || lower.includes('do you have on')) {
                return { intent: IntentType.GENERAL_CHAT, action: 'FAQ_CATALOG', isRefinement: false };
            }
        }

        // FAQ: Capabilities / AI Identity
        if (lower.includes('what can you do') || lower.includes('how can you help') || lower.includes('who are you') || lower.includes('your name') || lower.includes('what are you') || lower.includes('how do you work') || lower.includes('what do you do') || lower.includes('are you ai') || lower.includes('are you human')) {
            return { intent: IntentType.GENERAL_CHAT, action: 'FAQ_CAPABILITIES', isRefinement: false };
        }

        // FAQ: Shipping & Delivery
        if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('deliver') || lower.includes('ship')) {
            return { intent: IntentType.GENERAL_CHAT, action: 'FAQ_SHIPPING', isRefinement: false };
        }

        // FAQ: Payment Methods
        if (lower.includes('payment') || lower.includes('pay with') || lower.includes('credit card') || lower.includes('debit card') || lower.includes('cash on delivery') || lower.includes('paypal') || lower.includes('currency')) {
            if (!lower.includes('checkout') && !lower.includes('check out') && !lower.includes('proceed to pay')) {
                return { intent: IntentType.GENERAL_CHAT, action: 'FAQ_PAYMENT', isRefinement: false };
            }
        }

        // FAQ: Returns & Refunds
        if (lower.includes('return') || lower.includes('refund') || lower.includes('warranty') || lower.includes('guarantee') || lower.includes('broken') || lower.includes('damaged') || lower.includes('replace')) {
            if (!lower.includes('return home') && !lower.includes('return to home') && !lower.includes('return to shop')) {
                return { intent: IntentType.GENERAL_CHAT, action: 'FAQ_RETURNS', isRefinement: false };
            }
        }

        // FAQ: Customer Support & Contact
        if (lower.includes('support') || lower.includes('contact') || lower.includes('phone number') || lower.includes('email') || lower.includes('location') || lower.includes('where is your store') || lower.includes('customer service') || lower.includes('help center')) {
            return { intent: IntentType.GENERAL_CHAT, action: 'FAQ_SUPPORT', isRefinement: false };
        }

        // FAQ: Discounts & Promo Codes
        if (lower.includes('discount') || lower.includes('promo code') || lower.includes('coupon') || lower.includes('sale') || lower.includes('bargain')) {
            return { intent: IntentType.GENERAL_CHAT, action: 'FAQ_DISCOUNTS', isRefinement: false };
        }

        // 2. Check for Result Actions (Cart, Wishlist, Checkout)
        if (lower.includes('checkout') || lower.includes('check out') || lower.includes('pay')) {
            return { intent: IntentType.RESULT_ACTION, action: 'CHECKOUT', isRefinement: false };
        } else if (lower.includes('continue shopping') || lower.includes('go back to shop') || lower.includes('start shopping') || lower.includes('home page') || lower.includes('homepage') || lower.includes('go home') || lower.includes('take me home') || lower.includes('back to home') || lower.includes('main page') || lower === 'home') {
            return { intent: IntentType.RESULT_ACTION, action: 'CONTINUE_SHOPPING', isRefinement: false };
        } else if (lower.includes('go to cart') || lower.includes('view cart') || lower.includes('open cart') || lower.includes('take me to my cart') || lower.includes('show my cart') || lower === 'cart') {
            return { intent: IntentType.RESULT_ACTION, action: 'VIEW_CART', isRefinement: false };
        } else if (lower.includes('my wishlist') || lower.includes('open wishlist') || lower.includes('view wishlist') || lower.includes('go to wishlist') || lower.includes('show wishlist') || lower === 'wishlist') {
            return { intent: IntentType.RESULT_ACTION, action: 'VIEW_WISHLIST', isRefinement: false };
        } else if (lower.includes('my orders') || lower.includes('open orders') || lower.includes('view orders') || lower.includes('show orders') || lower === 'orders') {
            return { intent: IntentType.RESULT_ACTION, action: 'VIEW_ORDERS', isRefinement: false };
        } else if (lower.includes('categories') || lower.includes('category') || lower.includes('view categories') || lower.includes('show categories') || lower.includes('open categories')) {
            return { intent: IntentType.RESULT_ACTION, action: 'VIEW_CATEGORIES', isRefinement: false };
        } else if (lower === 'deals' || lower.includes('show deals') || lower.includes('view deals') || lower.includes('open deals') || lower.includes('special offers')) {
            return { intent: IntentType.RESULT_ACTION, action: 'VIEW_DEALS', isRefinement: false };
        } else if (lower.includes('profile') || lower.includes('account') || lower.includes('settings')) {
            return { intent: IntentType.RESULT_ACTION, action: 'VIEW_PROFILE', isRefinement: false };
        } else if (lower.includes('wishlist') || lower.includes('favorite') || lower.includes('save') || lower.includes('heart')) {
            return { intent: IntentType.RESULT_ACTION, action: 'WISHLIST', isRefinement: false };
        } else if (lower.includes('remove') || lower.includes('delete') || lower.includes('empty cart') || lower.includes('keep') || lower.includes('except')) {
            return { intent: IntentType.RESULT_ACTION, action: 'CART_MODIFICATION', isRefinement: false };
        } else if (lower.includes('add') || lower.includes('buy') || lower.includes('purchase')) {
            return { intent: IntentType.RESULT_ACTION, action: 'ADD_TO_CART', isRefinement: false };
        } else if (lower.includes('compare') || lower.includes('open') || lower.includes('details')) {
            // Future placeholder for generic result actions
            return { intent: IntentType.RESULT_ACTION, action: 'VIEW_DETAILS', isRefinement: false };
        }

        // 3. Check for Result Refinements
        const refinementIndicators = ['only', 'under', 'above', 'between', 'cheapest', 'expensive', 'highest rated', 'newest', 'top', 'first', 'keep'];
        // Use word boundaries to prevent substring matches (e.g. 'top' in 'laptops')
        const hasRefinementWord = refinementIndicators.some(w => lower.match(new RegExp(`\\b${w}\\b`, 'i')));
        
        if (hasRefinementWord) {
            return { intent: IntentType.RESULT_REFINEMENT, isRefinement: true };
        }

        // 4. Check for Conversational / FAQ questions before falling back to Product Search
        const questionStarters = ['what is ', 'who is ', 'why do ', 'why is ', 'how do i ', 'how can i ', 'how does ', 'tell me about ', 'can you explain ', 'is nexmart ', 'do you guys '];
        const hasQuestionStarter = questionStarters.some(q => lower.startsWith(q) || lower.includes(` ${q}`));
        if (hasQuestionStarter) {
            const productKeywords = ['laptop', 'phone', 'headphone', 'earbud', 'monitor', 'screen', 'audio', 'sound', 'camera', 'drone', 'watch', 'skincare', 'beauty', 'tv', 'television', 'gadget', 'speaker', 'keyboard', 'mouse', 'shirt', 'shoe', 'cloth', 'furniture', 'chair', 'table', 'bed', 'book'];
            const mentionsProduct = productKeywords.some(pk => lower.includes(pk));
            if (!mentionsProduct) {
                return { intent: IntentType.GENERAL_CHAT, action: 'CHAT_GENERAL', isRefinement: false };
            }
        }

        // 5. Fallback to New Search
        return { intent: IntentType.NEW_SEARCH, action: 'SEARCH', isRefinement: false };
    }

    static route(query: string): RoutingDecision {
        const hasContext = SearchContextManager.hasActive();
        const start = performance.now();
        
        let decision = this.determineIntent(query, hasContext);

        // Fallback: If refinement requested but no context, default to NEW_SEARCH (or let dispatcher handle the graceful error)
        if (decision.intent === IntentType.UNKNOWN) {
            decision.intent = IntentType.NEW_SEARCH;
            decision.action = 'SEARCH';
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`🧭 [Intent Router]`);
            console.log(`Detected Intent: ${decision.intent}`);
            console.log(`Routing Decision: ${decision.action || 'Default'}`);
            console.log(`SearchContext Available: ${hasContext}`);
            console.log(`Dispatch Time: ${(performance.now() - start).toFixed(2)}ms`);
        }

        return decision;
    }
}
