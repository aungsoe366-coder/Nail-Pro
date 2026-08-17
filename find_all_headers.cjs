const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /const ([A-Z][a-zA-Z0-9_]*Page)[\s\S]*?return\s*\(\s*(?:<[^>]+>\s*)*<(h[1236]|div|span)[^>]*class(?:Name)?="([^"]+)"[^>]*>([^<]+)<\/\2>/g;

let match;
while ((match = regex.exec(content)) !== null) {
   console.log(`--- ${match[1]} ---`);
   console.log(`<${match[2]} className="${match[3]}">${match[4]}</${match[2]}>`);
}
