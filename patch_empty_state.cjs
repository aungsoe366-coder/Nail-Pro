const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldEmptyState = `) : filteredAppts.length === 0 ? (
 <div className="text-center py-32 bg-muted/5 rounded-[3rem] border-2 border-dashed ">
 <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
 <CalendarIcon className="text-muted-foreground/30" size={48} />
 </div>
 <p className="text-muted-foreground text-lg font-bold italic">No appointments found matching your criteria.</p>
 <motion.button whileTap={{ scale: 0.97 }} 
 onClick={() => { resetForm(); setIsAdding(true); }}
 className="mt-6 text-primary [.midnight_&]:text-amber-400 font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto"
 >
 <Plus size={16} />
 Book New Appointment
 </motion.button>
 </div>
 ) : (`;

const newEmptyState = `) : filteredAppts.length === 0 ? (
 <div className="text-center py-24 bg-card rounded-3xl border border-border/50 shadow-sm flex flex-col items-center justify-center">
   <div className="w-20 h-20 bg-primary/10 [.midnight_&]:bg-amber-500/10 rounded-2xl flex items-center justify-center mb-5 transform rotate-3">
     <CalendarIcon className="text-primary [.midnight_&]:text-[#D4AF37]" size={36} strokeWidth={1.5} />
   </div>
   <p className="text-foreground text-lg font-bold">No bookings found</p>
   <p className="text-muted-foreground text-sm mt-1 mb-6">There are no appointments matching your current filters.</p>
   <motion.button 
     whileTap={{ scale: 0.97 }} 
     onClick={() => { resetForm(); setIsAdding(true); }}
     className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm flex items-center gap-2"
   >
     <Plus size={16} />
     Book Appointment
   </motion.button>
 </div>
 ) : (`;

if (code.includes(oldEmptyState)) {
    code = code.replace(oldEmptyState, newEmptyState);
    console.log("Empty state replaced.");
} else {
    console.log("Empty state NOT matched.");
}

fs.writeFileSync('src/AppCore.tsx', code);
