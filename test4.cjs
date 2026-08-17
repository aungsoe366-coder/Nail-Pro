const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const splitIndex = content.indexOf('/>import { Filter } from "lucide-react";');
if (splitIndex !== -1) {
  content = content.substring(splitIndex + 2); // skips '/>'
}
console.log(content.substring(0, 50));
