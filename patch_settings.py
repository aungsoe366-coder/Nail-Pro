import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Update lucide-react imports to add Info if not present
if ' Info,' not in content and 'Info } from' not in content:
    content = content.replace("Settings,", "Settings,\n  Info,")

# 2. Add Settings to menuItems
if "{ id: 'settings'" not in content:
    # Find the menuItems array
    menu_items_match = re.search(r"const menuItems = \[\n(.*?)\n  \];", content, re.DOTALL)
    if menu_items_match:
        items = menu_items_match.group(1)
        new_items = items + "\n    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, path: '/settings', roles: ['super_admin', 'owner', 'cashier', 'staff', 'customer'] },"
        content = content.replace(menu_items_match.group(0), f"const menuItems = [\n{new_items}\n  ];")

# 3. Replace ChangePasswordPage with SettingsPage
settings_page_code = """const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const { changePassword, error, setError } = useAuth();
  
  const [updateChecking, setUpdateChecking] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{type: 'success'|'info'|'error', text: string} | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPwdSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setPwdLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwdSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err) {
      // Error handled in useAuth
    } finally {
      setPwdLoading(false);
    }
  };

  const checkForUpdates = async () => {
    setUpdateChecking(true);
    setUpdateMsg(null);
    try {
      const remoteSnap = await getDoc(doc(db, 'app_config', 'version_control'));
      const data = remoteSnap.data();
      if (data && data.latestVersion) {
        if (data.latestVersion !== CURRENT_VERSION) {
          setUpdateMsg({ type: 'info', text: `Update available: v${data.latestVersion}` });
        } else {
          setUpdateMsg({ type: 'success', text: "You are on the latest version." });
        }
      } else {
         setUpdateMsg({ type: 'success', text: "You are on the latest version." });
      }
    } catch (err) {
      setUpdateMsg({ type: 'error', text: "Failed to check for updates." });
    } finally {
      setUpdateChecking(false);
    }
  };

  const forceUpdate = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
       <div className="flex items-center gap-4 mb-8 p-6 bg-card rounded-3xl shadow-sm border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="p-4 bg-primary/10 rounded-2xl border border-border text-primary relative z-10">
            <Settings className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tighter">Settings</h1>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest opacity-60">Manage your preferences</p>
          </div>
       </div>

       <div className="p-8 bg-card rounded-3xl shadow-sm border border-border/50 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black tracking-tighter">App Theme</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['gold', 'rose', 'midnight'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "py-4 px-6 rounded-2xl border-2 transition-all font-black text-xs tracking-widest uppercase flex flex-col items-center gap-3",
                  theme === t 
                    ? "border-primary bg-primary/10 text-primary scale-[1.02] shadow-xl shadow-primary/20" 
                    : "border-border/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full shadow-inner",
                  t === 'gold' ? "bg-gradient-to-br from-amber-200 to-yellow-600" :
                  t === 'rose' ? "bg-gradient-to-br from-rose-300 to-pink-600" :
                  "bg-gradient-to-br from-slate-700 to-slate-900"
                )} />
                {t}
              </button>
            ))}
          </div>
       </div>

       <div className="p-8 bg-card rounded-3xl shadow-sm border border-border/50 space-y-6">
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
            <button type="submit" disabled={pwdLoading} className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all mt-2">
              {pwdLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
       </div>

       <div className="p-8 bg-card rounded-3xl shadow-sm border border-border/50 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black tracking-tighter">System Version</h2>
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/20 border border-border/50 flex-wrap gap-4">
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Current Version</p>
                <p className="text-2xl font-black tracking-tighter">v{CURRENT_VERSION}</p>
             </div>
             <button onClick={checkForUpdates} disabled={updateChecking} className="py-3 px-6 rounded-xl border-2 border-primary text-primary font-black text-xs tracking-widest uppercase hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50">
               {updateChecking ? 'Checking...' : 'Check for Updates'}
             </button>
          </div>

          {updateMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={cn(
              "p-4 border text-sm rounded-2xl flex items-center gap-3 font-bold justify-between flex-wrap",
              updateMsg.type === 'info' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
              updateMsg.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-500" :
              "bg-green-500/10 border-green-500/20 text-green-500"
            )}>
              <div className="flex items-center gap-3">
                 {updateMsg.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <Info className="w-5 h-5 flex-shrink-0" />}
                 {updateMsg.text}
              </div>
              {updateMsg.type === 'info' && (
                 <button onClick={forceUpdate} className="py-2 px-4 rounded-lg bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                    Force Update
                 </button>
              )}
            </motion.div>
          )}
       </div>
    </div>
  );
};
"""

# Extract the old ChangePasswordPage and replace it
match = re.search(r"const ChangePasswordPage: React\.FC = \(\) => \{.*?(?=\nconst |\nexport |\n$)", content, re.DOTALL)
if match:
    old_code = match.group(0)
    # Check if we didn't accidentally match too much by searching for another component definition
    if 'const IdentityResetPage: React.FC' in old_code:
        # manual slice
        old_code = old_code.split('const IdentityResetPage: React.FC')[0]
    
    content = content.replace(old_code, settings_page_code + "\n\n")

# 4. Update the Route
content = content.replace('<Route path="/change-password" element={<ChangePasswordPage />} />', '<Route path="/settings" element={<SettingsPage />} />')

# Write back
with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
