const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetRegex = /<div className="bg-card border border-border rounded-2xl w-full mb-3 md:mb-6 z-50 relative">\s*\{\/\* Commissions Grid \*\/\}\s*<div className=\{cn\("grid gap-3 p-3", isStaff \? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"\)\}>\s*<CustomDatePicker\s*label="FROM"\s*value=\{dateFrom\}\s*onChange=\{setDateFrom\}\s*className="flex-1"\s*\/>\s*<CustomDatePicker\s*label="TO"\s*value=\{dateTo\}\s*onChange=\{setDateTo\}\s*className="flex-1"\s*\/>/s;

const replacement = `<QuickDateFilterBar dateFrom={dateFrom} dateTo={dateTo} setDateFrom={setDateFrom} setDateTo={setDateTo}>
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

code = code.replace(targetRegex, replacement);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Commissions fixed:", targetRegex.test(fs.readFileSync('src/AppCore.tsx', 'utf8')) ? "Failed" : "Success");
