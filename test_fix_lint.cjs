const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// The `isCustomer` prop was not actually on the `Header` type properly, and `profile` wasn't typed correctly.
const headerDefinitionMatch = /const Header: React\.FC<\{ onMenuClick: \(\) => void, className\?: string, isCustomer\?: boolean, profile\?: any \}> = \(\{ onMenuClick, className, isCustomer, profile \}\) => \{/

if (!headerDefinitionMatch.test(code)) {
    console.log("Adding isCustomer and profile to Header type definition");
    code = code.replace(
        /const Header: React\.FC<\{ onMenuClick: \(\) => void, className\?: string \}> = \(\{ onMenuClick, className \}\) => \{/,
        `const Header: React.FC<{ onMenuClick: () => void, className?: string, isCustomer?: boolean, profile?: any }> = ({ onMenuClick, className, isCustomer, profile }) => {`
    );
    fs.writeFileSync('src/AppCore.tsx', code);
}
