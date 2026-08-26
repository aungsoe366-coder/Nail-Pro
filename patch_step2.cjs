const fs = require('fs');
let lines = fs.readFileSync('src/AppCore.tsx', 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(') : (') && lines[i+1] && lines[i+1].includes('className="bg-card border border-border rounded-2xl w-full mb-3 md:mb-6 z-50 relative"')) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes('<div className="p-0">')) {
    endIndex = i - 1; // before the <div className="p-0">
    break;
  }
}

const newFilterAdmin = `) : (
 <div className="bg-card border border-border rounded-xl w-full mb-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center p-2 gap-3 z-40 relative">
   <div className="relative flex-1 lg:max-w-md shrink-0">
     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
     <input 
       type="text" 
       placeholder="Search appointments..." 
       value={apptSearch} 
       onChange={(e) => setApptSearch(e.target.value)} 
       className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm font-medium outline-none focus:border-primary transition-all [.midnight_&]:bg-black/20" 
     />
   </div>
   <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 lg:pb-0 hide-scrollbar flex-1 justify-start lg:justify-end">
     <div className="flex bg-muted/50 p-1 rounded-lg shrink-0">
       {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
         <button 
           key={status} 
           onClick={() => setStatusFilter(status)} 
           className={cn("px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all", statusFilter === status ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
         >
           {status === 'all' ? 'All' : status}
         </button>
       ))}
     </div>
     
     <div className="flex items-center bg-muted/50 p-1 rounded-lg shrink-0">
       <button 
         onClick={() => setShowAllDates(!showAllDates)}
         className={cn("px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all", showAllDates ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
       >
         All Dates
       </button>
       {!showAllDates && (
         <input 
           type="date" 
           value={filterDate} 
           onChange={(e) => { 
             setFilterDate(e.target.value); 
             setShowAllDates(false); 
             if (e.target.value) {
               const [y, m, d] = e.target.value.split('-').map(Number);
               if (y && m && d) setCalendarDate(new Date(y, m - 1, d));
             }
           }} 
           className="bg-transparent text-foreground text-[10px] font-bold px-2 py-1 uppercase tracking-widest outline-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
         />
       )}
     </div>

     <select 
       value={selectedStaffFilter} 
       onChange={(e) => setSelectedStaffFilter(e.target.value)} 
       className="bg-muted/50 text-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg border-none uppercase tracking-widest outline-none cursor-pointer shrink-0"
     >
       <option value="all">ALL STAFF</option>
       {staff.filter(s => s.role !== 'super_admin').map(s => (
         <option key={s.email} value={s.email}>{s.name.split(' ')[0]}</option>
       ))}
     </select>
   </div>
 </div>
)}
`;

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 1, newFilterAdmin);
  fs.writeFileSync('src/AppCore.tsx', lines.join('\n'));
  console.log("Filter replaced at lines " + startIndex + " to " + endIndex);
} else {
  console.log("Filter NOT matched. Start: " + startIndex + ", End: " + endIndex);
}
