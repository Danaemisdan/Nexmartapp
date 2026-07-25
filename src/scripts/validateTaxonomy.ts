import { canonicalTaxonomies, CanonicalTaxonomy } from '../lib/taxonomy';
import { normalizeTaxonomyTerm } from '../lib/normalizer';

export function validateTaxonomy(taxonomies: CanonicalTaxonomy[] = canonicalTaxonomies) {
    let hasErrors = false;
    let hasWarnings = false;
    const allAliases = new Map<string, CanonicalTaxonomy>();
    const seenDefinitions = new Set<string>();

    console.log('🔍 Starting Taxonomy Validation...\n');

    taxonomies.forEach((taxonomy, index) => {
        const identifier = `${taxonomy.category || 'NO_CAT'}:${taxonomy.subcategory || 'NO_SUB'}:${taxonomy.productType || 'NO_PT'}`;
        
        // 1. Missing category
        if (!taxonomy.category) {
            console.error(`❌ Error [Index ${index}]: Missing category. Every taxonomy must have a category.`);
            hasErrors = true;
        }

        // 2. Missing productType (Warning since broad categories exist)
        if (!taxonomy.productType) {
            console.warn(`⚠️ Warning [Index ${index} - ${identifier}]: Missing productType. Broad category catch-alls are allowed, but check if intentional.`);
            hasWarnings = true;
        }

        // 3. Empty alias lists
        if (!taxonomy.aliases || taxonomy.aliases.length === 0) {
            console.error(`❌ Error [Index ${index} - ${identifier}]: Empty alias list.`);
            hasErrors = true;
        }

        // 4. Duplicate canonical definitions
        if (seenDefinitions.has(identifier)) {
            console.error(`❌ Error [Index ${index}]: Duplicate canonical definition found for ${identifier}.`);
            hasErrors = true;
        }
        seenDefinitions.add(identifier);

        // Alias Checks
        taxonomy.aliases?.forEach(alias => {
            const normalized = normalizeTaxonomyTerm(alias);
            
            // 5. Invalid normalization (empty after normalization)
            if (!normalized) {
                console.error(`❌ Error [Index ${index} - ${identifier}]: Invalid alias "${alias}" normalizes to empty string.`);
                hasErrors = true;
                return;
            }

            // 6. Conflicting aliases & 7. Duplicate aliases
            if (allAliases.has(normalized)) {
                const existing = allAliases.get(normalized)!;
                const existingId = `${existing.category || 'NO_CAT'}:${existing.subcategory || 'NO_SUB'}:${existing.productType || 'NO_PT'}`;
                
                if (existingId === identifier) {
                    console.warn(`⚠️ Warning [Index ${index} - ${identifier}]: Duplicate alias "${alias}" within the same definition.`);
                    hasWarnings = true;
                } else {
                    console.error(`❌ Error: Conflicting alias "${alias}" (normalized: "${normalized}") found in both [${existingId}] and [${identifier}].`);
                    hasErrors = true;
                }
            } else {
                allAliases.set(normalized, taxonomy);
            }
        });
    });

    console.log('\n--- Validation Summary ---');
    if (!hasErrors && !hasWarnings) {
        console.log('✅ Taxonomy validation passed with NO issues.');
    } else if (!hasErrors && hasWarnings) {
        console.log('✅ Taxonomy validation passed with WARNINGS.');
    } else {
        console.log('❌ Taxonomy validation FAILED with ERRORS. Please fix them.');
    }
}

// Run if executed directly
if (require.main === module) {
    validateTaxonomy();
}
