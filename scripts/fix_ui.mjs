import fs from 'fs';

// 1. Fix HomeView.tsx
const homeViewPath = './src/components/views/HomeView.tsx';
let homeView = fs.readFileSync(homeViewPath, 'utf8');
homeView = homeView.replace(/ backgroundColor=\{getCategoryColor\('[^']+'\)\}/g, '');
fs.writeFileSync(homeViewPath, homeView, 'utf8');

// 2. Fix ProductShelf.tsx
const shelfPath = './src/components/dashboard/ProductShelf.tsx';
let shelf = fs.readFileSync(shelfPath, 'utf8');
shelf = shelf.replace(/backgroundColor = '#FFFFFF'/, "backgroundColor = 'transparent'");
fs.writeFileSync(shelfPath, shelf, 'utf8');

// 3. Fix MarketplaceProductCard.tsx
const cardPath = './src/components/ui/MarketplaceProductCard.tsx';
let card = fs.readFileSync(cardPath, 'utf8');
// Fix group-hover text color (remove it)
card = card.replace(/group-hover:text-\[\#4F46E5\] transition-colors/g, 'transition-colors');
// Fix Red Deal Badge to sleek black
card = card.replace(/bg-\[\#CC0000\] text-white/g, 'bg-[#1D1D1F] text-white');
// Fix image background from gray to white to prevent white box inside gray box
card = card.replace(/bg-\[\#F5F5F7\]/g, 'bg-white');
// Add hover lift effect on the card container
card = card.replace(/hover:shadow-lg transition-all/g, 'hover:shadow-md hover:-translate-y-1 transition-all');
// Ensure text colors are using Tailwind or correct hex
card = card.replace(/text-\[\#4F46E5\]/g, 'text-indigo-600'); // Some places might still use the literal hex, convert to indigo

// Fix link colors (The image showed "Premium Wireless Headphones" in blue)
// It was probably rendered by something else? Let's make sure MarketplaceProductCard title is black.
card = card.replace(/text-sm font-semibold text-\[\#1D1D1F\]/g, 'text-sm font-semibold text-gray-900');

fs.writeFileSync(cardPath, card, 'utf8');

console.log('Fixed UI cheapness!');
