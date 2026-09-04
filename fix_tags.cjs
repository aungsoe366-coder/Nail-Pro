const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/;
if (code.match(regex)) {
    code = code.replace(regex, `</div>\n              </div>\n              </div>`);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Fixed tags");
} else {
    console.log("Not found");
}
