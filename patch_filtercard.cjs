const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const filterCardStart = `{/* Filter Card */}
 <div className="bg-card border border-border rounded-2xl w-full mb-3 md:mb-6 z-50 relative">
 <div className="p-4 relative group">`;

const replaceWith = `{/* Filter Card */}
 {profile?.role === 'customer' ? (
  <div className="bg-card border border-border rounded-2xl w-full mb-3 md:mb-6 flex p-1">
    <motion.button 
      whileTap={{ scale: 0.97 }}
      onClick={() => setCustomerApptTab('upcoming')}
      className={cn("flex-1 py-3 text-sm font-bold rounded-xl transition-all", customerApptTab === 'upcoming' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
    >
      Upcoming
    </motion.button>
    <motion.button 
      whileTap={{ scale: 0.97 }}
      onClick={() => setCustomerApptTab('past')}
      className={cn("flex-1 py-3 text-sm font-bold rounded-xl transition-all", customerApptTab === 'past' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground")}
    >
      Past / Completed
    </motion.button>
  </div>
) : (
 <div className="bg-card border border-border rounded-2xl w-full mb-3 md:mb-6 z-50 relative">
 <div className="p-4 relative group">`;

const filterCardEnd = `</motion.button>
 </div>
 </div> 
 </div>
 </div>`;

const replaceWithEnd = `</motion.button>
 </div>
 </div> 
 </div>
 </div>
 )}`;

code = code.replace(filterCardStart, replaceWith);
code = code.replace(filterCardEnd, replaceWithEnd);

fs.writeFileSync('src/AppCore.tsx', code);
