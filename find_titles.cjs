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
    'SettingsPage',
];

for (const comp of components) {
    const regex = new RegExp(`(const ${comp}: React\\.FC = \\(\\) => \\{.*?return \\(.*?)(<h[123][^>]*>.*?<\\/h[123]>)`, 's');
    const match = content.match(regex);
    if (match) {
        console.log(`--- ${comp} ---`);
        console.log(match[2]);
    } else {
        console.log(`--- ${comp} --- NOT FOUND`);
    }
}
