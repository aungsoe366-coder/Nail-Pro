const fs = require('fs');
let content = fs.readFileSync('src/components/CustomSelect.tsx', 'utf8');

content = content.replace(
  "document.addEventListener('mousedown', handleClickOutside);",
  "document.addEventListener('mousedown', handleClickOutside);\n    document.addEventListener('touchstart', handleClickOutside);"
);

content = content.replace(
  "return () => document.removeEventListener('mousedown', handleClickOutside);",
  "return () => {\n      document.removeEventListener('mousedown', handleClickOutside);\n      document.removeEventListener('touchstart', handleClickOutside);\n    };"
);

fs.writeFileSync('src/components/CustomSelect.tsx', content);
console.log('Fixed CustomSelect click outside');
