const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const filterOld = `    if (profile?.role === 'customer') {
      if (a.creatorEmail !== profile?.email) return false;
      const isPast = a.status === 'completed' || a.status === 'cancelled';`;

const filterNew = `    if (profile?.role === 'customer') {
      const isOwner = a.creatorEmail === profile?.email || a.customerEmail === profile?.email || a.customerPhone === (profile?.phone || 'none');
      if (!isOwner) return false;
      const isPast = a.status === 'completed' || a.status === 'cancelled';`;

if (code.includes(filterOld)) {
  code = code.replace(filterOld, filterNew);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Client filter updated.");
} else {
  console.log("Could not find client filter!");
}
