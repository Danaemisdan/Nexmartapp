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

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let updatedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Remove group-hover scale effects that make the UI look rough
    content = content.replace(/group-hover:scale-105/g, '');
    content = content.replace(/group-hover:scale-110/g, '');
    
    // Also remove hover:scale-105 just in case
    content = content.replace(/hover:scale-105/g, '');
    content = content.replace(/hover:scale-110/g, '');

    // Cleanup double spaces created by removal
    content = content.replace(/  +/g, ' ');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }
}

console.log(`Removed rough hover zoom effects in ${updatedCount} files.`);
