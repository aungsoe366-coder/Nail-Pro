const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /\} else \{\s*const data = docSnap\.data\(\);\s*if \(data\?\.status === 'deleted'\) \{\s*signOut\(auth\);\s*setUser\(null\);\s*setProfile\(null\);\s*setLoading\(false\);\s*setIsAuthReady\(true\);\s*return;\s*\}\s*setProfile\(data as UserProfile\);/g;

const replacement = `} else {
 const data = docSnap.data();
 if (data?.status === 'deleted') {
 localStorage.removeItem(LOCAL_STORAGE_KEY);
 signOut(auth);
 setUser(null);
 setProfile(null);
 setLoading(false);
 setIsAuthReady(true);
 return;
 }
 localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
 setProfile(data as UserProfile);`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched 7");
} else {
    console.log("Failed 7");
}
