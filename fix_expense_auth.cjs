const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = "const { profile, isAdmin, isCashier } = useAuth();";
const replacement1 = "const { profile, isAdmin, isCashier, isStaffMember } = useAuth();";

const target2 = "if (!isAdmin && !isCashier) return <Navigate to=\"/\" />;";
const replacement2 = "const isStaff = isAdmin || isCashier || isStaffMember;\n if (!isStaff) return <Navigate to=\"/\" />;";

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Expense auth check updated:", code.includes("const isStaff = isAdmin || isCashier || isStaffMember;"));
