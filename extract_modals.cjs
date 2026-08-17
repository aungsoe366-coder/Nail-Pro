const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const pwdModalStart = content.indexOf('{isPasswordModalOpen && (');
if(pwdModalStart !== -1) {
   const pwdModalEnd = content.indexOf(')}', content.indexOf('</form>', pwdModalStart));
   const updateModalStart = content.indexOf('{isUpdateModalOpen && (');
   const updateModalEnd = content.indexOf(')}', content.indexOf('</button>', updateModalStart + 100));
   
   console.log("Found modals.");
   
   const endBlock = content.indexOf('const ResetPasswordPage: React.FC = () => {');
   
   console.log("End block at", endBlock);
}
