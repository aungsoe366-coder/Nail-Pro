const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace("useState<'login'|'signup'>('login');", "useState<'welcome'|'login'|'signup'>('welcome');");
code = code.replace("if (res && res.isSaved) {", "if (res && res.password) {");

// Let's remove loginWithGoogle from useAuth destructing if it doesn't exist, and just use a placeholder or something?
// Let's check if loginWithGoogle exists in AuthProvider:
const authProviderMatch = code.match(/loginWithGoogle/g);
console.log("Occurrences of loginWithGoogle:", authProviderMatch ? authProviderMatch.length : 0);

fs.writeFileSync('src/AppCore.tsx', code);
