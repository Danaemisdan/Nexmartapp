import fs from 'fs';
import path from 'path';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir('/Users/sanjeevn/Downloads/nexmart/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('₹')) {
    content = content.replace(/₹/g, '₦');
    fs.writeFileSync(file, content);
    console.log("Patched rupees to naira in: " + file);
  }
});
