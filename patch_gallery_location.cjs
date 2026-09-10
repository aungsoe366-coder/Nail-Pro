const fs = require('fs');
let code = fs.readFileSync('src/pages/NailGalleryPage.tsx', 'utf8');

if (!code.includes('useLocation')) {
    code = code.replace(
        "import { useNavigate } from 'react-router-dom';",
        "import { useNavigate, useLocation } from 'react-router-dom';"
    );
    if (!code.includes('useLocation')) {
       // Maybe it imports react-router-dom differently
       code = code.replace(
         "import { useNavigate } from 'react-router-dom';",
         "import { useNavigate, useLocation } from 'react-router-dom';"
       );
    }
}

code = code.replace(
  "const [customerTab, setCustomerTab] = useState<'gallery'|'orders'>('gallery');",
  `const location = useLocation();\n  const [customerTab, setCustomerTab] = useState<'gallery'|'orders'>((location.state as any)?.tab || 'gallery');\n  useEffect(() => {\n    if ((location.state as any)?.tab) {\n       setCustomerTab((location.state as any).tab);\n    }\n  }, [location.state]);`
);

fs.writeFileSync('src/pages/NailGalleryPage.tsx', code);
console.log("Patched Gallery with useLocation!");
