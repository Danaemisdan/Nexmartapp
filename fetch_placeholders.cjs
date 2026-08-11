const fs = require('fs');
const https = require('https');
const path = require('path');

const placeholdersDir = path.join(__dirname, 'public', 'placeholders');

if (!fs.existsSync(placeholdersDir)) {
    fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Map of filenames to Unsplash image IDs for realistic placeholders
const imagesToFetch = {
    'banner-1.jpg': '1607082349566-18734217500f', // Fashion/Lifestyle
    'banner-2.jpg': '1556228578-0d85b1a4d571', // Furniture/Home
    'banner-3.jpg': '1498049794561-8a9abd1095b6', // Electronics
    
    // Categories
    'cat-furniture.jpg': '1555041469-a586c61ea9bc',
    'cat-fashion.jpg': '1445205170230-053b83016050',
    'cat-electronics.jpg': '1498049794561-8a9abd1095b6',
    'cat-beauty.jpg': '1596462502278-27bfdc403348',
    'cat-groceries.jpg': '1542838132-92c53300491e',
    'cat-medicine.jpg': '1584308666744-24d5e4785b8c',
    'cat-sports.jpg': '1517836357463-d25dfeac3438',
    
    // Products (generic)
    'prod-1.jpg': '1505740420928-5e560c06d30e', // Headphones
    'prod-2.jpg': '1523275335684-37898b6baf30', // Watch
    'prod-3.jpg': '1564466809059-eb5e4481cbdf', // Couch
    'prod-4.jpg': '1583394834005-f3708e1aed31', // Skincare
    'prod-5.jpg': '1521556662401-524619ea6402', // Shoes
    'prod-6.jpg': '1587854692152-cbe668efd388'  // Medicine bottle
};

async function downloadImage(filename, imageId) {
    const dest = path.join(placeholdersDir, filename);
    const url = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800`;
    
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // Handle redirect
                https.get(response.headers.location, redirectResponse => {
                    redirectResponse.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                }).on('error', err => {
                    fs.unlink(dest, () => reject(err));
                });
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            }
        }).on('error', err => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function main() {
    console.log('Downloading placeholders...');
    for (const [filename, imageId] of Object.entries(imagesToFetch)) {
        try {
            await downloadImage(filename, imageId);
            console.log(`Downloaded ${filename}`);
        } catch (err) {
            console.error(`Failed to download ${filename}:`, err.message);
        }
    }
    console.log('Done!');
}

main();
