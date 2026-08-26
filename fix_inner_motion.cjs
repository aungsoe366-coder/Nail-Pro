const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Replace expanded section
code = code.replace(
  /\{expandedSaleId === s\.id && \(\s*<div className="px-4 md:px-6 pb-6 animate-in slide-in-from-top-4 duration-300">/,
  `<AnimatePresence>
              {expandedSaleId === s.id && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1, transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.05, delayChildren: 0.1 } }}
                exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                className="px-4 md:px-6 pb-6 overflow-hidden"
              >`
);

code = code.replace(
  /<h5 className="text-\[10px\] font-bold uppercase tracking-\[0\.2em\] text-muted-foreground flex items-center gap-2">\s*<div className="w-1\.5 h-1\.5 rounded-full bg-primary" \/>\s*Purchased Items\s*<\/h5>\s*<div className="space-y-2">\s*\{s\.items\.map\(\(item, idx\) => \(\s*<div key=\{idx\} className="bg-muted\/30 p-4 rounded-2xl flex items-center justify-between group\/item hover:bg-muted\/50 transition-colors">/,
  `<motion.h5 variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} initial="hidden" animate="show" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Purchased Items
              </motion.h5>
              <div className="space-y-2">
              {s.items.map((item, idx) => (
              <motion.div 
                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }} 
                initial="hidden" animate="show" 
                key={idx} 
                className="bg-muted/30 p-4 rounded-2xl flex items-center justify-between group/item hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(var(--muted), 0.7)' }}
              >`
);

// We need to close the AnimatePresence for the expanded item.
// Find:
//               <div className="text-[9px] text-muted-foreground font-mono truncate max-w-[200px]">{s.id}</div>
//               </div>
//               </div>
//               </div>
//               </div>
//               )}
//               </motion.div>

code = code.replace(
  /<div className="text-\[9px\] text-muted-foreground font-mono truncate max-w-\[200px\]">\{s\.id\}<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/motion\.div>/,
  `<div className="text-[9px] text-muted-foreground font-mono truncate max-w-[200px]">{s.id}</div>
              </div>
              </div>
              </div>
              </motion.div>
              )}
              </AnimatePresence>
              </motion.div>`
);

// Close the motion.div for Purchased items
code = code.replace(
  /<\/div>\s*<\/div>\s*<div className="space-y-3">/,
  `</motion.div>
              </div>
              <div className="space-y-3">`
)


fs.writeFileSync('src/AppCore.tsx', code);
