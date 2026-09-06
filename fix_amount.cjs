const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Replace \${p.amount.toLocaleString()} with ${p.amount.toLocaleString()}
code = code.replace(/\\\$\{p\.amount\.toLocaleString\(\)\}/g, '${p.amount.toLocaleString()}');

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Amount syntax fixed");
