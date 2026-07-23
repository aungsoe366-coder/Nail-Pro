const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const searchState = "const [updateMsg, setUpdateMsg] = useState<{type: 'success'|'info'|'error', text: string} | null>(null);";
const replaceState = searchState + "\n  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);";

code = code.replace(searchState, replaceState);

// Replace the inline form with a button and a modal

const oldFormSection = `       <div className="p-8 bg-card rounded-3xl shadow-sm border border-border/50 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black tracking-tighter">Change Password</h2>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-3 font-bold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {pwdSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-2xl flex items-center gap-3 font-bold">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              Password updated successfully!
            </motion.div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" required placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" required placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" required placeholder="••••••••" />
            </div>
            <button type="submit" disabled={pwdLoading} className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all mt-2">
              {pwdLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
       </div>`;

const newFormSection = `       <div className="p-8 bg-card rounded-3xl shadow-sm border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black tracking-tighter">Change Password</h2>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Update your account password for enhanced security.</p>
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
            className="py-3 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs tracking-widest uppercase hover:bg-primary/90 active:scale-95 transition-all shadow-md shrink-0"
          >
            Change Password
          </button>
       </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-border flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10 shrink-0">
              <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
                <Lock size={20} className="text-primary" />
                Update Password
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-3 font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
              {pwdSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-2xl flex items-center gap-3 font-bold">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  Password updated successfully!
                </motion.div>
              )}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Current Password</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" required placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" required placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-sm" required placeholder="••••••••" />
                </div>
                <button type="submit" disabled={pwdLoading} className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all mt-6">
                  {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}`;

if (code.includes(oldFormSection)) {
  code = code.replace(oldFormSection, newFormSection);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find oldFormSection");
}
