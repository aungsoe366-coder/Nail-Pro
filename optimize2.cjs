const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. Remove programmatic staggers completely
code = code.replace(/transition=\{\{\s*delay: index \* [0-9.]+,/g, 'transition={{ ');
code = code.replace(/transition=\{\{\s*delay: i \* [0-9.]+,/g, 'transition={{ ');
code = code.replace(/staggerChildren:\s*[0-9.]+/g, 'staggerChildren: 0'); // completely disable stagger
code = code.replace(/delayChildren:\s*[0-9.]+/g, 'delayChildren: 0');

fs.writeFileSync('src/AppCore.tsx', code);
