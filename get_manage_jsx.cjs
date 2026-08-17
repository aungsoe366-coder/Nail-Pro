const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const start = content.indexOf('const ManagePage');
const end = content.indexOf('const SettingsPage');
const manageCode = content.substring(start, end);

const mainReturnMatch = manageCode.match(/return \(\s*<div[^>]*className="[^"]*w-full px-3 py-4 md:p-6 space-y-3"[^>]*>([\s\S]*?)<\/div>\s*\);\s*\};/);
if (mainReturnMatch) {
    console.log(mainReturnMatch[1].substring(0, 500));
} else {
    console.log("NOT FOUND");
}
