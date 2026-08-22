const fs = require('fs');

const filePath = 'src/AppCore.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Metrics Animation
content = content.replace(
  `              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}`,
  `              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}`
);

// 2. Update Recent Sales map
const oldSalesMap = `{sales.slice(0, 10).map((s) => (
 <div key={s.id} className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group">`;
const newSalesMap = `{sales.slice(0, 10).map((s, index) => (
 <motion.div 
   initial={{ opacity: 0, x: -10 }}
   animate={{ opacity: 1, x: 0 }}
   transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
   key={s.id} 
   className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group"
 >`;
content = content.replace(oldSalesMap, newSalesMap);

// Replace closing div of sales map
const oldSalesEnd = ` <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{s.items.length} items</p>
 </div>
 </div>
 ))}
 </div>`;
const newSalesEnd = ` <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{s.items.length} items</p>
 </div>
 </motion.div>
 ))}
 </div>`;
content = content.replace(oldSalesEnd, newSalesEnd);


// 3. Update Appointments map
const oldApptsMap = `{appointments.sort((a, b) => a.time.localeCompare(b.time)).map((a) => (
 <div key={a.id} className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group">`;
const newApptsMap = `{appointments.sort((a, b) => a.time.localeCompare(b.time)).map((a, index) => (
 <motion.div 
   initial={{ opacity: 0, x: -10 }}
   animate={{ opacity: 1, x: 0 }}
   transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
   key={a.id} 
   className="px-4 py-3 flex justify-between items-center hover:bg-muted/5 transition-colors group"
 >`;
content = content.replace(oldApptsMap, newApptsMap);

// Replace closing div of appointments map
const oldApptsEnd = ` </span>
 </div>
 </div>
 ))}
 </div>`;
const newApptsEnd = ` </span>
 </div>
 </motion.div>
 ))}
 </div>`;
content = content.replace(oldApptsEnd, newApptsEnd);

fs.writeFileSync(filePath, content);
console.log("Animation added");
