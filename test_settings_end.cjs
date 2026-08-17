const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');
const searchStr = '      <div className="pt-2 pb-6 px-4">';
const index = content.indexOf(searchStr);
if (index !== -1) {
   const endIdx = content.indexOf('const ResetPasswordPage: React.FC = () => {');
   console.log(content.substring(index, endIdx));
}
