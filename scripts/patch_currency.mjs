import fs from 'fs';

// 1. Patch MarketplaceProductCard.tsx
const marketplaceCardFile = '/Users/sanjeevn/Downloads/nexmart/src/components/ui/MarketplaceProductCard.tsx';
let marketplaceCard = fs.readFileSync(marketplaceCardFile, 'utf8');

marketplaceCard = marketplaceCard.replace(
  "return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);",
  "return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;"
);

fs.writeFileSync(marketplaceCardFile, marketplaceCard);

// 2. Patch HeroProductCard.tsx
const heroCardFile = '/Users/sanjeevn/Downloads/nexmart/src/components/ui/HeroProductCard.tsx';
let heroCard = fs.readFileSync(heroCardFile, 'utf8');

heroCard = heroCard.replace(
  "return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);",
  "return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;"
);

fs.writeFileSync(heroCardFile, heroCard);

console.log("Patched all localized formatting to Naira!");
