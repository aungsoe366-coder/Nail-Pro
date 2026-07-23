const fs = require('fs');
const code = fs.readFileSync('backup_appcore.js', 'utf8');
const searchString = 'placeholder:"email@example.com"';
const idx = code.indexOf(searchString);
if (idx !== -1) {
  console.log(code.substring(Math.max(0, idx - 5000), idx + 10000));
}
