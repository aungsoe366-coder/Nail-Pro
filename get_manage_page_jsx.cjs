const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const start = content.indexOf('const ManagePage: React.FC = () => {');
const forceIdx = content.indexOf('const ForcePasswordChangePage');
const manageCode = content.substring(start, forceIdx);

// Look for a return that looks like the main page return, i.e. <div className="max-w-4xl...
const mainReturnMatch = manageCode.match(/return \(\s*<div[^>]*className="[^"]*max-w-[^"]*"[^>]*>/);
if (mainReturnMatch) {
    console.log(manageCode.substring(mainReturnMatch.index, mainReturnMatch.index + 800));
} else {
    // If we didn't find "max-w-", just print the first return after the last useEffect
    const lastUseEffect = manageCode.lastIndexOf('useEffect(() => {');
    const mainReturnIdx = manageCode.indexOf('return (', lastUseEffect);
    console.log(manageCode.substring(mainReturnIdx, mainReturnIdx + 800));
}
