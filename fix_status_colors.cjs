const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. Helper function to generate class strings for status
const statusClasses = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 [.midnight_&]:bg-amber-500/10 [.midnight_&]:text-amber-400 [.midnight_&]:border-amber-500/30",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200 [.midnight_&]:bg-blue-500/10 [.midnight_&]:text-blue-400 [.midnight_&]:border-blue-500/30",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 [.midnight_&]:bg-emerald-500/10 [.midnight_&]:text-emerald-400 [.midnight_&]:border-emerald-500/30",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200 [.midnight_&]:bg-rose-500/10 [.midnight_&]:text-rose-400 [.midnight_&]:border-rose-500/30"
};

// Replace Appointment Management List (lines 6211-6220)
// Old: 
// appt.status === 'pending' && "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
// appt.status === 'confirmed' && "bg-blue-500/10 text-blue-600 border-blue-500/30",
// appt.status === 'completed' && "bg-green-500/10 text-green-600 border-green-500/30",
// appt.status === 'cancelled' && "bg-red-500/10 text-red-600 border-red-500/30"

code = code.replace(/appt\.status === 'pending' && "bg-yellow-500\/10[^"]+",/g, `appt.status === 'pending' && "${statusClasses.pending}",`);
code = code.replace(/appt\.status === 'confirmed' && "bg-blue-500\/10[^"]+",/g, `appt.status === 'confirmed' && "${statusClasses.confirmed}",`);
code = code.replace(/appt\.status === 'completed' && "bg-green-500\/10[^"]+",/g, `appt.status === 'completed' && "${statusClasses.completed}",`);
code = code.replace(/appt\.status === 'cancelled' && "bg-red-500\/10[^"]+"/g, `appt.status === 'cancelled' && "${statusClasses.cancelled}"`);

// Replace Dashboard "TODAY'S APPOINTMENTS" Time pill (line 1941)
// a.status === 'confirmed' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
const timePillReplacement = `a.status === 'confirmed' ? "bg-blue-50 text-blue-700 [.midnight_&]:bg-blue-500/10 [.midnight_&]:text-blue-400" :
                                  a.status === 'completed' ? "bg-emerald-50 text-emerald-700 [.midnight_&]:bg-emerald-500/10 [.midnight_&]:text-emerald-400" :
                                  a.status === 'cancelled' ? "bg-rose-50 text-rose-700 [.midnight_&]:bg-rose-500/10 [.midnight_&]:text-rose-400" :
                                  "bg-amber-50 text-amber-700 [.midnight_&]:bg-amber-500/10 [.midnight_&]:text-amber-400"`;
code = code.replace(/a\.status === 'confirmed' \? "bg-green-500\/10 text-green-500" : "bg-yellow-500\/10 text-yellow-500"/g, timePillReplacement);

// Replace Dashboard "TODAY'S APPOINTMENTS" Badge (line 1952)
// a.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
const badgeReplacement = `a.status === 'confirmed' ? "${statusClasses.confirmed}" :
                                  a.status === 'completed' ? "${statusClasses.completed}" :
                                  a.status === 'cancelled' ? "${statusClasses.cancelled}" :
                                  "${statusClasses.pending}"`;
code = code.replace(/a\.status === 'confirmed' \? "bg-green-500\/10 text-green-500 border-green-500\/20" : "bg-yellow-500\/10 text-yellow-500 border-yellow-500\/20"/g, badgeReplacement);


fs.writeFileSync('src/AppCore.tsx', code);
console.log('Replacements completed (Part 1).');
