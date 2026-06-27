const fs = require('fs');
const files = ['logo.png', 'logo2.png', 'logo-icon.png', 'splash-logo.png', 'logo-full.png', 'hero_logo.png', 'logo-text.png'];
for (const file of files) {
  try {
    const buffer = fs.readFileSync('public/' + file);
    // Very naive check: just look for the string IEND which is at the end of PNGs, 
    // actually PNG color type is at byte 25.
    const colorType = buffer[25];
    const hasAlpha = colorType === 4 || colorType === 6;
    console.log(file + ': hasAlpha=' + hasAlpha + ' (colorType=' + colorType + ')');
  } catch (e) {
    console.log(file + ' not found or error');
  }
}
