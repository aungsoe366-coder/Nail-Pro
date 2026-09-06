const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace(/className="text-5xl sm:text-6xl font-serif text-white tracking-\[0\.25em\] leading-none mb-4 uppercase ml-4 text-"/g, 'className="text-5xl sm:text-6xl font-bold uppercase tracking-tight text-white mb-4 ml-4"');
code = code.replace(/className="text-xs sm:text-sm font-medium text-white\/90 uppercase tracking-\[0\.5em\] ml-2 font-serif"/g, 'className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-[0.5em] ml-2"');

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Fonts fixed");
