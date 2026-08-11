const fs = require('fs');
const https = require('https');
const path = require('path');

const placeholdersDir = path.join(__dirname, 'public', 'placeholders');

const brokenImages = [
    'banner-1.jpg',
    'banner-3.jpg',
    'cat-electronics.jpg',
    'cat-medicine.jpg',
    'prod-3.jpg',
    'prod-4.jpg',
    'prod-5.jpg',
    'prod-6.jpg'
];

// We'll use picsum for the broken ones to guarantee a result, with specific seeds for consistency
async function downloadImage(filename, index) {
    const dest = path.join(placeholdersDir, filename);
    const url = `https://picsum.photos/seed/nexmart${index}/800/600`;
    
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                https.get(response.headers.location, redirectResponse => {
                    redirectResponse.pipe(file);
                    file.on('finish', () => file.close(resolve));
                });
            } else {
                response.pipe(file);
                file.on('finish', () => file.close(resolve));
            }
        }).on('error', err => reject(err));
    });
}

async function main() {
    for (let i = 0; i < brokenImages.length; i++) {
        const file = brokenImages[i];
        console.log(`Fixing ${file}...`);
        await downloadImage(file, i);
    }
    console.log('Fixed broken images.');
}

main();
