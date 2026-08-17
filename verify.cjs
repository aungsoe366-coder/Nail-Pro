const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /text-2xl font-extrabold tracking-tight text-slate-900 uppercase/g;
const matches = content.match(regex);
console.log(`Found ${matches ? matches.length : 0} styled titles in AppCore.tsx`);

const businessContent = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');
const businessMatches = businessContent.match(regex);
console.log(`Found ${businessMatches ? businessMatches.length : 0} styled titles in BusinessAnalysisPage.tsx`);

