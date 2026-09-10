const fs = require('fs');
let code = fs.readFileSync('src/pages/NailGalleryPage.tsx', 'utf8');
code = "import { useLocation } from 'react-router-dom';\n" + code;
fs.writeFileSync('src/pages/NailGalleryPage.tsx', code);
