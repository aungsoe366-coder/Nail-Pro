const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const startIndex = content.indexOf("const forceUpdate = () => {");
console.log("StartIndex:", startIndex);
if(startIndex !== -1) {
   const returnIndex = content.indexOf("return (", startIndex);
   console.log("Return index:", returnIndex);
   // End of SettingsPage is a closing brace and then maybe some other component or EOF
   // Let's just find the closing bracket of the whole `return (` by counting braces or finding `);` right before another `export` or EOF.
   const endMatch = content.indexOf("};", returnIndex + 100);
   console.log("End match approx:", endMatch);
   console.log(content.substring(returnIndex, returnIndex + 500));
}
