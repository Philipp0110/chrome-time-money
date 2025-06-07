const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../dist/src/popup/popup.html');
const dest = path.join(__dirname, '../dist/popup.html');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Copied popup.html to dist root.');
} else {
  console.warn('popup.html not found in dist/src/popup.');
} 