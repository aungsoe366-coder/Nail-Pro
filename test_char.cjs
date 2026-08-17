const fs = require('fs');
const content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');
const origStart = content.substring(0, 42);
console.log("First 42:", origStart);
