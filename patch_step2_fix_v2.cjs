const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace(
  '</motion.div>\n<motion.div className="space-y-3" initial={{ opacity: 0, y: 12 }}',
  '</motion.div>\n ) : (\n<motion.div className="space-y-3" initial={{ opacity: 0, y: 12 }}'
);

fs.writeFileSync('src/AppCore.tsx', code);
