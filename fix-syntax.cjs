const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Find handleClearAllCart
code = code.replace(/const handleClearAllCart = useCallback\(\(\) => \{([\s\S]*?)setConfirmAction\(null\);\n\s*\}\n\s*\}\);\n\s*\};/, 'const handleClearAllCart = useCallback(() => {$1setConfirmAction(null);\n      }\n    });\n  }, [cart.length]);');

fs.writeFileSync('src/AppCore.tsx', code);
