const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace(", User } from 'lucide-react';", "} from 'lucide-react';\nimport { User as UserIcon } from 'lucide-react';");
code = code.replace("<User size={20} strokeWidth={location.pathname === '/settings' ? 2.5 : 2} />", "<UserIcon size={20} strokeWidth={location.pathname === '/settings' ? 2.5 : 2} />");

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Fixed UserIcon import");
