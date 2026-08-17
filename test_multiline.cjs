const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const match = content.match(/<h1 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground \[\.midnight_&\]:text-slate-200 leading-none">\s*\{isCustomer \? 'My Appointments' : 'Customer Appointments'\}\s*<\/h1>/);
if (match) {
    console.log("FOUND AppointmentsPage title");
} else {
    console.log("MISSING AppointmentsPage title");
}
