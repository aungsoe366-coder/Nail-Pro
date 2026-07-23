const fs = require('fs');
const code = fs.readFileSync('backup_appcore.js', 'utf8');
const idx = code.indexOf('"/identity-reset"');
if (idx !== -1) {
  console.log(code.substring(Math.max(0, idx - 1000), idx + 4000));
} else {
  console.log('Not found');
}
