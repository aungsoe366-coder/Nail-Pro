const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Fix MonthlySummaryPage back
const monthlyWrong = `export const MonthlySummaryPage: React.FC = () => {
 const { profile, isAdmin, isCashier, isStaffMember } = useAuth();
 const isStaff = isAdmin || isCashier || isStaffMember;
 if (!isStaff) return <Navigate to="/" />;`;

const monthlyCorrect = `export const MonthlySummaryPage: React.FC = () => {
 const { profile, isAdmin, isCashier } = useAuth();
 if (!isAdmin && !isCashier) return <Navigate to="/" />;`;
code = code.replace(monthlyWrong, monthlyCorrect);

// Fix ExpenseListPage correctly
const expenseWrong = `export const ExpenseListPage: React.FC = () => {
 const { profile, isAdmin, isCashier } = useAuth();
 if (!isAdmin && !isCashier) return <Navigate to="/" />;`;

const expenseCorrect = `export const ExpenseListPage: React.FC = () => {
 const { profile, isAdmin, isCashier, isStaffMember } = useAuth();
 const isStaff = isAdmin || isCashier || isStaffMember;
 if (!isStaff) return <Navigate to="/" />;`;
code = code.replace(expenseWrong, expenseCorrect);

// Look for useEffect inside ExpenseListPage that has an auth guard
// line 3493: if (!isAdmin && !isCashier) return;
// Wait, I will just replace all "if (!isAdmin && !isCashier) return;" inside ExpenseListPage.
// Actually, let's just do a regex replace from ExpenseListPage start to the next export
const parts = code.split('export const ExpenseListPage: React.FC = () => {');
if (parts.length === 2) {
    let expenseCode = parts[1];
    expenseCode = expenseCode.replace(/if \(!isAdmin && !isCashier\) return;/g, 'if (!isStaff) return;');
    code = parts[0] + 'export const ExpenseListPage: React.FC = () => {' + expenseCode;
}

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Done auth fixing.");
