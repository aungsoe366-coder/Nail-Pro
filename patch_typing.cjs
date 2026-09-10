const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace(
  "const appts = snap.docs.map(doc => ({id: doc.id, ...doc.data()}))",
  "const appts = snap.docs.map(doc => ({id: doc.id, ...doc.data()} as any))"
);

code = code.replace(
  "const orders = snap.docs.map(doc => ({id: doc.id, ...doc.data()}))",
  "const orders = snap.docs.map(doc => ({id: doc.id, ...doc.data()} as any))"
);

fs.writeFileSync('src/AppCore.tsx', code);
