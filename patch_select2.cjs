const fs = require('fs');
let content = fs.readFileSync('src/components/CustomSelect.tsx', 'utf8');

content = content.replace(
  "const handleClickOutside = (event: MouseEvent) => {",
  "const handleClickOutside = (event: MouseEvent | TouchEvent) => {"
);

fs.writeFileSync('src/components/CustomSelect.tsx', content);
console.log('Fixed CustomSelect type');
