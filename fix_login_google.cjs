const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

code = code.replace("const { loginWithPhone, loginWithEmail, loginWithGoogle,", "const { loginWithPhone, loginWithEmail, ");
code = code.replace("const navigate = useNavigate();", "const navigate = useNavigate();\n  const loginWithGoogle = async () => {};");

fs.writeFileSync('src/AppCore.tsx', code);
