const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const splitIndex = content.indexOf('/>import { Filter } from "lucide-react";');
if (splitIndex !== -1) {
  content = content.substring(splitIndex + 2); // skips '/>'
}

const oldSelectRegex = /<CustomSelect\s*disabled={!isAdmin && \(appt\.status === 'completed' || appt\.status === 'cancelled'\)}[\s\S]*?onChange={\(val\) => handleQuickStatusUpdate\(appt\.id, val as any\)}[\s\S]*?options={\[[\s\S]*?\]}[\s\S]*?buttonClassName={cn\([\s\S]*?shadow-\[0_0_10px_rgba\(239,68,68,0\.2\)\]"\s*\)\}\s*\/>/;

const match = content.match(oldSelectRegex);
if (match) {
    console.log("Match found at index:", match.index);
    content = content.replace(oldSelectRegex, "XXX_REPLACEMENT_XXX");
} else {
    console.log("No match");
}

console.log(content.substring(0, 50));
