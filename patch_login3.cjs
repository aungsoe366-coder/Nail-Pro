const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /const clientId = import\.meta\.env\.VITE_GOOGLE_CLIENT_ID \|\| import\.meta\.env\.VITE_FIREBASE_CLIENT_ID \|\| '';\s*if \(\!clientId \|\| clientId\.trim\(\) === ''\) \{\s*console\.warn\("Google Client ID is missing\. Please configure VITE_GOOGLE_CLIENT_ID in your environment variables\."\);\s*\/\/[^\n]*\s*\}\s*GoogleAuth\.initialize\(\{\s*clientId: clientId \|\| undefined,\s*scopes: \['profile', 'email'\],\s*grantOfflineAccess: true,\s*\}\);/g;

const replacement = `const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_FIREBASE_CLIENT_ID || '';
 if (!clientId || clientId.trim() === '') {
 console.error("Google Auth Error: Missing Google Client ID");
 setError("Google Sign-In is unavailable on this device configuration.");
 return;
 }
 GoogleAuth.initialize({
 clientId: clientId,
 scopes: ['profile', 'email'],
 grantOfflineAccess: true,
 });`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched missing client ID prevention");
} else {
    console.log("Regex not found");
}
