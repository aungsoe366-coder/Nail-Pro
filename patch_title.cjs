const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldHeader = `<h1 className="text-2xl font-extrabold tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37] uppercase">
 {isCustomer ? 'My Appointments' : 'Customer Appointments'}</h1>`;

const newHeader = `<h1 className="text-2xl font-extrabold tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37] uppercase">
 {isCustomer ? 'My Appointments' : 'Customer Appointments'}</h1>
<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
  View and manage your bookings
</p>`;

code = code.replace(oldHeader, newHeader);

fs.writeFileSync('src/AppCore.tsx', code);
