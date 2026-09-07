const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Replace Update Status Modal Pending
code = code.replace(
  /statusUpdateAppt\.status === 'pending' \? "bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-500\/20" : "bg-card border-border text-yellow-600 hover:border-yellow-500\/50"/g,
  `statusUpdateAppt.status === 'pending' ? "bg-amber-100 text-amber-800 border-amber-400 shadow-lg shadow-amber-500/20 [.midnight_&]:bg-amber-900/40 [.midnight_&]:text-amber-400 [.midnight_&]:border-amber-500" : "bg-card border-border text-amber-600 hover:border-amber-500/50"`
);

code = code.replace(
  /statusUpdateAppt\.status === 'pending' \? "bg-white animate-pulse" : "bg-yellow-500"/g,
  `statusUpdateAppt.status === 'pending' ? "bg-amber-500 animate-pulse" : "bg-amber-500"`
);

// Replace Update Status Modal Confirmed
code = code.replace(
  /statusUpdateAppt\.status === 'confirmed' \? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600\/20" : "bg-card border-border text-blue-600 hover:border-blue-500\/50"/g,
  `statusUpdateAppt.status === 'confirmed' ? "bg-blue-100 text-blue-800 border-blue-400 shadow-lg shadow-blue-500/20 [.midnight_&]:bg-blue-900/40 [.midnight_&]:text-blue-400 [.midnight_&]:border-blue-500" : "bg-card border-border text-blue-600 hover:border-blue-500/50"`
);
code = code.replace(
  /statusUpdateAppt\.status === 'confirmed' \? "text-white" : "text-blue-600"/g,
  `statusUpdateAppt.status === 'confirmed' ? "text-blue-600 [.midnight_&]:text-blue-400" : "text-blue-600"`
);


// Replace Update Status Modal Completed
code = code.replace(
  /statusUpdateAppt\.status === 'completed' \? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600\/20" : "bg-card border-border text-green-600 hover:border-green-500\/50"/g,
  `statusUpdateAppt.status === 'completed' ? "bg-emerald-100 text-emerald-800 border-emerald-400 shadow-lg shadow-emerald-500/20 [.midnight_&]:bg-emerald-900/40 [.midnight_&]:text-emerald-400 [.midnight_&]:border-emerald-500" : "bg-card border-border text-emerald-600 hover:border-emerald-500/50"`
);
code = code.replace(
  /statusUpdateAppt\.status === 'completed' \? "text-white" : "text-green-600"/g,
  `statusUpdateAppt.status === 'completed' ? "text-emerald-600 [.midnight_&]:text-emerald-400" : "text-emerald-600"`
);


// Replace Update Status Modal Cancelled
code = code.replace(
  /statusUpdateAppt\.status === 'cancelled' \? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600\/20" : "bg-card border-border text-red-600 hover:border-red-500\/50"/g,
  `statusUpdateAppt.status === 'cancelled' ? "bg-rose-100 text-rose-800 border-rose-400 shadow-lg shadow-rose-500/20 [.midnight_&]:bg-rose-900/40 [.midnight_&]:text-rose-400 [.midnight_&]:border-rose-500" : "bg-card border-border text-rose-600 hover:border-rose-500/50"`
);
code = code.replace(
  /statusUpdateAppt\.status === 'cancelled' \? "text-white" : "text-red-600"/g,
  `statusUpdateAppt.status === 'cancelled' ? "text-rose-600 [.midnight_&]:text-rose-400" : "text-rose-600"`
);

// We need to fix the little pulsing dot color for pending in the list view (if any)
code = code.replace(
  /appt\.status === 'pending' && <div className="w-1\.5 h-1\.5 bg-yellow-500/g,
  `appt.status === 'pending' && <div className="w-1.5 h-1.5 bg-amber-500`
);

fs.writeFileSync('src/AppCore.tsx', code);
console.log('Update Status Modal replacement completed.');
