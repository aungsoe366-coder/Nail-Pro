const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Find HistoryPage and update the list animation
// 1. the group container:
// <div className="grid grid-cols-1 gap-4">
// <AnimatePresence>{sales.map((s) => (

// 2. The item:
// <motion.div 
// key={s.id} 
// onClick={() => setExpandedSaleId(expandedSaleId === s.id ? null : s.id)}
// className={cn(
// "group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover: hover:border-primary/30",
// expandedSaleId === s.id ? "ring-2 ring-primary/20 border-primary/30" : ""
// )} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
// >

code = code.replace(
  /<div className="grid grid-cols-1 gap-4">\s*<AnimatePresence>\{sales\.map\(s => \(\s*<motion\.div\s*key=\{s\.id\}\s*onClick=\{\(\) => setExpandedSaleId\(expandedSaleId === s\.id \? null : s\.id\)\}\s*className=\{cn\(\s*"group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover: hover:border-primary\/30",\s*expandedSaleId === s\.id \? "ring-2 ring-primary\/20 border-primary\/30" : ""\s*\)\}\s*layout\s*initial=\{\{\s*opacity:\s*0,\s*scale:\s*0\.95\s*\}\}\s*animate=\{\{\s*opacity:\s*1,\s*scale:\s*1\s*\}\}\s*exit=\{\{\s*opacity:\s*0,\s*scale:\s*0\.95\s*\}\}\s*transition=\{\{\s*duration:\s*0\.2\s*\}\}\s*>/,
  `<motion.div 
  variants={{
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }}
  initial="hidden"
  animate="show"
  className="grid grid-cols-1 gap-4">
<AnimatePresence>{sales.map((s, index) => (
             <motion.div 
             key={s.id} 
             onClick={() => setExpandedSaleId(expandedSaleId === s.id ? null : s.id)}
             className={cn(
             "group bg-card border border-border rounded-2xl overflow-hidden transition-colors cursor-pointer hover:border-primary/30",
             expandedSaleId === s.id ? "ring-2 ring-primary/20 border-primary/30" : ""
             )}
             layout 
             variants={{
               hidden: { opacity: 0, y: 20, scale: 0.98 },
               show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 25 } },
               exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
             }}
             whileHover={{ scale: 1.01 }}
             whileTap={{ scale: 0.98 }}
             >`
);

// We need to close motion.div instead of div for grid grid-cols-1 gap-4
// The original was:
// </div> (end of grid grid-cols-1)

code = code.replace(
  /<\/AnimatePresence>\s*<\/div>/g,
  `</AnimatePresence>\n</motion.div>`
);

fs.writeFileSync('src/AppCore.tsx', code);
