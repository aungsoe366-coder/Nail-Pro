const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex4 = /\} else \{\s*const data = docSnap\.data\(\);\s*if \(data\?\.status === 'deleted'\) \{/g;

const replacement4 = `} else {
 const data = docSnap.data();
 if (data?.status === 'deleted') {
 localStorage.removeItem(LOCAL_STORAGE_KEY);`;

const regex5 = /\} else \{\s*const data = docSnap\.data\(\);\s*if \(data\?\.status === 'deleted'\) \{\s*localStorage\.removeItem\(LOCAL_STORAGE_KEY\);\s*signOut\(auth\);\s*setUser\(null\);\s*setProfile\(null\);\s*setLoading\(false\);\s*setIsAuthReady\(true\);\s*return;\s*\}\s*setProfile\(data as UserProfile\);/g;

const replacement5 = `} else {
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

if (code.match(regex4)) {
    code = code.replace(regex5, replacement5);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched 4/5");
} else {
    console.log("Failed 4/5");
}

