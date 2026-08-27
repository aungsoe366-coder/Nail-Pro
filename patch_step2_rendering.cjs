const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldStep2 = `<motion.div className="space-y-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: "easeInOut" }}>
 <div className="bg-primary/20 p-4 rounded-2xl border-primary/10 space-y-3 ">
 <div className="flex items-center gap-4">
 <div className="p-4 bg-primary/20 rounded-2xl text-primary [.midnight_&]:text-amber-400 ">
 <Check size={32} strokeWidth={3} />
 </div>
 <div>
 <h3 className="text-2xl font-black text-foreground [.midnight_&]:text-slate-200 tracking-tighter">
 Booking Confirmation
 </h3>
 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Review your appointment details</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
 <div className="space-y-3">
 <div className="flex items-center gap-2 text-[10px] font-black text-foreground [.midnight_&]:text-slate-200 uppercase tracking-[0.2em]">
 <UserIcon size={12} className="text-primary [.midnight_&]:text-amber-400" /> Customer
 </div>
 <div className="bg-card border border-border p-4 rounded-xl ">
 <p className="font-black text-foreground [.midnight_&]:text-slate-200 text-xl tracking-tight leading-none">{manualCustName || 'N/A'}</p>
 <p className="text-xs text-muted-foreground font-bold mt-1.5 flex items-center gap-1.5">
 <Phone size={12} /> {manualCustPhone || 'N/A'}
 </p>
 </div>
 </div>
 <div className="space-y-3">
 <div className="flex items-center gap-2 text-[10px] font-black text-foreground [.midnight_&]:text-slate-200 uppercase tracking-[0.2em]">
 <Briefcase size={12} className="text-primary [.midnight_&]:text-amber-400" /> Service
 </div>
 <div className="bg-card border border-border p-4 rounded-xl ">
 <p className="font-black text-foreground [.midnight_&]:text-slate-200 text-xl tracking-tight leading-none">{manualSvcName || 'N/A'}</p>
 <p className="text-xs text-muted-foreground font-bold mt-1.5 flex items-center gap-1.5">
 <HistoryIcon size={12} /> {apptDuration} mins ({apptTime} - {apptEndTime})
 </p>
 </div>
 </div>
 <div className="space-y-3">
 <div className="flex items-center gap-2 text-[10px] font-black text-foreground [.midnight_&]:text-slate-200 uppercase tracking-[0.2em]">
 <UserIcon size={12} className="text-primary [.midnight_&]:text-amber-400" /> Staff Member
 </div>
 <div className="bg-card border border-border p-4 rounded-xl ">
 <p className="font-black text-foreground [.midnight_&]:text-slate-200 text-lg tracking-tight">
 {staff.find(s => s.email === selectedStaffEmail)?.name || 'Any Staff (Auto)'}
 </p>
 <p className="text-[9px] text-primary [.midnight_&]:text-amber-400 font-black uppercase tracking-widest mt-0.5">Professional Stylist</p>
 </div>
 </div>
 <div className="space-y-3">
 <div className="flex items-center gap-2 text-[10px] font-black text-foreground [.midnight_&]:text-slate-200 uppercase tracking-[0.2em]">
 <CalendarIcon size={12} className="text-primary [.midnight_&]:text-amber-400" /> Scheduled Date
 </div>
 <div className="bg-card border border-border p-4 rounded-xl ">
 <p className="font-black text-foreground [.midnight_&]:text-slate-200 text-lg tracking-tight">{format(new Date(apptDate), 'EEEE, MMMM d, yyyy')}</p>
 <p className="text-[9px] text-primary [.midnight_&]:text-amber-400 font-black uppercase tracking-widest mt-0.5">Mark your calendar</p>
 </div>
 </div>
 {isHomeService && (
 <div className="col-span-full bg-green-500/10 p-4 rounded-2xl border-green-500/20 flex items-center gap-4 ">
 <div className="p-3 bg-green-600 text-foreground [.midnight_&]:text-slate-200 rounded-xl ">
 <Car size={20} strokeWidth={2.5} />
 </div>
 <div className="flex flex-col">
 <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Service Location</span>
 <span className="text-sm font-black text-foreground [.midnight_&]:text-slate-200">At Home Service Requested</span>
 </div>
 </div>
 )}
 {apptNotes && (
 <div className="col-span-full space-y-3">
 <div className="flex items-center gap-2 text-[10px] font-black text-foreground [.midnight_&]:text-slate-200 uppercase tracking-[0.2em]">
 <FileText size={12} className="text-primary [.midnight_&]:text-amber-400" /> Additional Notes
 </div>
 <div className="bg-card border border-border p-4 rounded-xl ">
 <p className="text-sm font-medium text-foreground [.midnight_&]:text-slate-200">{apptNotes}</p>
 </div>
 </div>
 )}
 </div>
 </div>
 </motion.div>`;

