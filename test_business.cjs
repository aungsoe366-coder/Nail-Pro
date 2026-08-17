const fs = require('fs');
const content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

const match = content.match(/<h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">\s*Business Analytics\s*<\/h1>/);
if (match) {
    console.log("FOUND BusinessAnalysisPage title");
} else {
    console.log("MISSING BusinessAnalysisPage title");
}
