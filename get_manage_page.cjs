const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const start = content.indexOf('const ManagePage');
const ret = content.indexOf('return (', start);
console.log(content.substring(ret, ret + 1500));
