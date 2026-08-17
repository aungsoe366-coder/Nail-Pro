const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const returnIdx = content.indexOf('return (\n    <div className="max-w-4xl mx-auto space-y-3 pb-20">', content.indexOf('const forceUpdate = () => {'));
if (returnIdx === -1) {
  console.log("Could not find start of return block");
  process.exit(1);
}

// Find the last closing div of the main settings wrapper
const endToken = '</div>\n  );\n};\n\n// --- AppCore ---';
const endIdx = content.indexOf(endToken, returnIdx);

if (endIdx !== -1) {
    console.log("End found at", endIdx);
} else {
    console.log("End not found exactly. Searching...");
    const altEndToken = '</Modal>\n      )}';
    const altIdx = content.indexOf(altEndToken, returnIdx);
    console.log("Alt end approx:", altIdx);
}
