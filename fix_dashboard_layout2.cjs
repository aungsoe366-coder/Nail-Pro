const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Appt header
code = code.replace(
  /<h4 className="text-xs font-bold tracking-wider text-stone-400 \[\.midnight_&\]:text-\[#D4AF37\] uppercase">\s*Today's Appointments\s*<\/h4>/,
  `<h4 className="text-xs font-bold tracking-wider text-stone-400 [.midnight_&]:text-[#D4AF37] uppercase flex items-center gap-2">
    Today's Appointments
    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{appointments.length}</span>
  </h4>`
);

// Recent Sales header
code = code.replace(
  /<h4 className="text-xs font-bold tracking-wider text-stone-400 \[\.midnight_&\]:text-\[#D4AF37\] uppercase">\s*Recent Sales\s*<\/h4>\s*<motion.button whileTap=\{\{ scale: 0.97 \}\} onClick=\{\(\) => navigate\('\/history'\)\} className="text-\[10px\] font-black text-primary hover:underline tracking-widest">VIEW ALL<\/motion.button>/,
  `<h4 className="text-xs font-bold tracking-wider text-stone-400 [.midnight_&]:text-[#D4AF37] uppercase flex items-center gap-2">
    Recent Sales
  </h4>
  <div className="flex items-center gap-3">
    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{sales.length} SALES</span>
    <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/history')} className="text-[10px] font-black text-primary hover:underline tracking-widest">VIEW ALL</motion.button>
  </div>`
);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Headers updated.");
