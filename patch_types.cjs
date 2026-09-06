const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  'staffNamesArray?: string[];',
  'staffNamesArray?: string[];\n  makerName?: string;'
);
fs.writeFileSync('src/types.ts', code);
