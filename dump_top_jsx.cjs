const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const components = [
    'CustomerDashboardPage',
    'DashboardPage',
    'POSPage',
    'MonthlySummaryPage',
    'ExpenseListPage',
    'HistoryPage',
    'StaffCommissionsPage',
    'SalesReportPage',
    'AppointmentsPage',
    'ManagePage',
    'SettingsPage'
];

for (const comp of components) {
    const idx = content.indexOf(`const ${comp}: React.FC`);
    if (idx !== -1) {
        const retIdx = content.indexOf('return (', idx);
        console.log(`\n\n============= ${comp} =============`);
        console.log(content.substring(retIdx, retIdx + 600));
    }
}
