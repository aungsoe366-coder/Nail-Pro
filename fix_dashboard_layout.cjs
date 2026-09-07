const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. Add 'staff' to expenses in menu
const expensesRoleOld = `{ id: 'expenses', label: 'Expenses', icon: <TrendingDown size={18} />, path: '/expenses', roles: ['super_admin', 'owner', 'cashier'] },`;
const expensesRoleNew = `{ id: 'expenses', label: 'Expenses', icon: <TrendingDown size={18} />, path: '/expenses', roles: ['super_admin', 'owner', 'cashier', 'staff'] },`;
code = code.replace(expensesRoleOld, expensesRoleNew);

// 3. Move Appointment Count to Section Header
const apptHeaderOld = `<h4 className="text-xs font-bold tracking-wider text-stone-400 [.midnight_&]:text-[#D4AF37] uppercase">
                 Today's Appointments
               </h4>`;
const apptHeaderNew = `<h4 className="text-xs font-bold tracking-wider text-stone-400 [.midnight_&]:text-[#D4AF37] uppercase flex items-center gap-2">
                 Today's Appointments
                 <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{appointments.length}</span>
               </h4>`;
code = code.replace(apptHeaderOld, apptHeaderNew);

// 4. Refine Recent Sales Badge
const salesHeaderOld = `<div className="px-4 py-3 flex justify-between items-center border-b border-stone-100">
               <h4 className="text-xs font-bold tracking-wider text-stone-400 [.midnight_&]:text-[#D4AF37] uppercase">
                 Recent Sales
               </h4>
<motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/history')} className="text-[10px] font-black text-primary hover:underline tracking-widest">VIEW ALL</motion.button>
</div>`;
const salesHeaderNew = `<div className="px-4 py-3 flex justify-between items-center border-b border-stone-100">
               <h4 className="text-xs font-bold tracking-wider text-stone-400 [.midnight_&]:text-[#D4AF37] uppercase flex items-center gap-2">
                 Recent Sales
               </h4>
               <div className="flex items-center gap-3">
                 <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{sales.length} SALES</span>
                 <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/history')} className="text-[10px] font-black text-primary hover:underline tracking-widest">VIEW ALL</motion.button>
               </div>
</div>`;
code = code.replace(salesHeaderOld, salesHeaderNew);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Dashboard and menu fixed.");
