const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /if \(u\) \{\s*setLoading\(true\);\s*setUser\(u\);\s*const email = u\.email!\.toLowerCase\(\);\s*const docRef = doc\(db, 'users', email\);\s*let initDone = false;/;

const replacement = `if (u) {
 setLoading(true);
 setUser(u);
 const email = u.email!.toLowerCase();
 const docRef = doc(db, 'users', email);
 let initDone = false;
 
 const LOCAL_STORAGE_KEY = \`cached_profile_\${email}\`;
 let cachedProfileData = null;
 try {
 const cachedStr = localStorage.getItem(LOCAL_STORAGE_KEY);
 if (cachedStr) {
 cachedProfileData = JSON.parse(cachedStr);
 setProfile(cachedProfileData);
 }
 } catch (e) {}`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched 1");
} else {
    console.log("Failed 1");
}

