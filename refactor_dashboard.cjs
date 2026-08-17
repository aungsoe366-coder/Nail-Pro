const fs = require('fs');

const filePath = 'src/AppCore.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Stats Array
const oldStats = ` const stats = [
    { label: "Today's Sales", value: \`\${totalSales.toLocaleString()} Ks\`, icon: <DollarSign size={24} strokeWidth={2.5} />, color: "text-amber-600", bg: "bg-amber-500/10" },
    ...((isAdmin || isCashier) ? [
    { label: "Today's Expenses", value: \`\${totalExpenses.toLocaleString()} Ks\`, icon: <TrendingDown size={24} strokeWidth={2.5} />, color: "text-rose-600", bg: "bg-rose-500/10" },
    { label: "Net Profit", value: \`\${netProfit.toLocaleString()} Ks\`, icon: <TrendingUp size={24} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    ] : []),
    { label: "Appointments", value: pendingAppts.toString(), icon: <CalendarIcon size={24} strokeWidth={2.5} />, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  ];`;

const newStats = ` const stats = [
    { label: "Today's Sales", value: totalSales.toLocaleString(), suffix: "Ks", icon: <DollarSign size={24} strokeWidth={2.5} />, color: "text-amber-600", bg: "bg-amber-500/10" },
    ...((isAdmin || isCashier) ? [
    { label: "Today's Expenses", value: totalExpenses.toLocaleString(), suffix: "Ks", icon: <TrendingDown size={24} strokeWidth={2.5} />, color: "text-rose-600", bg: "bg-rose-500/10" },
    { label: "Net Profit", value: netProfit.toLocaleString(), suffix: "Ks", icon: <TrendingUp size={24} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    ] : []),
    { label: "Appointments", value: pendingAppts.toString(), suffix: "", icon: <CalendarIcon size={24} strokeWidth={2.5} />, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  ];`;

content = content.replace(oldStats, newStats);

// 2. Main Wrapper
content = content.replace(
  '<div className="w-full max-w-7xl mx-auto px-3 py-4 md:p-6 space-y-4 animate-in fade-in duration-500">',
  '<div className="w-full max-w-7xl mx-auto px-3 py-4 md:p-6 space-y-6 animate-in fade-in duration-500">'
);

// 3. Top Action Buttons Grid
const oldButtons = `<div className="grid grid-cols-2 gap-3 w-full md:w-[400px]">
            <button 
              onClick={() => navigate('/pos')}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-primary text-white h-16 sm:h-14 rounded-2xl font-black text-[10px] sm:text-xs tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all hover:bg-primary/90"
            >
              <Plus size={16} />
              <span>NEW SALE</span>
            </button>
            <button 
              onClick={() => navigate('/appointments')}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-card border-2 border-border h-16 sm:h-14 rounded-2xl font-black text-[10px] sm:text-xs tracking-widest hover:border-primary active:scale-95 transition-all"
            >
              <Calendar size={16} />
              <span>APPOINTMENTS</span>
            </button>
          </div>`;

const newButtons = `<div className="grid grid-cols-2 gap-3 w-full md:w-[400px]">
            <button 
              onClick={() => navigate('/pos')}
              className="flex items-center justify-center gap-2 bg-primary text-white h-12 rounded-2xl font-bold text-xs tracking-wider shadow-sm shadow-primary/20 active:scale-95 transition-all hover:opacity-90"
            >
              <Plus size={16} />
              <span>NEW SALE</span>
            </button>
            <button 
              onClick={() => navigate('/appointments')}
              className="flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 h-12 rounded-2xl font-bold text-xs tracking-wider shadow-sm active:scale-95 transition-all hover:bg-stone-50"
            >
              <Calendar size={16} />
              <span>APPOINTMENTS</span>
            </button>
          </div>`;

content = content.replace(oldButtons, newButtons);

// 4. Metrics Map Render
const oldMetricsRender = `{stats.map((s, i) => (
 <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white border border-stone-100 shadow-sm p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider leading-tight">{s.label}</p>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-500", s.bg, s.color)}>
                  {React.cloneElement(s.icon as any, { size: 16 })}
                </div>
              </div>
              <h4 className="text-xl md:text-2xl font-black text-foreground tracking-tighter truncate">{s.value}</h4>
            </motion.div>
 ))}`;

const newMetricsRender = `{stats.map((s, i) => (
 <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-stone-50/80 border border-stone-100 shadow-sm p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider leading-tight">{s.label}</p>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-500", s.bg, s.color)}>
                  {React.cloneElement(s.icon as any, { size: 16, strokeWidth: 2 })}
                </div>
              </div>
              <h4 className="text-xl font-extrabold text-slate-800 tracking-tight truncate">
                {s.value}
                {s.suffix && <span className="text-xs font-medium text-stone-500 ml-1">{s.suffix}</span>}
              </h4>
            </motion.div>
 ))}`;

content = content.replace(oldMetricsRender, newMetricsRender);

// 5. Section Headers and Empty States

// Recent Sales Section
content = content.replace(
  '<div className="bg-white rounded-2xl border border-rose-100/40 shadow-sm overflow-hidden mb-4 flex flex-col">',
  '<div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-4 flex flex-col">'
);
content = content.replace(
  `<h4 className="text-xs font-bold tracking-wider text-stone-500 uppercase flex items-center">
                  <div className="w-1 h-3.5 bg-amber-500 rounded-full mr-2"></div>
                  Recent Sales
                </h4>`,
  `<h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase">
                  Recent Sales
                </h4>`
);
content = content.replace(
  '<div className="py-12 flex flex-col items-center justify-center text-stone-400 space-y-3 bg-stone-50/50 rounded-xl m-4 border border-dashed border-stone-200">',
  '<div className="p-6 flex flex-col items-center justify-center text-stone-400 space-y-2 bg-stone-50/50 rounded-2xl m-4 border border-dashed border-stone-200">'
);

// Upcoming Appointments Section
content = content.replace(
  '<div className="bg-white rounded-2xl border border-rose-100/40 shadow-sm overflow-hidden mb-4 flex flex-col">',
  '<div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-4 flex flex-col">'
);
content = content.replace(
  `<h4 className="text-xs font-bold tracking-wider text-stone-500 uppercase flex items-center">
                  <div className="w-1 h-3.5 bg-amber-500 rounded-full mr-2"></div>
                  Today's Appointments
                </h4>`,
  `<h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase">
                  Today's Appointments
                </h4>`
);
content = content.replace(
  '<div className="py-12 flex flex-col items-center justify-center text-stone-400 space-y-3 bg-stone-50/50 rounded-xl m-4 border border-dashed border-stone-200">',
  '<div className="p-6 flex flex-col items-center justify-center text-stone-400 space-y-2 bg-stone-50/50 rounded-2xl m-4 border border-dashed border-stone-200">'
);

fs.writeFileSync(filePath, content);
console.log("Refactoring complete");
