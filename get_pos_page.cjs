const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const start = content.indexOf('const POSPage');
console.log(content.substring(start, start + 800));
