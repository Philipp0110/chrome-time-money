const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../icons');
const destDir = path.join(__dirname, '../dist/icons');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    if (fs.lstatSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

if (fs.existsSync(srcDir)) {
  copyDir(srcDir, destDir);
  console.log('Copied icons directory to dist/icons.');
} else {
  console.warn('icons directory not found.');
} 