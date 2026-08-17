const fs = require('fs');

const filePath = 'src/pages/BusinessAnalysisPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const protectStr = ` // Role Protection: Only Admin and Owner allowed!
 if (!isAdmin) {
 return <Navigate to="/appointments" replace />;
 }`;

// Remove the first instance of it
content = content.replace(protectStr, '');

// Put it before `return (`
content = content.replace(' return (\n <div className="w-full px-3 py-4', protectStr + '\n\n return (\n <div className="w-full px-3 py-4');

fs.writeFileSync(filePath, content);
console.log("Hook call order fixed!");
