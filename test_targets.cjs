const fs = require('fs');
const content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targets = [
  '<h2 className="text-3xl font-serif">Welcome back, {profile?.name || \'Beautiful\'}!</h2>',
  '<h3 className="text-2xl font-black tracking-tighter text-foreground uppercase">Dashboard</h3>',
  '<h3 className="text-3xl font-light tracking-tight text-foreground">Monthly <span className="italic font-serif">Summary</span></h3>',
  '<h3 className="text-4xl font-light tracking-tight text-foreground">Shop <span className="italic font-serif">Expenses</span></h3>',
  '<h3 className="text-3xl font-light tracking-tight text-foreground">Daily <span className="italic font-serif">Sales List</span></h3>',
  '<h3 className="text-primary text-2xl font-bold tracking-tight">Staff Commissions</h3>',
  '<h3 className="text-primary text-2xl font-bold tracking-tight">Sales Report</h3>',
  '<h1 className="text-2xl font-black tracking-tighter">Settings</h1>',
];

targets.forEach(t => {
  if (content.includes(t)) {
    console.log("FOUND: ", t);
  } else {
    console.log("MISSING: ", t);
  }
});
