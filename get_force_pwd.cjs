const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const match = content.match(/const ForcePasswordChangePage: React\.FC = \(\) => \{([\s\S]*?)const SettingsPage: React\.FC/);
if (match) {
    const code = match[1];
    const retIdx = code.indexOf('return (');
    console.log(code.substring(retIdx, retIdx + 600));
}
