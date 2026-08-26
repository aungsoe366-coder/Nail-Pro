const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldBanner = `<div className="bg-[#4A2E31] text-white p-4 rounded-2xl relative overflow-hidden">
 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
 <div className="relative z-10 space-y-2">
 <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37] uppercase">Welcome back, {profile?.name || 'Beautiful'}!</h2>
 <p className="text-white/80">Ready for your next salon experience?</p>
 </div>
 </div>`;

const newBanner = `<div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 border border-amber-200 p-4 rounded-2xl relative overflow-hidden [.midnight_&]:from-amber-900/30 [.midnight_&]:via-amber-800/20 [.midnight_&]:to-orange-900/30 [.midnight_&]:border-amber-700/50">
 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 [.midnight_&]:bg-amber-500/10 rounded-full blur-3xl"></div>
 <div className="relative z-10 space-y-2">
 <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37] uppercase">Welcome back, {profile?.name || 'Beautiful'}!</h2>
 <p className="text-amber-800/80 [.midnight_&]:text-amber-200/80 font-medium">Ready for your next salon experience?</p>
 </div>
 </div>`;

code = code.replace(oldBanner, newBanner);

fs.writeFileSync('src/AppCore.tsx', code);
