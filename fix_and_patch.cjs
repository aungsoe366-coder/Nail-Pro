const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. Fix the broken tags at the end of HistoryPage item
const brokenTagsRegex = /<span className="text-2xl font-mono font-bold text-primary">\{s\.total\.toLocaleString\(\)\} Ks<\/span>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/motion\.div>\s*\)\)\}\s*<\/AnimatePresence>/;

const fixedTags = `<span className="text-2xl font-mono font-bold text-primary">{s.total.toLocaleString()} Ks</span>
              </div>
              </div>
              </div>
              </div>
              </motion.div>
              )}
              </AnimatePresence>
              </motion.div>
              ))}
              </AnimatePresence>`;

if (code.match(brokenTagsRegex)) {
    code = code.replace(brokenTagsRegex, fixedTags);
    console.log("Restored original closing tags");
} else {
    console.log("Failed to match broken tags");
}

// 2. Remove layout from parent motion.div
const layoutRegex = /expandedSaleId === s\.id \? "ring-2 ring-primary\/20 border-primary\/30" : ""\s*\)\}\s*layout\s*variants=\{\{/g;
const layoutReplacement = `expandedSaleId === s.id ? "ring-2 ring-primary/20 border-primary/30" : ""
             )}
             variants={{`;
if (code.match(layoutRegex)) {
    code = code.replace(layoutRegex, layoutReplacement);
    console.log("Removed layout from parent motion.div");
}

// 3. Replace AnimatePresence opening with CSS Grid transition
const animatePresenceRegex = /<AnimatePresence mode="wait">\s*\{expandedSaleId === s\.id && \(\s*<motion\.div\s*initial=\{\{ opacity: 0 \}\}\s*animate=\{\{ opacity: 1, transition: \{ duration: 0\.18, ease: "easeInOut" \} \}\}\s*exit=\{\{ opacity: 0, transition: \{ duration: 0\.18, ease: "easeInOut" \} \}\}\s*className="px-4 md:px-6 pb-6 overflow-hidden"\s*>\s*<div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-3">/g;

const gridReplacement = `<div 
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-in-out w-full",
                  expandedSaleId === s.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                )}
              >
                <div className="overflow-hidden w-full px-4 md:px-6">
                  <div className="pb-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-3 w-full whitespace-normal border-t border-border/10">`;

if (code.match(animatePresenceRegex)) {
    code = code.replace(animatePresenceRegex, gridReplacement);
    console.log("Replaced AnimatePresence with CSS Grid transition");
}

// 4. Replace AnimatePresence closing with CSS Grid transition closing
// Now that we restored original tags, we replace:
// </motion.div>
// )}
// </AnimatePresence>
// with:
// </div>
// </div>
// </div>
const closingRegex = /<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*<\/motion\.div>\s*\)\)\}\s*<\/AnimatePresence>/g;
const closingReplacement = `</div>
              </div>
              </div>
              </div>
              </motion.div>
              ))}
              </AnimatePresence>`;

if (code.match(closingRegex)) {
    code = code.replace(closingRegex, closingReplacement);
    console.log("Replaced closing AnimatePresence with grid divs");
} else {
    console.log("Failed to match closing tags for grid replacement");
}

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Saved AppCore.tsx");
