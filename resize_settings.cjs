const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetPasswordRegex = /<div className="p-8 bg-card rounded-3xl shadow-sm border border-border\/50 flex flex-col md:flex-row md:items-center justify-between gap-6">[\s\S]*?Change Password\s*<\/button>\s*<\/div>/;

const newPassword = `<div className="p-4 bg-card rounded-2xl shadow-sm border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black tracking-tighter uppercase">Change Password</h2>
          </div>
          <button 
             onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setError(null);
              setPwdSuccess(false);
              setIsPasswordModalOpen(true);
            }} 
             className="py-2 px-4 rounded-xl bg-primary text-primary-foreground font-black text-[10px] tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all shadow-sm shrink-0"
          >
            Update
          </button>
       </div>`;

if (targetPasswordRegex.test(code)) {
  code = code.replace(targetPasswordRegex, newPassword);
} else {
  console.log("Failed to match password card");
}

const targetVersionRegex = /<div className="p-8 bg-card rounded-3xl shadow-sm border border-border\/50 space-y-6">[\s\S]*?<div className="flex items-center gap-3 mb-4">[\s\S]*?<Info className="w-5 h-5 text-primary" \/>[\s\S]*?<h2 className="text-xl font-black tracking-tighter">System Version<\/h2>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center justify-between p-6 rounded-2xl bg-muted\/20 border border-border\/50 flex-wrap gap-4">[\s\S]*?<div>[\s\S]*?<p className="text-\[10px\] font-black uppercase tracking-\[0\.2em\] text-muted-foreground mb-1">Current Version<\/p>[\s\S]*?<p className="text-2xl font-black tracking-tighter">v\{CURRENT_VERSION\}<\/p>[\s\S]*?<\/div>[\s\S]*?<button onClick=\{checkForUpdates\} disabled=\{updateChecking\} className="py-3 px-6 rounded-xl border-2 border-primary text-primary font-black text-xs tracking-widest uppercase hover:bg-primary\/10 active:scale-95 transition-all disabled:opacity-50">[\s\S]*?\{updateChecking \? 'Checking\.\.\.' : 'Check for Updates'\}[\s\S]*?<\/button>[\s\S]*?<\/div>[\s\S]*?\{updateMsg && updateMsg\.type !== 'info' && \([\s\S]*?<motion\.div initial=\{\{ opacity: 0, y: -10 \}\} animate=\{\{ opacity: 1, y: 0 \}\} className=\{cn\([\s\S]*?"p-4 rounded-2xl text-sm font-bold border flex items-center gap-3",[\s\S]*?updateMsg\.type === 'success' \? "bg-green-500\/10 text-green-500 border-green-500\/20" : "bg-red-500\/10 text-red-500 border-red-500\/20"[\s\S]*?\)\}>[\s\S]*?\{updateMsg\.type === 'success' \? <CheckCircle2 className="w-5 h-5 flex-shrink-0" \/> : <AlertCircle className="w-5 h-5 flex-shrink-0" \/>\}[\s\S]*?\{updateMsg\.text\}[\s\S]*?<\/motion\.div>[\s\S]*?\)\}[\s\S]*?<\/div>/;

const newVersion = `<div className="p-4 bg-card rounded-2xl shadow-sm border border-border/50 flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-2">
               <Info className="w-4 h-4 text-primary" />
               <h2 className="text-sm font-black tracking-tighter uppercase">System Version</h2>
             </div>
             <div className="flex items-center gap-3">
                <p className="text-xs font-black tracking-tighter text-muted-foreground">v{CURRENT_VERSION}</p>
                <button onClick={checkForUpdates} disabled={updateChecking} className="py-2 px-4 rounded-xl border border-primary text-primary font-black text-[10px] tracking-widest uppercase hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50">
                  {updateChecking ? 'Checking...' : 'Check'}
                </button>
             </div>
          </div>
          {updateMsg && updateMsg.type !== 'info' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={cn(
               "p-3 rounded-xl text-xs font-bold border flex items-center gap-2",
               updateMsg.type === 'success' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
            )}>
              {updateMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {updateMsg.text}
            </motion.div>
          )}
       </div>`;

if (targetVersionRegex.test(code)) {
  code = code.replace(targetVersionRegex, newVersion);
} else {
  console.log("Failed to match version card");
}

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Complete");
