const fs = require('fs');
let lines = fs.readFileSync('src/AppCore.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('</motion.div><motion.div')) {
    lines[i] = lines[i].replace('</motion.div><motion.div', '</motion.div>) : (<motion.div');
    break;
  }
}

fs.writeFileSync('src/AppCore.tsx', lines.join('\n'));
