const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetRegex = /<div className="flex flex-wrap items-center gap-2 mb-4">.*?<div className="hidden">\s*<div className="bg-card border border-border rounded-2xl w-full z-50 relative">\s*\{\/\* Daily Sales Grid \*\/\}\s*<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3">\s*<CustomDatePicker\s*label="FROM"\s*value=\{dateFrom\}\s*onChange=\{setDateFrom\}\s*className="flex-1"\s*\/>\s*<CustomDatePicker\s*label="TO"\s*value=\{dateTo\}\s*onChange=\{setDateTo\}\s*className="flex-1"\s*\/>/s;

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
<div className="bg-card border border-border rounded-2xl w-full z-50 relative">
{/* Daily Sales Grid */}
<div className="grid grid-cols-2 lg:grid-cols-2 gap-3 p-3">`;

code = code.replace(targetRegex, replacement);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Daily sales replaced.");
