const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const startIndex = content.indexOf("{filteredAppts.map((appt) => {");
if(startIndex !== -1) {
  console.log(content.substring(startIndex, startIndex + 3000));
}
