const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

// The class name for the card:
const cardClassTarget = '"bg-card border border-border rounded-2xl p-4 transition-all group relative overflow-hidden"';
const cardClassReplacement = '"bg-card border border-border rounded-2xl p-4 transition-all group relative hover:z-50 focus-within:z-50"';

// The corner decoration:
const decoTarget = '<div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-bl-[3rem] -mr-8 -mt-8 transition-all group-hover:scale-110 group-hover:bg-primary/20"></div>';
const decoReplacement = '<div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"><div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-bl-[3rem] -mr-8 -mt-8 transition-all group-hover:scale-110 group-hover:bg-primary/20"></div></div>';

let modified = content;
modified = modified.split(cardClassTarget).join(cardClassReplacement);
modified = modified.split(decoTarget).join(decoReplacement);

if (modified !== content) {
    fs.writeFileSync('src/AppCore.tsx', modified);
    console.log("Fixed overflow and z-index on cards");
} else {
    console.log("No changes made");
}
