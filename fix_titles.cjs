const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const replacements = [
    {
        target: /<h3 className="text-2xl font-black tracking-tighter text-foreground uppercase">\s*Dashboard\s*<\/h3>/g,
        replacement: '<h3 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">Dashboard</h3>'
    },
    {
        target: /<h3 className="text-3xl font-light tracking-tight text-foreground">\s*Monthly <span className="italic font-serif">Summary<\/span>\s*<\/h3>/g,
        replacement: '<h3 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">Monthly Summary</h3>' // wait, instruction says "Do NOT change the actual text content" -> "Monthly <span..."? 
    }
];
