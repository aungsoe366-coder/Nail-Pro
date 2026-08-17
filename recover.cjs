const fs = require('fs');
const content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

const first42 = content.substring(0, 42);
const restMatch = content.match(/mo \} from 'react';[\s\S]*/);

if (restMatch) {
    const recovered = first42 + restMatch[0];
    fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', recovered);
    console.log("Recovered file!");
} else {
    console.log("Could not find the rest");
}
