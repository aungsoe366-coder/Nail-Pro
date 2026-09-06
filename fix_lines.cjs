const fs = require('fs');

let code = fs.readFileSync('src/AppCore.tsx', 'utf8');
let lines = code.split('\n');

const newLines1 = [
  '              <div className="space-y-1">',
  '                <div className="flex flex-col gap-1">',
  '                  <div className="flex items-center gap-2">',
  '                    <span className="text-lg font-sans font-semibold not-italic text-foreground group-hover:text-primary transition-colors">',
  '                      {s.staffNames && s.staffNames.length > 0 ? s.staffNames.join(\' + \') : (Array.from(new Set(s.items?.flatMap(i => (i.staffAssignments && i.staffAssignments.length > 0) ? i.staffAssignments.map(a => a.name) : [i.staffName || s.staff]).filter(Boolean))).join(\' + \') || s.staff)}',
  '                    </span>',
  '                    <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">',
  '                      {s.payments && s.payments.length > 1',
  '                        ? s.payments.map(p => \\`\\${p.method}: \\${p.amount.toLocaleString()}\\`).join(\' | \')',
  '                        : (s.method || \'Cash\')}',
  '                    </span>',
  '                  </div>',
  '                  <div className="text-xs font-sans font-semibold text-muted-foreground">',
  '                    Maker: {s.makerName || (s as any).createdBy || \'System\'}',
  '                  </div>',
  '                </div>'
];

// Lines 4378 is index 4377
lines.splice(4377, 11, ...newLines1);

fs.writeFileSync('src/AppCore.tsx', lines.join('\n'));
console.log("Replaced lines 4378-4388 successfully.");
