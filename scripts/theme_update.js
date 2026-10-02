import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = fs.statSync(dirFile).isDirectory()
                ? walkSync(dirFile, filelist)
                : filelist.concat(dirFile);
        } catch (err) {
            if (err.code === 'OOM' || err.code === 'EMFILE') throw err;
        }
    });
    return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));

let updatedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Apple-esque aesthetic replacements
    content = content.replace(/#FF6A00/gi, '#4F46E5'); // Orange to Indigo-600
    content = content.replace(/#E65C00/gi, '#4338CA'); // Darker Orange to Indigo-700
    content = content.replace(/#111111/gi, '#1D1D1F'); // Deep Black to Apple Text Gray
    content = content.replace(/#ECECEC/gi, '#E5E7EB'); // Standard border to Gray-200
    content = content.replace(/#F8F8F8/gi, '#F5F5F7'); // Standard bg to Apple Light Gray
    content = content.replace(/bg-\[\#F0F5FF\]/gi, 'bg-gray-100'); // Search bar bg

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }
}

console.log(`Updated theme colors in ${updatedCount} files.`);
