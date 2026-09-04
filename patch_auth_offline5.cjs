const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /\/\/ Optimistically set profile to allow app load\s*setProfile\(profileData as UserProfile\);/g;
const replacement = `// Optimistically set profile to allow app load
 localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profileData));
 setProfile(profileData as UserProfile);`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched 6");
} else {
    console.log("Failed 6");
}
