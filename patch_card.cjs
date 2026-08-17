const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldCardStart = content.indexOf('<div className="p-4 bg-card border border-border rounded-2xl flex flex-col space-y-4 relative overflow-hidden">');
const updateMsgStart = content.indexOf('{updateMsg && updateMsg.type !== \'info\' && (', oldCardStart);

if (oldCardStart !== -1 && updateMsgStart !== -1) {
  content = content.substring(0, oldCardStart) + content.substring(updateMsgStart);
  fs.writeFileSync('src/AppCore.tsx', content);
  console.log("Patched Card successfully");
} else {
  console.log("Failed", oldCardStart, updateMsgStart);
}
