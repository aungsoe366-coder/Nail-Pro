const fs = require('fs');
let content = fs.readFileSync('src/components/CustomSelect.tsx', 'utf8');

// Add onOpenChange to props
content = content.replace(
  "id?: string;\n}",
  "id?: string;\n  onOpenChange?: (isOpen: boolean) => void;\n}"
);

// Add onOpenChange to destructuring
content = content.replace(
  "id\n}: CustomSelectProps",
  "id,\n  onOpenChange\n}: CustomSelectProps"
);

// Call onOpenChange when setIsOpen is called
// There are multiple setIsOpen calls:
// 1. handleClickOutside -> setIsOpen(false)
// 2. button onClick -> setIsOpen(!isOpen)
// 3. option onClick -> setIsOpen(false)

content = content.replace(
  "setIsOpen(false);\n      }",
  "setIsOpen(false);\n        if (onOpenChange) onOpenChange(false);\n      }"
);

content = content.replace(
  "setIsOpen(!isOpen);",
  "const next = !isOpen; setIsOpen(next); if (onOpenChange) onOpenChange(next);"
);

content = content.replace(
  "onChange(option.value);\n                    setIsOpen(false);",
  "onChange(option.value);\n                    setIsOpen(false);\n                    if (onOpenChange) onOpenChange(false);"
);

fs.writeFileSync('src/components/CustomSelect.tsx', content);
console.log('Patched CustomSelect with onOpenChange');
