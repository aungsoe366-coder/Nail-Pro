const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Update ExpenseListPage component
const targetComponent = `export const ExpenseListPage: React.FC = () => {
    const { profile, isAdmin, isCashier } = useAuth();
    if (!isAdmin && !isCashier) return <Navigate to="/" />;`;

const replacementComponent = `export const ExpenseListPage: React.FC = () => {
    const { profile, isAdmin, isCashier, isStaffMember } = useAuth();
    const isStaff = isAdmin || isCashier || isStaffMember;
    if (!isStaff) return <Navigate to="/" />;`;

code = code.replace(targetComponent, replacementComponent);

// Update Routes
const targetRoute = `<Route path="/expenses" element={!(isAdmin || isCashier) ? <Navigate to="/appointments" /> : <ExpenseListPage />} />`;
const replacementRoute = `<Route path="/expenses" element={!isStaff ? <Navigate to="/appointments" /> : <ExpenseListPage />} />`;

code = code.replace(targetRoute, replacementRoute);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Expense routing fixed.");
