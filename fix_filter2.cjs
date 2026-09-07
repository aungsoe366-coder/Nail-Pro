const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /if \(a\.creatorEmail !== profile\?\.email\) return false;/;
const newCode = `const isOwner = a.creatorEmail === profile?.email || a.customerEmail === profile?.email || (profile?.phone && a.customerPhone === profile?.phone);
   if (!isOwner) return false;`;

if (regex.test(code)) {
  code = code.replace(regex, newCode);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Client filter updated.");
} else {
  console.log("Could not find regex!");
}
