const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace(
  "import { Minus, Percent , Clock, PackageOpen, ShoppingBag, Store, MapPin, Search } from 'lucide-react';",
  "import { Minus, Percent, PackageOpen, ShoppingBag, MapPin } from 'lucide-react';"
);

fs.writeFileSync('src/AppCore.tsx', code);
