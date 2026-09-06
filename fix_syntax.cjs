const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Replace \`\${ with `${
code = code.replace(/\\\`\\\$\{/g, '`${');
// Replace }\` with }`
code = code.replace(/}\\\`/g, '}`');

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Syntax fixed");
