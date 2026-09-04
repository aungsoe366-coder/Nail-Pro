const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. Remove `layout` from the sales map motion.div
const layoutRegex = /expandedSaleId === s\.id \? "ring-2 ring-primary\/20 border-primary\/30" : ""\s*\)\}\s*layout\s*variants=\{\{/g;
const layoutReplacement = `expandedSaleId === s.id ? "ring-2 ring-primary/20 border-primary/30" : ""
             )}
             variants={{`;
if (code.match(layoutRegex)) {
    code = code.replace(layoutRegex, layoutReplacement);
    console.log("Removed layout from parent motion.div");
}

// 2. Replace AnimatePresence with CSS grid transition
const animatePresenceRegex = /<AnimatePresence mode="wait">\s*\{expandedSaleId === s\.id && \(\s*<motion\.div\s*initial=\{\{ opacity: 0 \}\}\s*animate=\{\{ opacity: 1, transition: \{ duration: 0\.18, ease: "easeInOut" \} \}\}\s*exit=\{\{ opacity: 0, transition: \{ duration: 0\.18, ease: "easeInOut" \} \}\}\s*className="px-4 md:px-6 pb-6 overflow-hidden"\s*>\s*<div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-3">/g;

const gridReplacement = `<div 
                className={cn(
                  "grid transition-all duration-300 ease-in-out w-full",
                  expandedSaleId === s.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                )}
              >
                <div className="overflow-hidden w-full px-4 md:px-6">
                  <div className="pb-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-3 w-full whitespace-normal border-t border-border/10">`;

if (code.match(animatePresenceRegex)) {
    code = code.replace(animatePresenceRegex, gridReplacement);
    console.log("Replaced AnimatePresence with CSS Grid transition");
} else {
    console.log("Failed to match AnimatePresence regex");
}

// 3. Remove the closing tags of AnimatePresence and motion.div
const closingRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*<\/motion\.div>\s*\)\)}\s*<\/AnimatePresence>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;

// Wait, the structure is:
// <div className="space-y-3"> ... </div>
// </div>
// </motion.div>
// )}
// </AnimatePresence>

// Let's use a simpler replace by reading the file and replacing the specific block at the end
