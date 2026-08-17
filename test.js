const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const splitIndex = content.indexOf('/>import { Filter }');
console.log('Index:', splitIndex);
