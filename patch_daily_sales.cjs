const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = `              <div className="space-y-0.5">
              <div className="flex items-center gap-2">
              <span className="text-xl font-serif italic text-foreground group-hover:text-primary transition-colors">
              {s.staffNames && s.staffNames.length > 0 ? s.staffNames.join(' + ') : (Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]).filter(Boolean))).join(' + ') || s.staff)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">
              {s.payments && s.payments.length > 1 
               ? s.payments.map(p => \`\${p.method}: \${p.amount.toLocaleString()}\`).join(' | ') 
               : (s.method || 'Cash')}
              </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              <span>{formatDisplayDate(s.dateTime)}</span>
              <span className="w-1 h-1 rounded-full bg-" />
              <span>{new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              </div>`;

const repl1 = `              <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold font-sans text-foreground group-hover:text-primary transition-colors">
              {s.staffNames && s.staffNames.length > 0 ? s.staffNames.join(' + ') : (Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]).filter(Boolean))).join(' + ') || s.staff)}
              </span>
              <span className="text-xs font-semibold font-sans text-muted-foreground">
                (By {s.makerName || (s as any).createdBy || 'System'})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">
              {s.payments && s.payments.length > 1 
               ? s.payments.map(p => \`\${p.method}: \${p.amount.toLocaleString()}\`).join(' | ') 
               : (s.method || 'Cash')}
              </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              <span>{formatDisplayDate(s.dateTime)}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              </div>`;

code = code.replace(target1, repl1);
fs.writeFileSync('src/AppCore.tsx', code);