const newStep2 = `<motion.div className="space-y-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, ease: "easeInOut" }}>
 {(() => {
   const displayCustName = profile?.role === 'customer' ? profile.name : (selectedCustId === 'manual' ? manualCustName : customers.find(c => c.id === selectedCustId)?.name);
   const displayCustPhone = profile?.role === 'customer' ? (profile.phone || profile.email) : (selectedCustId === 'manual' ? manualCustPhone : customers.find(c => c.id === selectedCustId)?.phone);
   const displaySvcName = selectedSvcId === 'manual' ? manualSvcName : services.find(s => s.id === selectedSvcId)?.name;
   const selectedStaff = staff.find(s => s.email === selectedStaffEmail);

   const formatTimeAMPM = (timeStr) => {
     if (!timeStr) return '';
     const [h, m] = timeStr.split(':');
     let hh = parseInt(h);
     const ampm = hh >= 12 ? 'PM' : 'AM';
     hh = hh % 12 || 12;
     return \`\${hh}:\${m} \${ampm}\`;
   };

   return (
     <div className="bg-card rounded-2xl border border-primary/20 shadow-xl overflow-hidden shadow-primary/5">
       <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center gap-4">
         <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary [.midnight_&]:text-amber-400 border border-primary/30">
           <Check size={24} strokeWidth={3} />
         </div>
         <div>
           <h3 className="text-2xl font-black text-foreground tracking-tighter font-serif uppercase">
             Booking Summary
           </h3>
           <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-0.5">Please review your appointment</p>
         </div>
       </div>

       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
         <div className="space-y-2 relative">
           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
             <UserIcon size={14} className="text-primary" /> Customer
           </div>
           <div>
             <p className="font-black text-foreground text-lg tracking-tight leading-none">{displayCustName || 'N/A'}</p>
             <p className="text-xs text-muted-foreground font-bold mt-1 flex items-center gap-1.5">
               <Phone size={12} /> {displayCustPhone || 'N/A'}
             </p>
           </div>
         </div>

         <div className="space-y-2 relative">
           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
             <Briefcase size={14} className="text-primary" /> Service
           </div>
           <div>
             <p className="font-black text-foreground text-lg tracking-tight leading-none">{displaySvcName || 'N/A'}</p>
             <p className="text-xs text-muted-foreground font-bold mt-1 flex items-center gap-1.5">
               <HistoryIcon size={12} /> {apptDuration} mins ({formatTimeAMPM(apptTime)} - {formatTimeAMPM(apptEndTime)})
             </p>
           </div>
         </div>

         <div className="space-y-2 relative">
           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
             <UserIcon size={14} className="text-primary" /> Staff Member
           </div>
           <div>
             <p className="font-black text-foreground text-lg tracking-tight">
               {selectedStaff?.name || 'Any Staff (Auto)'}
             </p>
             <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">{selectedStaff?.role?.replace('_', ' ') || 'Professional'}</p>
           </div>
         </div>

         <div className="space-y-2 relative">
           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
             <CalendarIcon size={14} className="text-primary" /> Scheduled Date
           </div>
           <div>
             <p className="font-black text-foreground text-lg tracking-tight">{format(new Date(apptDate || new Date()), 'EEEE, MMMM d, yyyy')}</p>
             <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">Mark your calendar</p>
           </div>
         </div>

         {isHomeService && (
           <div className="col-span-full bg-green-500/10 p-4 rounded-xl border border-green-500/20 flex items-center gap-4 mt-2">
             <div className="p-2.5 bg-green-500 text-white rounded-lg">
               <Car size={18} strokeWidth={2.5} />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.1em]">Service Location</span>
               <span className="text-sm font-bold text-foreground">At Home Service Requested</span>
             </div>
           </div>
         )}

         {apptNotes && (
           <div className="col-span-full space-y-2 mt-2">
             <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
               <FileText size={14} className="text-primary" /> Additional Notes
             </div>
             <div className="bg-muted/50 border border-border p-4 rounded-xl">
               <p className="text-sm font-medium text-foreground">{apptNotes}</p>
             </div>
           </div>
         )}
       </div>
     </div>
   );
 })()}
 </motion.div>`;

if (code.includes(oldStep2)) {
  code = code.replace(oldStep2, newStep2);
  console.log("Replaced Step 2 Rendering");
} else {
  console.log("Could not match oldStep2!");
}

fs.writeFileSync('src/AppCore.tsx', code);
