import fs from 'fs';

const filePath = '/Users/sanjeevn/Downloads/nexmart/src/lib/ResultRefinementEngine.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the buggy slice block
content = content.replace(
  /if \(isSlice[\s\S]*?newContext\.totalResultCount = newContext\.productSnapshot\.length;/m,
  `if (isSlice || lowerQuery.includes('alternative') || lowerQuery.includes('another') || lowerQuery.includes('different')) {
      if (lowerQuery.includes('alternative') || lowerQuery.includes('another') || lowerQuery.includes('different')) {
        if (newContext.productSnapshot.length > 1) {
          newContext.productSnapshot = newContext.productSnapshot.slice(1);
        }
      } else {
        const sliceMatch = lowerQuery.match(/(top|first|only|keep)\\s*(\\d+)/i) || lowerQuery.match(/(show)\\s*(only)?\\s*(\\d+)/i);
        if (sliceMatch) {
          const limit = parseInt(sliceMatch[sliceMatch.length - 1], 10);
          if (!isNaN(limit) && limit > 0) {
            newContext.productSnapshot = newContext.productSnapshot.slice(0, limit);
          }
        }
      }
    }
    
    newContext.totalResultCount = newContext.productSnapshot.length;`
);

fs.writeFileSync(filePath, content);
console.log("Fixed ResultRefinementEngine syntax!");
