const fs = require('fs');

let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace(
  /<div className="space-y-2">\s*\{s\.items\.map\(\(item, idx\) => \([\s\S]*?\}\s*<\/div>\s*<\/div>\s*\}\)\}\s*<\/motion\.div>\s*<\/div>/,
  `
<div className="space-y-2">
  {s.items.map((item, idx) => (
    <motion.div
      variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
      initial="hidden" animate="show"
      key={idx}
      className="bg-muted/30 p-4 rounded-2xl flex items-center justify-between group/item hover:bg-muted/50 transition-colors"
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(var(--muted), 0.7)' }}
    >
      <div className="space-y-0.5">
        <span className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">{item.name}</span>
        <div className="text-[10px] text-muted-foreground font-mono">
          {item.qty} × {item.price.toLocaleString()} Ks
        </div>
        {(item.staffAssignments && item.staffAssignments.length > 0) ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.staffAssignments.map((a, i) => (
              <span key={i} className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{a.name} ({a.qty})</span>
            ))}
          </div>
        ) : item.staffName ? (
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest">{item.staffName}</span>
          </div>
        ) : null}
      </div>
      <div className="text-right space-y-0.5">
        <span className="text-sm font-mono font-bold text-foreground">{(item.qty * item.price).toLocaleString()} Ks</span>
        {item.disP > 0 && (
          <span className="block text-[9px] font-bold text-red-500 uppercase tracking-tighter">
            Disc: -{item.disP}% (-{((item.qty * item.price) * item.disP / 100).toLocaleString()} Ks)
          </span>
        )}
      </div>
    </motion.div>
  ))}
</div>`
);

fs.writeFileSync('src/AppCore.tsx', code);
