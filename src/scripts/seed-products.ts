/**
 * One-time seed script.
 * Converts src/lib/ovaloop_products.json → public/data/products/[id].json + public/data/index.json
 * Run: npx tsx src/scripts/seed-products.ts
 */
import { seedFromLegacy } from '../lib/db';

async function main() {
  console.log('Seeding products from legacy JSON...');
  const total = await seedFromLegacy();
  console.log(`Done! Seeded ${total} products to public/data/products/`);
}

main().catch(console.error);
