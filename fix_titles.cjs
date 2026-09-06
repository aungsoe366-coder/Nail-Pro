const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Dashboard, Security Update, Settings, Reset Password, Identity Reset, Welcome back
code = code.replace(/text-2xl font-extrabold tracking-tight text-slate-900 \[\.midnight_&\]:text-\[#D4AF37\] uppercase/g, 'text-2xl font-bold uppercase tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37]');

// Remove inner span with italic font-serif for Monthly Summary
code = code.replace(/Monthly <span className="italic font-serif">Summary<\/span>/g, 'Monthly Summary');
code = code.replace(/Shop <span className="italic font-serif">Expenses<\/span>/g, 'Shop Expenses');
code = code.replace(/Daily <span className="italic font-serif">Sales List<\/span>/g, 'Daily Sales List');

// 5717: Management title
code = code.replace(/className="text-xl md:text-2xl font-black tracking-widest text-slate-900 \[\.midnight_&\]:text-\[#D4AF37\] uppercase font-serif"/g, 'className="text-2xl font-bold uppercase tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37]"');

// Auth pages
code = code.replace(/className="text-xl font-black text-white tracking-widest uppercase font-serif"/g, 'className="text-2xl font-bold uppercase tracking-tight text-white"');

// Exit app
code = code.replace(/className="text-xl font-black text-foreground uppercase tracking-widest font-serif"/g, 'className="text-2xl font-bold uppercase tracking-tight text-foreground"');


fs.writeFileSync('src/AppCore.tsx', code);
console.log("Titles updated");
