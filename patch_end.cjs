const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace('</motion.div>\n </div>\n </motion.div>\n )}\n </div>', '</motion.div>\n )}\n </div>');

fs.writeFileSync('src/AppCore.tsx', code);
