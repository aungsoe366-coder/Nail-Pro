const fs = require('fs');
const code = fs.readFileSync('backup_appcore.js', 'utf8');
const regex = /const ([a-zA-Z0-9_]+)="identity-reset"/;
const m = regex.exec(code);
if (m) console.log('Found route string');

const routeMatches = code.match(/\{path:"\/identity-reset",element:([a-zA-Z0-9_$.]+)/);
if (routeMatches) console.log('Found route component', routeMatches[1]);

// Let's just find the text "IdentityResetPage"
const idx2 = code.indexOf('IdentityResetPage');
console.log('Index of IdentityResetPage', idx2);
