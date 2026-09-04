const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex3 = /unsubProfile = onSnapshot\(docRef, \(docSnap\) => \{\s*try \{\s*if \(\!docSnap\.exists\(\)\) \{\s*if \(\!initDone\) \{\s*initDone = true;\s*const now = new Date\(\)\.toISOString\(\);\s*let currentRole = \(email === \(import\.meta\.env\.VITE_SUPER_ADMIN_EMAIL \|\| ''\)\) \? 'super_admin' : 'customer';/;

const replacement3 = `unsubProfile = onSnapshot(docRef, (docSnap) => {
 try {
 if (!docSnap.exists()) {
 if (!initDone) {
 initDone = true;
 
 // OFFLINE GUARD: If we are offline (cache) and have a local profile, do NOT overwrite
 if (docSnap.metadata.fromCache && cachedProfileData) {
 console.log("Offline mode: Preventing role reset by using locally cached profile.");
 setProfile(cachedProfileData as UserProfile);
 setLoading(false);
 setIsAuthReady(true);
 return; // Exit to prevent rewriting to Firestore
 }
 
 const now = new Date().toISOString();
 let currentRole = (email === (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '')) ? 'super_admin' : (cachedProfileData?.role || 'customer');`;

if (code.match(regex3)) {
    code = code.replace(regex3, replacement3);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched 3");
} else {
    console.log("Failed 3");
}

