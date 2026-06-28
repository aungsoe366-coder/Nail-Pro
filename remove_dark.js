import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/dark:[a-zA-Z0-9\-\/\[\]#_:]+/g, '');
fs.writeFileSync('src/App.tsx', code);
