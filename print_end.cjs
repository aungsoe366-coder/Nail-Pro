const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const pwdIdx = content.indexOf('{isPasswordModalOpen && (');
if (pwdIdx !== -1) {
   const endIdx = content.indexOf('const ResetPasswordPage: React.FC = () => {');
   console.log(content.substring(pwdIdx + 4000, endIdx));
}
