const fs = require('fs');
const https = require('https');
const path = require('path');

const placeholdersDir = path.join(__dirname, 'public', 'placeholders');

if (!fs.existsSync(placeholdersDir)) {
    fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Map of filename to LoremFlickr keyword
const imageMap = {
    // Categories
    'cat-furniture.jpg': 'furniture,interior',
    'cat-fashion.jpg': 'fashion,clothing',
    'cat-electronics.jpg': 'electronics,gadgets',
    'cat-beauty.jpg': 'cosmetics,makeup',
    'cat-groceries.jpg': 'groceries,vegetables',
    'cat-medicine.jpg': 'medicine,pharmacy',
    'cat-sports.jpg': 'sports,equipment',
    'cat-kitchen.jpg': 'kitchen,appliances',
    'cat-books.jpg': 'books,library',
    'cat-pets.jpg': 'pets,dog',

    // Banners
    'banner-1.jpg': 'fashion,model',
    'banner-2.jpg': 'furniture,livingroom',
    'banner-3.jpg': 'electronics,laptop',

    // Specific Products
    'prod-headphones.jpg': 'headphones',
    'prod-watch.jpg': 'smartwatch',
    'prod-sofa.jpg': 'sofa',
    'prod-serum.jpg': 'skincare,serum',
    'prod-sneakers.jpg': 'sneakers',
    'prod-vitamins.jpg': 'vitamins,pills',
    'prod-headset.jpg': 'headset',
    'prod-coffeetable.jpg': 'coffeetable',
    'prod-moisturizer.jpg': 'moisturizer,cream',
    'prod-runningshoes.jpg': 'runningshoes',
    'prod-tablets.jpg': 'pills,medicine',
    'prod-apples.jpg': 'apples',
    'prod-yogamat.jpg': 'yogamat'
};

async function downloadImage(filename, keyword) {
    const dest = path.join(placeholdersDir, filename);
    // Use picsum if loremflickr fails, but loremflickr is better for keywords
    // We can use source.unsplash which redirects to images.unsplash
    // Let's use `https://loremflickr.com/800/600/${keyword}?lock=${Math.floor(Math.random()*1000)}`
    // Actually, loremflickr just redirects to a specific URL.
    const url = `https://loremflickr.com/800/600/${keyword}?lock=${Math.floor(Math.random() * 1000) + 1}`;
    
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, response => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // Handle redirect
                let redirectUrl = response.headers.location;
                if (redirectUrl.startsWith('/')) {
                    redirectUrl = 'https://loremflickr.com' + redirectUrl;
                }
                https.get(redirectUrl, redirectResponse => {
                    redirectResponse.pipe(file);
                    file.on('finish', () => file.close(resolve));
                }).on('error', err => reject(err));
            } else {
                response.pipe(file);
                file.on('finish', () => file.close(resolve));
            }
        }).on('error', err => reject(err));
    });
}

async function main() {
    for (const [filename, keyword] of Object.entries(imageMap)) {
        console.log(`Fetching ${filename} for keyword [${keyword}]...`);
        try {
            await downloadImage(filename, keyword);
        } catch (e) {
            console.error(`Failed to download ${filename}:`, e.message);
        }
    }
    console.log('All category-specific placeholders downloaded.');
}

main();
