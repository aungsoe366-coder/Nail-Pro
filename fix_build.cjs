const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
console.log(content.substring(0, 500));
