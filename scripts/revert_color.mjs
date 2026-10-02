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

    // Revert Indigo back to Orange across all UI files
    content = content.replace(/#4F46E5/gi, '#FF6A00');
    content = content.replace(/#4338CA/gi, '#FF8A1F');
    content = content.replace(/indigo-600/gi, '[#FF6A00]');
    content = content.replace(/indigo-700/gi, '[#FF8A1F]');
    content = content.replace(/indigo-500/gi, '[#FF6A00]'); // Some icons used indigo-500

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }
}

console.log(`Reverted colors in ${updatedCount} files.`);
