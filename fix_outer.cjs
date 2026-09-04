const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>\s*\{currentStep === 'checkout'/;
const replacement = `      </motion.div>
      </motion.div>
    )}
    </AnimatePresence>
      {currentStep === 'checkout'`;
code = code.replace(regex, replacement);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Fixed missing outer motion.div");
