const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Patch 1: Top Modal Header
code = code.replace(
  "{editingAppointment ? 'Edit Appointment' : 'Book Appointment'}",
  "{editingAppointment ? 'Edit Appointment' : (formStep === 2 ? 'Booking Summary' : 'Book Appointment')}"
);

code = code.replace(
  "{editingAppointment ? 'Update existing booking details' : 'Schedule a new customer visit'}",
  "{editingAppointment ? 'Update existing booking details' : (formStep === 2 ? 'Review and confirm details' : 'Schedule a new customer visit')}"
);

// Patch 2: Remove Inner Header
const innerHeaderRegex = /<div className="p-6 border-b border-border\/40 flex items-center gap-4 bg-muted\/20">[\s\S]*?Booking Summary[\s\S]*?<\/div>\s*<\/div>/;

if (innerHeaderRegex.test(code)) {
    code = code.replace(innerHeaderRegex, '');
    console.log("Inner header removed.");
} else {
    console.log("Failed to find inner header");
}

fs.writeFileSync('src/AppCore.tsx', code);
