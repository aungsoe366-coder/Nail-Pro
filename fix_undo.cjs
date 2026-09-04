const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// The replacement was `</div>\n              </div>\n              </div>`
// at line 2733.
const regex = /<\/motion\.button>\s*<\/div>\s*<\/motion\.div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{currentStep === 'checkout'/;
const replacement = `          </motion.button>
        </div>
      </motion.div>
    )}
    </AnimatePresence>
      {currentStep === 'checkout'`;
code = code.replace(regex, replacement);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Restored first mistake");
