const fs = require('fs');

let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// I will just use sed or string replace to fix these syntax errors.
// 1. In DashboardPage, the closing tag of AnimatePresence is wrong.
// There is an error at line 1698: `src/AppCore.tsx(1698,2): error TS2657: JSX expressions must have one parent element.`
// At line 1722: `error TS17008: JSX element 'div' has no corresponding closing tag.`
// Let's replace the whole stats map in DashboardPage:

code = code.replace(
  /<div className="grid grid-cols-2 gap-3"> <AnimatePresence>\{stats\.map\(\(s, i\) => \([\s\S]*?\}\s*<\/h4>\s*<\/motion\.div>\s*\)\)\}<\/AnimatePresence><\/div>/,
  `
<div className="grid grid-cols-2 gap-3">
  <AnimatePresence>
    {stats.map((s, i) => (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
        key={i}
        className="bg-stone-50/80 [.midnight_&]:bg-[#221C18] border border-stone-100 [.midnight_&]:border-[#3D322C] shadow-sm p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
        layout
      >
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] text-stone-500 [.midnight_&]:text-[#D4AF37] font-semibold uppercase tracking-wider leading-tight">{s.label}</p>
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-500", s.bg, s.color)}>
            {React.cloneElement(s.icon as any, { size: 16, strokeWidth: 2 })}
          </div>
        </div>
        <h4 className="text-xl font-extrabold text-slate-800 [.midnight_&]:text-[#E6DFD9] tracking-tight truncate">
          {s.value}
          {s.suffix && <span className="text-xs font-medium text-stone-500 [.midnight_&]:text-[#E6DFD9]/70 ml-1">{s.suffix}</span>}
        </h4>
      </motion.div>
    ))}
  </AnimatePresence>
</div>`
);

// We should also replace the AnimatePresence for sales in DashboardPage
code = code.replace(
  /<div className="divide-y divide-stone-100"> <AnimatePresence>\{sales\.slice\(0, 10\)\.map\(\(s, index\) => \([\s\S]*?items<\/p>\s*<\/div>\s*<\/motion\.div>\s*\)\)\}<\/AnimatePresence><\/div>/,
  `
<div className="divide-y divide-stone-100">
  <AnimatePresence>
    {sales.slice(0, 10).map((s, index) => (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
        key={s.id}
        className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group"
        layout
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-black text-xs">
            {s.customerName ? s.customerName[0].toUpperCase() : 'G'}
          </div>
          <div>
            <p className="text-sm font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{s.customerName || 'Guest Customer'}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              {formatDisplayDate(s.dateTime)} • {formatTime(s.dateTime)} • {s.method}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-foreground">{s.total.toLocaleString()} Ks</p>
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{s.items.length} items</p>
        </div>
      </motion.div>
    ))}
  </AnimatePresence>
</div>`
);

fs.writeFileSync('src/AppCore.tsx', code);
