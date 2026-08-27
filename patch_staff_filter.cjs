const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldSelect = `<select 
       value={selectedStaffFilter} 
       onChange={(e) => setSelectedStaffFilter(e.target.value)} 
       className="bg-muted/50 text-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg border-none uppercase tracking-widest outline-none cursor-pointer shrink-0"
     >
       <option value="all">ALL STAFF</option>
       {staff.filter(s => s.role !== 'super_admin').map(s => (
         <option key={s.email} value={s.email}>{s.name.split(' ')[0]}</option>
       ))}
     </select>`;

const newSelect = `<CustomSelect 
       value={selectedStaffFilter} 
       onChange={setSelectedStaffFilter}
       options={[
         { value: 'all', label: 'ALL STAFF' },
         ...staff.filter(s => s.role !== 'super_admin').map(s => {
           const initials = s.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
           return {
             value: s.email,
             label: (
               <div className="flex items-center gap-3 py-0.5">
                 <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                   {initials}
                 </div>
                 <div className="flex flex-col">
                   <span className="font-bold text-sm text-foreground">{s.name}</span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{s.role.replace('_', ' ')}</span>
                 </div>
               </div>
             )
           };
         })
       ]}
       renderValue={(opt) => {
         if (!opt || opt.value === 'all') return 'ALL STAFF';
         const staffMember = staff.find(s => s.email === opt.value);
         if (!staffMember) return 'ALL STAFF';
         const initials = staffMember.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
         const shortName = staffMember.name.split(' ')[0] + (staffMember.name.split(' ')[1] ? ' ' + staffMember.name.split(' ')[1][0] + '.' : '');
         return (
           <div className="flex items-center gap-1.5">
             <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[9px] border border-primary/20">
               {initials}
             </div>
             <span>{shortName}</span>
           </div>
         );
       }}
       buttonClassName="bg-muted/50 text-foreground text-[10px] font-bold px-3 py-1.5 rounded-lg border-none uppercase tracking-widest outline-none cursor-pointer shrink-0 min-h-[30px]"
       dropdownClassName="min-w-[240px] p-2 bg-card border-border/50 shadow-2xl rounded-2xl right-0 w-auto left-auto"
     />`;

code = code.replace(oldSelect, newSelect);
fs.writeFileSync('src/AppCore.tsx', code);
