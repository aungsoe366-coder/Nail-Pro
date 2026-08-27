const fs = require('fs');
let lines = fs.readFileSync('src/AppCore.tsx', 'utf8').split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Booking Confirmation') && lines[i-1].includes('h3')) {
    startIndex = i - 9; // Get to the opening motion.div
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes('"{apptNotes}"')) {
    endIndex = i + 4; // </motion.div>
    break;
  }
}

if (endIndex === -1) {
  // Try another approach for endIndex
  for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].includes('formStep === 1 ? (')) {
        endIndex = i - 2; // </motion.div>
        break;
      }
  }
}

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
     return \`\${hh}:\${m.toString().padStart(2, '0')} \${ampm}\`;
   };

   return (
     <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden relative">
       {/* Decorative Gold Accent */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

       <div className="p-6 border-b border-border/40 flex items-center gap-4 bg-muted/20">
         <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary [.midnight_&]:text-[#D4AF37] border border-primary/20 shadow-sm">
           <Check size={24} strokeWidth={2.5} />
         </div>
         <div>
           <h3 className="text-xl font-black text-foreground tracking-tight font-serif uppercase">
             Booking Summary
           </h3>
           <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-0.5">Please review your appointment</p>
         </div>
       </div>

       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
         <div className="space-y-1">
           <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
             <UserIcon size={12} className="text-primary" /> Customer
           </div>
           <div>
             <p className="font-bold text-foreground text-base tracking-tight leading-none">{displayCustName || 'N/A'}</p>
             <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-1.5">
               <Phone size={12} /> {displayCustPhone || 'N/A'}
             </p>
           </div>
         </div>

         <div className="space-y-1">
           <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
             <Briefcase size={12} className="text-primary" /> Service
           </div>
           <div>
             <p className="font-bold text-foreground text-base tracking-tight leading-none">{displaySvcName || 'N/A'}</p>
             <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-1.5">
               <HistoryIcon size={12} /> {apptDuration} mins ({formatTimeAMPM(apptTime)} - {formatTimeAMPM(apptEndTime)})
             </p>
           </div>
         </div>

         <div className="space-y-1">
           <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
             <UserIcon size={12} className="text-primary" /> Staff Member
           </div>
           <div>
             <p className="font-bold text-foreground text-base tracking-tight">
               {selectedStaff?.name || 'Any Staff (Auto)'}
             </p>
             <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest mt-0.5">{selectedStaff?.role?.replace('_', ' ') || 'Professional'}</p>
           </div>
         </div>

         <div className="space-y-1">
           <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
             <CalendarIcon size={12} className="text-primary" /> Scheduled Date
           </div>
           <div>
             <p className="font-bold text-foreground text-base tracking-tight">{format(new Date(apptDate || new Date()), 'EEEE, MMMM d, yyyy')}</p>
             <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest mt-0.5">Mark your calendar</p>
           </div>
         </div>

         {isHomeService && (
           <div className="col-span-full bg-green-500/5 p-4 rounded-xl border border-green-500/20 flex items-center gap-4 mt-2">
             <div className="p-2.5 bg-green-500/10 text-green-600 rounded-lg">
               <Car size={18} strokeWidth={2.5} />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.1em]">Service Location</span>
               <span className="text-sm font-bold text-foreground">At Home Service Requested</span>
             </div>
           </div>
         )}

         {apptNotes && (
           <div className="col-span-full space-y-2 mt-2 pt-4 border-t border-border/30">
             <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
               <FileText size={12} className="text-primary" /> Additional Notes
             </div>
             <div>
               <p className="text-sm font-medium text-foreground italic">"{apptNotes}"</p>
             </div>
           </div>
         )}
       </div>
     </div>
   );
 })()}
 </motion.div>`;

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 1, newStep2);
  fs.writeFileSync('src/AppCore.tsx', lines.join('\n'));
  console.log("Replaced Step 2 Rendering from " + startIndex + " to " + endIndex);
} else {
  console.log("Could not match Step 2 bounds. Start: " + startIndex + ", End: " + endIndex);
}
