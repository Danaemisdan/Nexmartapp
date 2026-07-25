import { CanonicalTaxonomy, StructuredIntent } from './taxonomy';
import { normalizeTaxonomyTerm } from './normalizer';
import { extractStructuredQuery } from './queryParser';
import { SEARCH_SCORES } from './searchConstants';
import { SearchContextManager } from './SearchContextManager';

export interface SearchResult {
    matchingProducts: any[];
    action: string;
    generatedKeywords: string[];
    extractedIntent?: StructuredIntent;
}

export class SearchService {
    static search(userMessage: string, lower: string, action: string, isFollowUp: boolean, products: any[]): SearchResult {
        let generatedKeywords: string[] = [];
        let matchingProducts: any[] = [];
        let newAction = action;
        let extractedIntent: CanonicalTaxonomy | undefined = undefined;

        const stopWords = ['suggest', 'recommend', 'concern', 'which', 'was', 'my', 'any', 'please', 'can', 'could', 'would', 'like', 'me', 'some', 'the', 'for', 'best', 'cheap', 'find', 'show', 'need', 'want', 'you', 'top', 'rated', 'expensive', 'i', 'have', 'a', 'looking', 'to', 'buy', 'in', 'on', 'with', 'and', 'or', 'of', 'are', 'is', 'it', 'under', 'below', 'less', 'than', 'cheaper', 'an'];
        const rawUserKeywords = lower.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2);

