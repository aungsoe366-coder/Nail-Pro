const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetRegex = /<div className="flex items-center gap-4 mb-8 p-6 bg-card rounded-3xl shadow-sm border border-border\/50 relative overflow-hidden">[\s\S]*?<\/div>\n       <\/div>/;

const replacement = `<div className="flex items-center gap-3 mb-4 p-4 bg-card rounded-2xl shadow-sm border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
          <div className="p-2 bg-primary/10 rounded-xl border border-border text-primary relative z-10">
            <Settings className="w-5 h-5" />
          </div>
          <div className="relative z-10">
            <h1 className="text-xl font-black tracking-tighter">Settings</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Manage your preferences</p>
          </div>
       </div>

       <div className="p-4 bg-card rounded-2xl shadow-sm border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black tracking-tighter uppercase">App Theme</h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['gold', 'rose', 'midnight'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "py-2 px-3 rounded-xl border transition-all font-black text-[10px] tracking-widest uppercase flex items-center gap-2 shrink-0",
                  theme === t 
                    ? "border-primary bg-primary/10 text-primary shadow-sm" 
                    : "border-border/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-3 h-3 rounded-full shadow-inner",
                  t === 'gold' ? "bg-gradient-to-br from-amber-200 to-yellow-600" :
                  t === 'rose' ? "bg-gradient-to-br from-rose-300 to-pink-600" :
                  "bg-gradient-to-br from-slate-700 to-slate-900"
                )} />
                {t}
              </button>
            ))}
          </div>
       </div>`;

if (targetRegex.test(code)) {
  code = code.replace(targetRegex, replacement);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched successfully!");
} else {
  console.log("Could not find the target string in src/AppCore.tsx");
}
