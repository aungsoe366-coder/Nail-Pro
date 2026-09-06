const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = ` <div className="text-center">
 <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Total Cash</span>
 <span className="text-sm font-mono font-bold text-green-600">{totalCash.toLocaleString()} Ks</span>
 </div>
 <div className="w-px h-6 bg-/50"></div>
 <div className="text-center">
 <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Total KPay/Digital</span>
 <span className="text-sm font-mono font-bold text-blue-600">{totalDigital.toLocaleString()} Ks</span>
 </div>`;

const repl1 = ` <div className="text-center">
 <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Total Cash</span>
 <span className="text-sm font-mono font-bold text-green-600">{totalCash.toLocaleString()} Ks</span>
 </div>
 <div className="text-muted-foreground/30 font-light mx-1">|</div>
 <div className="text-center">
 <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Total KPay/Digital</span>
 <span className="text-sm font-mono font-bold text-blue-600">{totalDigital.toLocaleString()} Ks</span>
 </div>`;

code = code.replace(target1, repl1);
fs.writeFileSync('src/AppCore.tsx', code);
