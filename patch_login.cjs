const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /if \(Capacitor\.isNativePlatform\(\)\) \{\s*try \{\s*GoogleAuth\.initialize\(\);\s*const googleUser = await GoogleAuth\.signIn\(\);\s*if \(googleUser && googleUser\.authentication && googleUser\.authentication\.idToken\) \{\s*const credential = GoogleAuthProvider\.credential\(googleUser\.authentication\.idToken\);\s*await signInWithCredential\(auth, credential\);\s*\} else \{\s*throw new Error\('Google Auth did not return an ID token'\);\s*\}\s*\} catch \(nativeErr\) \{\s*console\.error\("Capacitor Google Auth error"\);\s*throw nativeErr;\s*\}\s*\} else \{/g;

const replacement = `if (Capacitor.isNativePlatform()) {
 try {
 const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_FIREBASE_CLIENT_ID || '';
 if (!clientId || clientId.trim() === '') {
 console.warn("Google Client ID is missing. Please configure VITE_GOOGLE_CLIENT_ID in your environment variables.");
 // We still try to initialize as it might be in capacitor.config.json, but if it crashes we catch it.
 }
 GoogleAuth.initialize({
 clientId: clientId || undefined,
 scopes: ['profile', 'email'],
 grantOfflineAccess: true,
 });
 const googleUser = await GoogleAuth.signIn();
 if (googleUser && googleUser.authentication && googleUser.authentication.idToken) {
 const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
 await signInWithCredential(auth, credential);
 } else {
 throw new Error('Google Auth did not return an ID token');
 }
 } catch (nativeErr) {
 console.error("Google Auth Error:", nativeErr);
 alert("Google Sign-In is unavailable on this device configuration.");
 return; // Exit early to prevent propagating the error which might cause issues
 }
 } else {`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched login logic");
} else {
    console.log("Login logic not found");
}
