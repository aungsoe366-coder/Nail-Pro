const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const search = '<div className="p-4 bg-card border border-border rounded-2xl flex flex-col space-y-4 relative overflow-hidden">';
console.log("Found:", content.indexOf(search));
if (content.indexOf(search) !== -1) {
    const substr = content.substring(content.indexOf(search), content.indexOf(search) + 2000);
    console.log(substr);
}
