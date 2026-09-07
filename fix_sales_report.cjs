const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// The mistake was changing the useEffect guard in SalesReportPage
// Let's replace the block in SalesReportPage carefully
const parts = code.split('export const SalesReportPage: React.FC = () => {');
if (parts.length === 2) {
    let srCode = parts[1];
    srCode = srCode.replace(/if \(!isStaff\) return;/g, 'if (!isAdmin && !isCashier) return;');
    code = parts[0] + 'export const SalesReportPage: React.FC = () => {' + srCode;
}

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Fixed SalesReportPage.");
