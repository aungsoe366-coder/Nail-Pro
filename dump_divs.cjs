const fs = require('fs');
const code = fs.readFileSync('src/AppCore.tsx', 'utf8');
const settingsPage = code.slice(code.indexOf('const SettingsPage: React.FC = () => {'), code.indexOf('const ResetPasswordPage: React.FC = () => {'));
let divCount = 0;
let lines = settingsPage.split('\n');
for (let i=0; i<lines.length; i++) {
  const line = lines[i];
  let m1 = line.match(/<div/g);
  let m2 = line.match(/<\/div>/g);
  if (m1 || m2) {
      if (m1) divCount += m1.length;
      if (m2) divCount -= m2.length;
      console.log(`Line ${i} | Count: ${divCount} | ${line.trim()}`);
  }
}
