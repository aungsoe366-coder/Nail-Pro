const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const splitIndex = content.indexOf('/>import { Filter } from "lucide-react";');
content = content.substring(splitIndex + 2);

const oldSelectRegex = /<CustomSelect\s*disabled={!isAdmin && \(appt\.status === 'completed' || appt\.status === 'cancelled'\)}[\s\S]*?onChange={\(val\) => handleQuickStatusUpdate\(appt\.id, val as any\)}[\s\S]*?options={\[[\s\S]*?\]}[\s\S]*?buttonClassName={cn\([\s\S]*?shadow-\[0_0_10px_rgba\(239,68,68,0\.2\)\]"\s*\)\}\s*\/>/;

const match = content.match(oldSelectRegex);
console.log("Match length:", match[0].length);
console.log("Match starts with:", match[0].substring(0, 20));
