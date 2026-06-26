require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
    const indexPath = path.resolve(__dirname, '../../public/data/index.json');
    if (!fs.existsSync(indexPath)) {
        console.error('Could not find public/data/index.json');
        process.exit(1);
    }

    const rawData = fs.readFileSync(indexPath, 'utf-8');
    const products = JSON.parse(rawData).map(p => ({
        ...p,
        stock: 100,
        description: 'Premium quality product.'
    }));

    console.log(`Found ${products.length} products locally. Upserting to Supabase...`);

    const { data, error } = await supabase.from('products').upsert(products, { onConflict: 'id' });

    if (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }

    console.log('Successfully seeded database!');
    process.exit(0);
}

seed();
