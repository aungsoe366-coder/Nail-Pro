const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const start = content.indexOf('const POSPage: React.FC = () => {');
const end = content.indexOf('const MonthlySummaryPage: React.FC = () => {');
const posCode = content.substring(start, end);

const match = posCode.match(/return \(\s*<div[^>]*className="[^"]*h-screen w-full flex flex-col overflow-hidden bg-background[^"]*"[^>]*>([\s\S]{0,1000})/);
if (match) {
    console.log(match[1]);
} else {
    console.log("NOT FOUND");
}
