const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldStats = ` const stats = [
    { label: "Today's Sales", value: totalSales.toLocaleString(), suffix: "Ks", icon: <DollarSign size={24} strokeWidth={2.5} />, color: "text-amber-600", bg: "bg-amber-500/10" },
    ...((isAdmin || isCashier) ? [
    { label: "Today's Expenses", value: totalExpenses.toLocaleString(), suffix: "Ks", icon: <TrendingDown size={24} strokeWidth={2.5} />, color: "text-rose-600", bg: "bg-rose-500/10" },
    { label: "Net Profit", value: netProfit.toLocaleString(), suffix: "Ks", icon: <TrendingUp size={24} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    ] : []),
    { label: "Appointments", value: pendingAppts.toString(), suffix: "", icon: <CalendarIcon size={24} strokeWidth={2.5} />, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  ];`;

const newStats = ` const stats = [
    { label: "Today's Sales", value: totalSales.toLocaleString(), suffix: "Ks", icon: <DollarSign size={24} strokeWidth={2.5} />, color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Today's Expenses", value: totalExpenses.toLocaleString(), suffix: "Ks", icon: <TrendingDown size={24} strokeWidth={2.5} />, color: "text-rose-600", bg: "bg-rose-500/10" }
  ];`;

code = code.replace(oldStats, newStats);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Stats fixed.");