        if (!isFollowUp && action !== 'CHECKOUT' && action !== 'VIEW_CART') {
            const parsedQuery = extractStructuredQuery(lower, products);
            extractedIntent = parsedQuery.rawIntent;
            generatedKeywords = parsedQuery.keywords;
            const maxPrice = parsedQuery.price?.max !== undefined ? parsedQuery.price.max : Infinity;
            const minPrice = parsedQuery.price?.min !== undefined ? parsedQuery.price.min : 0;
            
            if (generatedKeywords.length > 0 || extractedIntent) {
                const searchStartTime = performance.now();
                const phrase = lower.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2).join(' '); // Just used for phrase matching bonus
                const phraseRegex = new RegExp(`\\b${phrase}\\b`, 'i');

                const scoredProducts = products.map((p: any) => {
                    let score = 0;
                    const title = (p.title || '').toLowerCase();
                    const brand = (p.brand || '').toLowerCase();
                    const category = (p.category || '').toLowerCase();
                    const subcategory = (p.subcategory || '').toLowerCase();
                    const productType = (p.productType || '').toLowerCase();
                    const description = (p.description || '').toLowerCase();
                    const tags = p.tags ? p.tags.map((t: string) => t.toLowerCase()) : [];
                    
                    if (extractedIntent) {
                        const normCategory = normalizeTaxonomyTerm(category);
                        const normSubcategory = normalizeTaxonomyTerm(subcategory);
                        const normProductType = normalizeTaxonomyTerm(productType);
                        
                        const matchesCategoryField = (val: string) => {
                            const normVal = normalizeTaxonomyTerm(val);
                            return normCategory.includes(normVal) || normSubcategory.includes(normVal) || normProductType.includes(normVal);
                        };
                        
                        const isProductTypeTarget = !!extractedIntent.productType;
                        const isSubcategoryTarget = !extractedIntent.productType && !!extractedIntent.subcategory;
                        const isCategoryTarget = !extractedIntent.productType && !extractedIntent.subcategory && !!extractedIntent.category;

                        if (isProductTypeTarget) {
                            if (extractedIntent.productType && matchesCategoryField(extractedIntent.productType)) {
                                score += SEARCH_SCORES.PRODUCTTYPE_MATCH;
                            } else if (extractedIntent.category && matchesCategoryField(extractedIntent.category)) {
                                score += SEARCH_SCORES.CONTEXTUAL_BONUS;
                            }
                        } else if (isSubcategoryTarget) {
                            if (extractedIntent.subcategory && matchesCategoryField(extractedIntent.subcategory)) {
                                score += SEARCH_SCORES.SUBCATEGORY_MATCH;
                            } else if (extractedIntent.category && matchesCategoryField(extractedIntent.category)) {
                                score += SEARCH_SCORES.CONTEXTUAL_BONUS;
                            }
                        } else if (isCategoryTarget) {
                            if (extractedIntent.category && matchesCategoryField(extractedIntent.category)) {
                                score += SEARCH_SCORES.CATEGORY_MATCH;
                            }
                        }
                        
                        if (extractedIntent.concern && tags.includes(extractedIntent.concern)) {
                            score += SEARCH_SCORES.CONCERN_MATCH;
                        }
                    }

                    if (phrase.length > 3) {
                        if (phraseRegex.test(title)) score += SEARCH_SCORES.PHRASE_TITLE_MATCH;
                        if (phraseRegex.test(category)) score += SEARCH_SCORES.PHRASE_CATEGORY_MATCH;
                        if (phraseRegex.test(description)) score += SEARCH_SCORES.PHRASE_DESC_MATCH;
                    }

                    generatedKeywords.forEach(keyword => {
                        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                        
                        if (title === keyword) score += SEARCH_SCORES.KEYWORD_EXACT_TITLE;
                        else if (regex.test(title)) score += SEARCH_SCORES.TITLE_MATCH;
                        
                        if (regex.test(brand)) score += SEARCH_SCORES.BRAND_MATCH;
                        if (regex.test(category) || regex.test(subcategory) || regex.test(productType)) score += SEARCH_SCORES.CATEGORY_KEYWORD_MATCH;
                        if (tags.some((t: string) => regex.test(t))) score += SEARCH_SCORES.TAG_MATCH;
                        if (regex.test(description)) score += SEARCH_SCORES.DESCRIPTION_MATCH;
                    });
                    
                    return { product: p, score };
                });
                
                const sortedMatches = scoredProducts.filter(item => item.product.price <= maxPrice && item.product.price >= minPrice)
                                                    .sort((a, b) => b.score - a.score);
                                                    
                const hasHighConfidence = sortedMatches.length > 0 && sortedMatches[0].score >= SEARCH_SCORES.HIGH_CONFIDENCE_THRESHOLD;
                if (newAction === 'CHAT' && hasHighConfidence) {
                    newAction = 'SEARCH';
                }
                
                if (newAction === 'SEARCH' || newAction === 'ADD_TO_CART' || newAction === 'WISHLIST') {
                    matchingProducts = sortedMatches.filter(item => item.score >= SEARCH_SCORES.MIN_SEARCH_CONFIDENCE)
                                                    .slice(0, 4)
                                                    .map(item => item.product);
                }

                if (matchingProducts.length > 0 && newAction === 'SEARCH') {
                    SearchContextManager.replace(parsedQuery, matchingProducts);
                }

                if (process.env.NODE_ENV === 'development') {
                    const searchDuration = performance.now() - searchStartTime;
                    console.groupCollapsed('🔍 [Search Diagnostics]');
                    console.log('Original Query:', userMessage);
                    console.log('Normalized Query:', lower);
                    console.log('Extracted Intent:', extractedIntent || 'None');
                    console.log('Extracted Brand:', parsedQuery.brand || 'None');
                    console.log('Extracted Filters:', parsedQuery.filters.length > 0 ? parsedQuery.filters : 'None');
                    console.log('Extracted Price:', parsedQuery.price || 'None');
                    console.log('Extracted Keywords:', generatedKeywords);
                    console.log('Candidate Products Evaluated:', products.length);
                    console.log('Top 10 Ranking Scores:', sortedMatches.slice(0, 10).map(m => ({ title: m.product.title, score: m.score })));
                    console.log('Winning Products:', matchingProducts.map(p => p.title));
                    console.log(`Search Duration: ${searchDuration.toFixed(2)}ms`);
                    console.groupEnd();
                }
            }
        }
        
        return {
            matchingProducts,
            action: newAction,
            generatedKeywords,
            extractedIntent
        };
    }
}
