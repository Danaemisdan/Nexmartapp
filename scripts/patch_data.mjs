import fs from 'fs';
import path from 'path';

const dataPath = './src/lib/marketplaceData.ts';
let content = fs.readFileSync(dataPath, 'utf8');

// 1. Add fields to interface
content = content.replace(
    'categoryId: string;',
    'categoryId: string;\n  category?: string;\n  subcategory?: string;\n  productType?: string;\n  tags?: string[];'
);

// 2. Map of IDs to their new fields
const mappings = {
    'mp1': { category: 'electronics', subcategory: 'audio', productType: 'headphones', tags: ['wireless', 'premium'] },
    'mp2': { category: 'electronics', subcategory: 'wearables', productType: 'watch', tags: ['fitness', 'smart'] },
    'mp3': { category: 'home', subcategory: 'furniture', productType: 'sofa', tags: ['velvet', 'modern'] },
    'mp4': { category: 'beauty', subcategory: 'skincare', productType: 'serum', tags: ['repair', 'night'] },
    'mp5': { category: 'fashion', subcategory: 'footwear', productType: 'shoes', tags: ['sneakers', 'white', 'classic'] },
    'mp6': { category: 'medicine', subcategory: 'supplements', productType: 'vitamins', tags: ['multivitamin', 'daily'] },
    'mp7': { category: 'electronics', subcategory: 'audio', productType: 'headphones', tags: ['bluetooth', 'over-ear', 'headset'] },
    'mp8': { category: 'home', subcategory: 'furniture', productType: 'table', tags: ['coffee table', 'minimalist'] },
    'mp9': { category: 'beauty', subcategory: 'skincare', productType: 'moisturizer', tags: ['facial', 'hydrating'] },
    'mp10': { category: 'fashion', subcategory: 'footwear', productType: 'shoes', tags: ['running shoes', 'men'] },
    'mp11': { category: 'medicine', subcategory: 'supplements', productType: 'tablets', tags: ['immunity', 'booster'] },
    'mp12': { category: 'groceries', subcategory: 'produce', productType: 'fruit', tags: ['organic', 'apples'] },
    'mp13': { category: 'sports', subcategory: 'fitness', productType: 'equipment', tags: ['yoga mat', 'non-slip'] }
};

// Replace each line
for (const [id, data] of Object.entries(mappings)) {
    const regex = new RegExp(`({ id: '${id}'.*?categoryId: '[^']+') }`, 'g');
    content = content.replace(regex, `$1, category: '${data.category}', subcategory: '${data.subcategory}', productType: '${data.productType}', tags: ${JSON.stringify(data.tags)} }`);
}

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Patched marketplaceData.ts');
