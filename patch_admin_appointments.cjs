const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldHeader = `<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex flex-col gap-1">
 <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37] uppercase">
 {isCustomer ? 'My Appointments' : 'Customer Appointments'}</h1>
<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
  View and manage your bookings
</p>
 {isCustomer && profile.points !== undefined && (
 <div className="flex items-center gap-2 mt-1">
 <span className="text-xs font-bold bg-primary/20 text-primary [.midnight_&]:text-amber-400 px-3 py-1 rounded-full border-primary/30 ">
 {profile.points.toLocaleString()} Points Available
 </span>
 </div>
 )}
 </div>`;

const newHeader = `<div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-2">
 <div className="flex flex-col gap-0.5">
 <h1 className="text-xl md:text-2xl font-black tracking-widest text-slate-900 [.midnight_&]:text-[#D4AF37] uppercase font-serif">
 {isCustomer ? 'My Appointments' : 'Appointments'}</h1>
<p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
  View and manage your bookings
</p>
 {isCustomer && profile.points !== undefined && (
 <div className="flex items-center gap-2 mt-1">
 <span className="text-xs font-bold bg-primary/20 text-primary [.midnight_&]:text-amber-400 px-3 py-1 rounded-full border-primary/30 ">
 {profile.points.toLocaleString()} Points Available
 </span>
 </div>
 )}
 </div>`;

code = code.replace(oldHeader, newHeader);


const oldFilterAdmin = `) : (
 <div className="bg-card border border-border rounded-2xl w-full mb-3 md:mb-6 z-50 relative">
 <div className="p-4 relative group">
 <input
 type="text"
 placeholder="Search customer or service..."
 value={apptSearch}
 onChange={(e) => setApptSearch(e.target.value)}
 className="w-full p-2 pl-10 border-none outline-none bg-transparent text-foreground [.midnight_&]:text-slate-200 font-bold text-sm transition-all placeholder:text-muted-foreground [.midnight_&]:placeholder-slate-400 [.midnight_&]:text-slate-300/50"
 />
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary [.midnight_&]:text-amber-400" size={16} />
 </div>
 {/* Appointments Grid */}
 <div className={cn("grid gap-3 p-3", profile?.role !== 'customer' ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3")}>
 <CustomDatePicker 
 label="FILTER DATE" 
 value={filterDate} 
 onChange={(val) => {
 setFilterDate(val);
 setShowAllDates(false);
 if (val) {
 const [y, m, d] = val.split('-').map(Number);
 if (y && m && d) setCalendarDate(new Date(y, m - 1, d));
 }
 }}
 disabled={showAllDates}
 className={cn("flex-1", showAllDates && "opacity-50")}
 />
 {profile?.role !== 'customer' && (
 <div className="flex flex-col flex-1 justify-center">
 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
 <UserIcon size={12} className="text-primary [.midnight_&]:text-amber-400" />
 STAFF
 </label>
 <CustomSelect
 value={selectedStaffFilter} 
 onChange={setSelectedStaffFilter}
 placeholder="All Staff"
 options={[
 { value: 'all', label: 'All Staff' },
 ...staff.filter(s => s.role !== 'super_admin').map(s => ({ value: s.email, label: s.name }))
 ]}
 />
 </div>
 )}
 <div className="flex flex-col flex-1 justify-center">
 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
 <Activity size={12} className="text-primary [.midnight_&]:text-amber-400" />
 STATUS
 </label>
 <CustomSelect
                        value={statusFilter} 
                        onChange={setStatusFilter}
                        placeholder="All Status"
                        options={[
                          { 
                            value: 'all', 
                            label: (
                              <div className="flex items-center gap-2 font-black tracking-wider uppercase text-[10px]">
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                                All Status
                              </div>
                            )
                          },
                          { 
                            value: 'pending', 
                            label: (
                              <div className="flex items-center gap-2 text-yellow-600 font-black tracking-wider uppercase text-[10px]">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                                Pending
                              </div>
                            ) 
                          },
                          { 
                            value: 'confirmed', 
                            label: (
                              <div className="flex items-center gap-2 text-blue-600 font-black tracking-wider uppercase text-[10px]">
                                <Check size={14} strokeWidth={3} className="drop-shadow-sm" />
                                Confirmed
                              </div>
                            ) 
                          },
                          { 
                            value: 'completed', 
                            label: (
                              <div className="flex items-center gap-2 text-green-600 font-black tracking-wider uppercase text-[10px]">
                                <Check size={14} strokeWidth={3} className="drop-shadow-sm" />
                                Completed
                              </div>
                            ) 
                          },
                          { 
                            value: 'cancelled', 
                            label: (
                              <div className="flex items-center gap-2 text-red-600 font-black tracking-wider uppercase text-[10px]">
                                <X size={14} strokeWidth={3} className="drop-shadow-sm" />
                                Cancelled
                              </div>
                            ) 
                          }
                        ]}
                        renderValue={(opt) => (
                          <div className="flex items-center gap-1.5">
                            {opt?.value === 'all' && <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />}
                            {opt?.value === 'pending' && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]" />}
                            {opt?.value === 'confirmed' && <Check size={12} strokeWidth={3} className="drop-shadow-sm text-blue-600" />}
                            {opt?.value === 'completed' && <Check size={12} strokeWidth={3} className="drop-shadow-sm text-green-600" />}
                            {opt?.value === 'cancelled' && <X size={12} strokeWidth={3} className="drop-shadow-sm text-red-600" />}
                            <span className={cn(
                              opt?.value === 'pending' && "text-yellow-600",
                              opt?.value === 'confirmed' && "text-blue-600",
                              opt?.value === 'completed' && "text-green-600",
                              opt?.value === 'cancelled' && "text-red-600",
                              opt?.value === 'all' && "text-foreground"
                            )}>
                              {opt?.value === 'all' ? 'All Status' : opt?.value}
                            </span>
                          </div>
                        )}
                        dropdownClassName="p-2 space-y-1 bg-card/95  border border-border/50 shadow-2xl rounded-xl"
                        buttonClassName="text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-3"
                      />
 </div>
 <div className="flex flex-col flex-1 justify-center">
 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
 <Settings size={12} className="text-primary [.midnight_&]:text-amber-400" />
 OPTIONS
 </label>
 <div className="flex items-center gap-2">
 <motion.button 
 whileTap={{ scale: 0.97 }}
 onClick={() => setShowAllDates(!showAllDates)}
 className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", showAllDates ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground")}
 >
 {showAllDates ? 'All Dates' : 'Show All'}
 </motion.button>
 <motion.button 
 whileTap={{ scale: 0.97 }}
 onClick={() => setSortBy(sortBy === 'date' ? 'status' : 'date')}
 className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
 >
 Sort: {sortBy}
 </motion.button>
 </div>
 </div>
 </div>
 </div>`;

const newFilterAdmin = `) : (
 <div className="bg-card border border-border rounded-xl w-full mb-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center p-2 gap-3">
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
   <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 lg:pb-0 hide-scrollbar flex-1">
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
)`;

if (code.includes(oldHeader)) {
    code = code.replace(oldHeader, newHeader);
} else {
    console.error("oldHeader not found!");
}
if (code.includes(oldFilterAdmin)) {
    code = code.replace(oldFilterAdmin, newFilterAdmin);
} else {
    console.error("oldFilterAdmin not found!");
}

fs.writeFileSync('src/AppCore.tsx', code);
