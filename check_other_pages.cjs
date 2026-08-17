const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targets = [
    'ForcePasswordChangePage',
    'ResetPasswordPage',
    'IdentityResetPage',
    'LoginPage',
];

for (const comp of targets) {
    const idx = content.indexOf(`const ${comp}: React.FC`);
    if (idx !== -1) {
        const retIdx = content.indexOf('return (', idx);
        console.log(`\n--- ${comp} ---`);
        console.log(content.substring(retIdx, retIdx + 300));
    }
}
