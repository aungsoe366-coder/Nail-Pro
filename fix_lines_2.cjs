const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');
let lines = code.split('\n');

const newLines2 = [
  ' <div className="space-y-1">',
  '  <div className="flex flex-col gap-0.5">',
  '   <div className="flex items-center gap-2">',
  '    <span className="text-foreground font-sans font-semibold not-italic text-sm group-hover:text-primary transition-colors">',
  '    {s.staffNames && s.staffNames.length > 0 ? s.staffNames.join(\' + \') : (Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]).filter(Boolean))).join(\' + \') || s.staff)}',
  '    </span>',
  '    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{new Date(s.dateTime).toLocaleTimeString([], { hour: \'2-digit\', minute: \'2-digit\' })}</span>',
  '   </div>',
  '   <div className="text-[10px] font-sans font-semibold text-muted-foreground">',
  '     Maker: {s.makerName || (s as any).createdBy || \'System\'}',
  '   </div>',
  '  </div>',
  '  <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">',
  '  {s.payments && s.payments.length > 1 ',
  '   ? s.payments.map(p => \\`\\${p.method}: \\${p.amount.toLocaleString()}\\`).join(\' | \') ',
  '   : (s.method || \'Cash\')}',
  '  </div>',
  ' </div>'
];

lines.splice(4771, 13, ...newLines2);

fs.writeFileSync('src/AppCore.tsx', lines.join('\n'));
console.log("Replaced lines 4772-4784 successfully.");
