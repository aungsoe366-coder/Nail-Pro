const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /(<CustomSelect\s+value=\{selectedStaffFilter\}[\s\S]*?dropdownClassName="[^"]*"\s*\/>)\s*<\/div>\s*<\/div>/;

if (regex.test(code)) {
    code = code.replace(regex, '</div>\n  <div className="shrink-0">\n    $1\n  </div>\n</div>');
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Replaced successfully");
} else {
    console.log("Could not find the target");
}
