const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Wrap addToCart in useCallback
code = code.replace(/const addToCart = \(service: Service\) => \{/, 'const addToCart = useCallback((service: Service) => {');
code = code.replace(/return \[\.\.\.prev, \{ \.\.\.service, qty: 1, disP: initialDiscount \}\];\n\s*\}\);\n\s*\};/, 'return [...prev, { ...service, qty: 1, disP: initialDiscount }];\n    });\n  }, [isLoyaltyDiscountActive]);');

// Wrap handleClearAllCart in useCallback
code = code.replace(/const handleClearAllCart = \(\) => \{/, 'const handleClearAllCart = useCallback(() => {');
code = code.replace(/setCart\(\[\]\);\n\s*setConfirmAction\(null\);\n\s*\}\n\s*\}\);\n\s*\};/, 'setCart([]);\n        setConfirmAction(null);\n      }\n    });\n  }, [cart.length]);');

fs.writeFileSync('src/AppCore.tsx', code);
