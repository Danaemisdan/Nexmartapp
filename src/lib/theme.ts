export const pastelTheme = {
    deals: '#d5f3ae',       // Light Lime Green (from Asus Banner)
    furniture: '#FDF5E6',   // Warm Beige
    fashion: '#FCE4EC',     // Blush Pink
    electronics: '#E3F2FD', // Soft Blue
    beauty: '#F3E5F5',      // Lavender
    kitchen: '#E0F2F1',     // Mint
    sports: '#E1F5FE',      // Sky Blue
    medicine: '#E0F7FA',    // Aqua
    groceries: '#F1F8E9',   // Pale Green
    books: '#FFF8E1',       // Cream
    pets: '#E0F2F1',        // Light Teal
    homeDecor: '#FBE9E7',   // Peach
    default: '#F8F8F8',     // Light Gray fallback
};

export const brandColors = {
    primary: '#FF6A00',
    primaryHover: '#E65C00',
    background: '#FFFFFF',
    surface: '#F8F8F8',
    textPrimary: '#111111',
    textSecondary: '#4B5563', // gray-600
    border: '#ECECEC'
};

export const megaMenuAccents: Record<string, string> = {
    fashion: '#ec4899', // Pink
    home: '#eab308', // Yellow
    beauty: '#14b8a6', // Teal
    electronics: '#3b82f6', // Blue
    groceries: '#22c55e', // Green
    medicine: '#06b6d4', // Aqua
    sports: '#84cc16', // Lime
    default: '#FF6A00' // Brand Orange
};

export function getCategoryColor(categoryId: string): string {
    return pastelTheme[categoryId as keyof typeof pastelTheme] || pastelTheme.default;
}
