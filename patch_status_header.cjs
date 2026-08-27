const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldHeaderRegex = /<label className="text-\[10px\] font-black text-foreground \[\.midnight_&\]:text-slate-200 uppercase tracking-\[0\.2em\] flex items-center gap-2">\s*<Star size=\{14\} className="text-primary \[\.midnight_&\]:text-amber-400" \/>\s*Status & Rewards\s*<\/label>/;

const newHeader = `{profile?.role !== 'customer' && (
 <label className="text-[10px] font-black text-foreground [.midnight_&]:text-slate-200 uppercase tracking-[0.2em] flex items-center gap-2">
 <Star size={14} className="text-primary [.midnight_&]:text-amber-400" /> Status & Rewards
 </label>
 )}`;

if (oldHeaderRegex.test(code)) {
    code = code.replace(oldHeaderRegex, newHeader);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Success: Status header patched");
} else {
    console.log("Failed: Status header not found");
}
