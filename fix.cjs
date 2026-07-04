const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
content = content.replace(/<\/form>\s*\{hasBiometric && \([\s\S]*?Use Biometrics<\/span>\s*<\/button>\s*\)\}\s*\{hasBiometric && \([\s\S]*?Use Biometrics<\/span>\s*<\/button>\s*\)\}/g, '</form>');
fs.writeFileSync('src/AppCore.tsx', content);
