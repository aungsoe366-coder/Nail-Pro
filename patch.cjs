const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');
const target = "            </motion.div>\n          )}\n      {isUpdateModalOpen && (";
if (code.includes(target)) {
  code = code.replace(target, "            </motion.div>\n          )}\n       </div>\n      {isUpdateModalOpen && (");
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log('patched');
} else {
  console.log('not found');
}
