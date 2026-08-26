const fs = require('fs');

let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// The issue is that `</div>` for parent elements were replaced with `</motion.div>` in some places.
// We can just replace `</AnimatePresence></motion.div>` with `</AnimatePresence></div>` because AnimatePresence is almost always inside a standard div container.
code = code.replace(/<\/AnimatePresence>\s*<\/motion\.div>/g, '</AnimatePresence></div>');

// There might be some cases where the closing `</motion.div>` was placed wrongly without `<AnimatePresence>`.
// Let's write the file.
fs.writeFileSync('src/AppCore.tsx', code);
