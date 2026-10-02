import fs from 'fs';

const storePath = './src/lib/StoreContext.tsx';
let content = fs.readFileSync(storePath, 'utf8');

// 1. Add import for marketplaceProducts
if (!content.includes('import { marketplaceProducts }')) {
    content = content.replace(
        "import { Product, fetchProducts } from './api';",
        "import { Product, fetchProducts } from './api';\nimport { marketplaceProducts } from './marketplaceData';"
    );
}

// 2. Patch the load function
const oldLoad = `      const data = await fetchProducts(LIMIT, 0);
      setProducts(data);`;
const newLoad = `      const data = await fetchProducts(LIMIT, 0);
      // Combine API products with our local marketplace dummy products 
      // so the AI can search through everything visible on the home page!
      const allProducts = [...marketplaceProducts, ...data];
      const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
      setProducts(uniqueProducts as any);`;

content = content.replace(oldLoad, newLoad);

fs.writeFileSync(storePath, content, 'utf8');
console.log('Patched StoreContext.tsx');
