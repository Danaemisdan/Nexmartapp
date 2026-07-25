export function normalizeTaxonomyTerm(term: string): string {
    if (!term) return '';
    return term
        .toLowerCase()
        .replace(/-/g, '')
        .replace(/\s+/g, '') // collapse all spaces
        .trim();
}
