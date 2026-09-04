const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex2 = /getDocFromCache\(docRef\)\.then\(docSnap => \{\s*if \(docSnap\.exists\(\)\) \{\s*setProfile\(docSnap\.data\(\) as UserProfile\);\s*setLoading\(false\);\s*setIsAuthReady\(true\);\s*\}\s*\}\)\.catch\(\(\) => \{\}\);/;

const replacement2 = `getDocFromCache(docRef).then(docSnap => {
 if (docSnap.exists()) {
 const data = docSnap.data();
 localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
 setProfile(data as UserProfile);
 setLoading(false);
 setIsAuthReady(true);
 }
 }).catch(() => {});`;

if (code.match(regex2)) {
    code = code.replace(regex2, replacement2);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched 2");
} else {
    console.log("Failed 2");
}

