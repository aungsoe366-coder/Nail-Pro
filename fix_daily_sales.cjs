const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetDailySales = `              <div className="space-y-0.5">
              <div className="flex items-center gap-2">
              <span className="text-xl font-sans font-semibold not-italic text-foreground group-hover:text-primary transition-colors">
              {s.staffNames && s.staffNames.length > 0 ? s.staffNames.join(' + ') : (Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]).filter(Boolean))).join(' + ') || s.staff)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">
              {s.payments && s.payments.length > 1 
               ? s.payments.map(p => \`\${p.method}: \${p.amount.toLocaleString()}\`).join(' | ') 
               : (s.method || 'Cash')}
              </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">`;

const replaceDailySales = `              <div className="space-y-1">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-sans font-semibold not-italic text-foreground group-hover:text-primary transition-colors">
                  {s.staffNames && s.staffNames.length > 0 ? s.staffNames.join(' + ') : (Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]).filter(Boolean))).join(' + ') || s.staff)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">
                  {s.payments && s.payments.length > 1 
                   ? s.payments.map(p => \`\${p.method}: \${p.amount.toLocaleString()}\`).join(' | ') 
                   : (s.method || 'Cash')}
                  </span>
                </div>
                <div className="text-xs font-sans font-medium text-muted-foreground">
                  Maker: {s.makerName || (s as any).createdBy || 'System'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">`;

code = code.replace(targetDailySales, replaceDailySales);
fs.writeFileSync('src/AppCore.tsx', code);
console.log("Done Daily Sales");
