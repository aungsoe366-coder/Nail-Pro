const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target = `)}
 </div>
 </div>
 );
};

const ResetPasswordPage: React.FC = () => {`;

const replacement = `)}
 </div>
 );
};

const ResetPasswordPage: React.FC = () => {`;

// Let's just do a regex replace for the end of SettingsPage
const regex = /\)\}\s*<\/div>\s*<\/div>\s*\);\s*\};\s*const ResetPasswordPage/g;
const match = content.match(regex);
if (match) {
   content = content.replace(regex, `)}\n </div>\n );\n};\n\nconst ResetPasswordPage`);
   fs.writeFileSync('src/AppCore.tsx', content);
   console.log("Fixed end tags");
} else {
   console.log("Regex not matched");
}
