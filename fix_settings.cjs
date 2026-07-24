const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetRegex = /<div className="p-8 bg-card rounded-3xl shadow-sm border border-border\/50 space-y-6">[\s\S]*?<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">[\s\S]*?<\/div>\n       <\/div>\n/;

if (targetRegex.test(code)) {
  code = code.replace(targetRegex, "");
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched successfully!");
} else {
  console.log("Could not find the target string in src/AppCore.tsx");
}
