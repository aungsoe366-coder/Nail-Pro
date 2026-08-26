const fs = require('fs');
let lines = fs.readFileSync('src/AppCore.tsx', 'utf8').split('\n');

const newHeader = `<div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-2">
 <div className="flex flex-col gap-0.5">
 <h1 className="text-xl md:text-2xl font-black tracking-widest text-slate-900 [.midnight_&]:text-[#D4AF37] uppercase font-serif">
 {isCustomer ? 'My Appointments' : 'Appointments'}</h1>
 <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
   View and manage your bookings
 </p>`;

let startIndex = -1;
let endIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('My Appointments\' : \'Customer Appointments\'}')) {
    startIndex = i - 3; // line 5595
    endIndex = i + 1; // line 5599 </h1>
    break;
  }
}

if (startIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 1, newHeader);
  fs.writeFileSync('src/AppCore.tsx', lines.join('\n'));
  console.log("Header replaced at lines " + startIndex + " to " + endIndex);
} else {
  console.log("Header NOT matched.");
}
