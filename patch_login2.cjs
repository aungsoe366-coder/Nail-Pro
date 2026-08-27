const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /catch \(nativeErr\) \{\s*console\.error\("Google Auth Error:", nativeErr\);\s*alert\("Google Sign-In is unavailable on this device configuration\."\);\s*return; \/\/ Exit early to prevent propagating the error which might cause issues\s*\}/g;

const replacement = `catch (nativeErr) {
 console.error("Google Auth Error:", nativeErr);
 setError("Google Sign-In is unavailable on this device configuration.");
 return; // Exit early to prevent propagating the error which might cause issues
 }`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched catch logic to use setError");
} else {
    console.log("Catch logic not found");
}
