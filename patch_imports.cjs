const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace(
  "} from 'lucide-react';",
  ", Clock, PackageOpen, ShoppingBag, Store, MapPin, Search } from 'lucide-react';"
);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Patched imports!");
