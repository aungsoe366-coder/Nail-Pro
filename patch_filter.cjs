const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldFilter = `const filteredAppts = appointments
 .filter(a => {
 const matchesDate = showAllDates || a.date === filterDate;
 const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
 const matchesSearch = !apptSearch || 
 a.customerName.toLowerCase().includes(apptSearch.toLowerCase()) || 
 a.customerPhone.includes(apptSearch) ||
 a.serviceName.toLowerCase().includes(apptSearch.toLowerCase());
 const matchesUser = profile?.role !== 'customer' || a.creatorEmail === profile?.email;
 const matchesStaff = selectedStaffFilter === 'all' || a.staffEmail === selectedStaffFilter;
 return matchesDate && matchesStatus && matchesSearch && matchesUser && matchesStaff;
 })`;

const newFilter = `const filteredAppts = appointments
 .filter(a => {
 if (profile?.role === 'customer') {
   if (a.creatorEmail !== profile?.email) return false;
   const isPast = a.status === 'completed' || a.status === 'cancelled';
   if (customerApptTab === 'upcoming' && isPast) return false;
   if (customerApptTab === 'past' && !isPast) return false;
   return true;
 } else {
   const matchesDate = showAllDates || a.date === filterDate;
   const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
   const matchesSearch = !apptSearch || 
   a.customerName.toLowerCase().includes(apptSearch.toLowerCase()) || 
   a.customerPhone.includes(apptSearch) ||
   a.serviceName.toLowerCase().includes(apptSearch.toLowerCase());
   const matchesUser = profile?.role !== 'customer' || a.creatorEmail === profile?.email;
   const matchesStaff = selectedStaffFilter === 'all' || a.staffEmail === selectedStaffFilter;
   return matchesDate && matchesStatus && matchesSearch && matchesUser && matchesStaff;
 }
 })`;

code = code.replace(oldFilter, newFilter);

fs.writeFileSync('src/AppCore.tsx', code);
