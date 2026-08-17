const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const returnStart = content.indexOf("return (\n    <div className=\"max-w-4xl mx-auto space-y-3 pb-20\">");
if (returnStart === -1) {
  console.log("Could not find start");
  process.exit(1);
}

const pwdModalStart = content.indexOf('{isPasswordModalOpen && (');
const modalsText = content.substring(pwdModalStart, content.indexOf('const ResetPasswordPage: React.FC = () => {'));
// The modals text includes the closing `</div> </div> );};` of SettingsPage

const newReturn = `return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-2 px-2 md:px-0">
      <div className="px-2 md:px-0">
         <h1 className="text-2xl font-black tracking-tighter">Settings</h1>
         <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Manage your preferences</p>
      </div>

      {/* App Theme Group */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-4">Appearance</h3>
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col divide-y divide-border/50">
          <div className="flex flex-row items-center justify-between px-4 py-3 min-h-[52px]">
            <span className="text-sm font-bold text-foreground">App Theme</span>
            <div className="flex items-center gap-2">
              {(['gold', 'rose', 'midnight'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "h-8 px-3 rounded-full transition-all font-black text-[10px] tracking-widest uppercase flex items-center gap-1.5 shrink-0",
                    theme === t 
                      ? "bg-primary/20 text-primary border border-primary/20" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full shadow-inner",
                    t === 'gold' ? "bg-gradient-to-br from-amber-200 to-yellow-600" :
                    t === 'rose' ? "bg-gradient-to-br from-rose-300 to-pink-600" :
                    "bg-gradient-to-br from-slate-700 to-slate-900"
                  )} />
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Localization Group */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-4">Localization</h3>
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col divide-y divide-border/50">
          <div className="flex flex-row items-center justify-between px-4 py-3 min-h-[52px] relative active:bg-muted/30 transition-colors">
            <span className="text-sm font-bold text-foreground">Date Format</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">{preferences.dateFormat || 'MM/DD/YYYY'}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </div>
            <select
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={preferences.dateFormat || 'MM/DD/YYYY'}
              onChange={(e) => handleUpdatePreferences({ dateFormat: e.target.value })}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="flex flex-row items-center justify-between px-4 py-3 min-h-[52px] relative active:bg-muted/30 transition-colors">
            <span className="text-sm font-bold text-foreground">Time Format</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">{preferences.timeFormat === '24h' ? '24-Hour' : '12-Hour (AM/PM)'}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </div>
            <select
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={preferences.timeFormat || '12h'}
              onChange={(e) => handleUpdatePreferences({ timeFormat: e.target.value })}
            >
              <option value="12h">12-Hour (AM/PM)</option>
              <option value="24h">24-Hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Group */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-4">Notifications</h3>
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col divide-y divide-border/50">
          <div className="flex flex-row items-center justify-between px-4 py-3 min-h-[52px]">
            <div className="flex flex-col pr-4">
              <span className="text-sm font-bold text-foreground">Push Notifications</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Receive alerts on your device.</span>
            </div>
            <button
              onClick={() => handleUpdatePreferences({ pushNotifications: !preferences.pushNotifications })}
              className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                preferences.pushNotifications ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <div className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full ring-0 transition duration-200 ease-in-out bg-white shadow-sm",
                preferences.pushNotifications ? "translate-x-2.5" : "-translate-x-2.5"
              )}></div>
            </button>
          </div>
          <div className="flex flex-row items-center justify-between px-4 py-3 min-h-[52px]">
            <div className="flex flex-col pr-4">
              <span className="text-sm font-bold text-foreground">Email Alerts</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Receive weekly reports and alerts.</span>
            </div>
            <button
              onClick={() => handleUpdatePreferences({ emailAlerts: !preferences.emailAlerts })}
              className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                preferences.emailAlerts ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <div className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full ring-0 transition duration-200 ease-in-out bg-white shadow-sm",
                preferences.emailAlerts ? "translate-x-2.5" : "-translate-x-2.5"
              )}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Security Group */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-4">Security</h3>
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col divide-y divide-border/50">
          <button 
            onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setError(null);
              setPwdSuccess(false);
              setResetSuccess(false);
              setIsPasswordModalOpen(true);
            }}
            className="flex flex-row items-center justify-between px-4 py-3 min-h-[52px] text-left hover:bg-muted/30 transition-colors active:bg-muted/50 w-full"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Change Password</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">Update security credentials</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
          </button>
        </div>
      </div>

      {/* System / About Group */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-4">About / System</h3>
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col divide-y divide-border/50">
          <div className="flex flex-row items-center justify-between px-4 py-3 min-h-[52px]">
            <span className="text-sm font-bold text-foreground">Version</span>
            <span className="text-sm text-muted-foreground font-medium">{CURRENT_VERSION} (Stable)</span>
          </div>
          <button 
            onClick={checkForUpdates}
            className="flex flex-row items-center justify-center px-4 py-3 min-h-[52px] text-primary font-bold hover:bg-primary/5 transition-colors active:bg-primary/10 w-full"
          >
            Check for Updates
          </button>
        </div>
      </div>
      
      <div className="pt-2 pb-6 px-4">
        {user ? (
          <button
            onClick={logout}
            className="w-full bg-red-500/10 text-red-600 font-bold uppercase tracking-widest text-xs py-4 rounded-3xl hover:bg-red-500/20 active:scale-95 transition-all"
          >
            Logout
          </button>
        ) : null}
      </div>

      `;
      
const oldEnd = content.indexOf('const ResetPasswordPage: React.FC = () => {');

const finalContent = content.substring(0, returnStart) + newReturn + modalsText + content.substring(oldEnd);

fs.writeFileSync('src/AppCore.tsx', finalContent);
console.log("Patched successfully");
