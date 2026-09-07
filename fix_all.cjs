const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. Fix QuickDateFilterBar layout
const filterOld = `<div className="flex flex-wrap items-center gap-2">`;
const filterNew = `<div className="flex flex-row flex-nowrap overflow-x-auto whitespace-nowrap items-center gap-2 custom-scrollbar pb-2">`;
code = code.replace(filterOld, filterNew);

const customChildrenOld = `<div className="flex flex-col sm:flex-row items-center gap-3 w-full">`;
const customChildrenNew = `<div className="grid grid-cols-2 gap-3 w-full">`;
code = code.replace(customChildrenOld, customChildrenNew);


// 2. Fix Staff Commissions
const targetCommissions = `<div className="bg-card border border-border rounded-2xl w-full mb-3 md:mb-6 z-50 relative">
 {/* Commissions Grid */}
<div className={cn("grid gap-3 p-3", isStaff ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3")}>
 <CustomDatePicker 
  label="FROM" 
  value={dateFrom} 
  onChange={setDateFrom} 
  className="flex-1"
 />
 <CustomDatePicker 
  label="TO" 
  value={dateTo} 
  onChange={setDateTo} 
  className="flex-1"
 />`;

const replacementCommissions = `<QuickDateFilterBar dateFrom={dateFrom} dateTo={dateTo} setDateFrom={setDateFrom} setDateTo={setDateTo}>
 <CustomDatePicker 
  label="FROM" 
  value={dateFrom} 
  onChange={setDateFrom} 
  className="flex-1"
 />
 <CustomDatePicker 
  label="TO" 
  value={dateTo} 
  onChange={setDateTo} 
  className="flex-1"
 />
</QuickDateFilterBar>
<div className="bg-card border border-border rounded-2xl w-full mb-3 md:mb-6 z-50 relative">
 {/* Commissions Grid */}
<div className={cn("grid gap-3 p-3", isStaff ? "hidden" : "grid-cols-1")}>`;

code = code.replace(targetCommissions, replacementCommissions);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Fixed successfully.");
