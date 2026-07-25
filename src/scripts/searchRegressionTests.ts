export interface SearchRegressionTest {
    query: string;
    expectedCategory?: string;
    expectedProductType?: string;
    expectedTopResultsKeywords?: string[];
    minConfidence: number;
    description: string;
}

export const regressionSuite: SearchRegressionTest[] = [
    // --- BEAUTY ---
    {
        query: "suggest me a good face lotion",
        expectedCategory: "beauty",
        expectedProductType: "moisturizer",
        expectedTopResultsKeywords: ["moisturizer", "cream", "lotion"],
        minConfidence: 30,
        description: "Beauty: Basic product type match via alias"
    },
    // --- ELECTRONICS ---
    {
        query: "noise cancelling head-phones",
        expectedCategory: "electronics",
        expectedProductType: "headphones",
        expectedTopResultsKeywords: ["headphones", "sony", "wireless"],
        minConfidence: 30,
        description: "Electronics: Hyphenated word edge case (head-phones)"
    },
    // --- HEALTH ---
    {
        query: "i need some whey protein powders",
        expectedCategory: "health",
        expectedProductType: "protein",
        expectedTopResultsKeywords: ["protein"],
        minConfidence: 30,
        description: "Health: Plural words edge case (powders)"
    },
    // --- HOME ---
    {
        query: "show me house decorations",
        expectedCategory: "home",
        expectedTopResultsKeywords: ["home", "decor"],
        minConfidence: 20,
        description: "Home: Broad category match with synonym"
    },
    // --- KITCHEN ---
    {
        query: "frying pan for cooking",
        expectedCategory: "home",
        expectedProductType: "cookware",
        expectedTopResultsKeywords: ["pan", "cookware"],
        minConfidence: 30,
        description: "Kitchen: Subcategory extraction"
    },
    // --- FURNITURE ---
    {
        query: "comfortable living room couch",
        expectedCategory: "home",
        expectedTopResultsKeywords: ["couch", "sofa"],
        minConfidence: 30,
        description: "Furniture: Subcategory mapping from alias"
    },
    // --- PET CARE ---
    {
        query: "food for my cat",
        expectedCategory: "pets",
        expectedProductType: "food",
        expectedTopResultsKeywords: ["cat", "food"],
        minConfidence: 30,
        description: "Pet Care: Intent extraction from conversational query"
    },
    // --- BOOKS ---
    {
        query: "best selling fantasy books",
        expectedCategory: "books",
        expectedTopResultsKeywords: ["book", "fantasy"],
        minConfidence: 20,
        description: "Books: Category level mapping"
    },
    // --- OFFICE ---
    {
        query: "office stationery",
        expectedCategory: "office",
        expectedTopResultsKeywords: ["office", "stationery"],
        minConfidence: 20,
        description: "Office: Category level mapping"
    },
    // --- FASHION ---
    {
        query: "mens t-shirt",
        expectedCategory: "fashion",
        expectedProductType: "shirt",
        expectedTopResultsKeywords: ["shirt", "tshirt", "mens"],
        minConfidence: 30,
        description: "Fashion: Hyphenated and mixed spacing (t-shirt)"
    },
    // --- SPORTS ---
    {
        query: "home workout gym equipment",
        expectedCategory: "sports",
        expectedTopResultsKeywords: ["gym", "workout", "fitness"],
        minConfidence: 20,
        description: "Sports: Broad match from multiple aliases"
    },
    // --- AUTOMOTIVE ---
    {
        query: "car accessories",
        expectedCategory: "automotive",
        expectedTopResultsKeywords: ["car", "auto"],
        minConfidence: 20,
        description: "Automotive: Category level mapping"
    },
    // --- BABY ---
    {
        query: "infant care products",
        expectedCategory: "baby",
        expectedTopResultsKeywords: ["baby", "infant"],
        minConfidence: 20,
        description: "Baby: Alias extraction (infant -> baby)"
    },
    // --- GROCERIES ---
    {
        query: "dark roast coffee beans",
        expectedCategory: "food",
        expectedProductType: "coffee",
        expectedTopResultsKeywords: ["coffee", "beans", "roast"],
        minConfidence: 30,
        description: "Groceries: Product type extraction with extra modifiers"
    },
    // --- EDGE CASES ---
    {
        query: "lap tops",
        expectedCategory: "electronics",
        expectedProductType: "laptop",
        expectedTopResultsKeywords: ["laptop"],
        minConfidence: 30,
        description: "Edge Case: Different spacing (lap tops -> laptops)"
    },
    {
        query: "asdkjhaskdhasd",
        expectedTopResultsKeywords: [],
        minConfidence: 5,
        description: "Edge Case: Unknown products/gibberish should return nothing"
    },
    {
        query: "lipsticks and earphones",
        expectedCategory: "beauty",
        expectedProductType: "lipstick",
        expectedTopResultsKeywords: ["lipstick", "earphones"],
        minConfidence: 20,
        description: "Edge Case: Mixed category search (should extract at least one primary intent)"
    }
];

// Note: This is a data structure defining the regression suite.
// It can be imported by a test runner or script to validate search logic.
