import fs from 'fs';

const dataFile = '/Users/sanjeevn/Downloads/nexmart/src/lib/marketplaceData.ts';
let content = fs.readFileSync(dataFile, 'utf8');

// Multiply price values by 1500
content = content.replace(/price:\s*(\d+)/g, (match, p1) => {
  return `price: ${parseInt(p1, 10) * 1500}`;
});

// Multiply originalPrice values by 1500
content = content.replace(/originalPrice:\s*(\d+)/g, (match, p1) => {
  return `originalPrice: ${parseInt(p1, 10) * 1500}`;
});

fs.writeFileSync(dataFile, content);
console.log("Converted all marketplace prices to NGN!");
