const fs = require('fs');
let content = fs.readFileSync('src/components/CustomSelect.tsx', 'utf8');

content = content.replace(
  "e.stopPropagation();\n          setIsOpen(!isOpen);",
  "e.stopPropagation();\n          e.currentTarget.focus();\n          setIsOpen(!isOpen);"
);

fs.writeFileSync('src/components/CustomSelect.tsx', content);
console.log('Fixed CustomSelect focus');
