const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const search = 'const ResetPasswordPage: React.FC = () => {';
const idx = content.indexOf(search);
console.log(content.substring(idx - 500, idx + 100));
