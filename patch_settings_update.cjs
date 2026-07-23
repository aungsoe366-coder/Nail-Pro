const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regexUpdateMsg = /\{updateMsg && \([\s\S]*?<\/motion\.div>\s*\)\}/;
const newUpdateMsgSection = `{updateMsg && updateMsg.type !== 'info' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={cn(
              "p-4 border text-sm rounded-2xl flex items-center gap-3 font-bold justify-between flex-wrap",
              updateMsg.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-500" :
              "bg-green-500/10 border-green-500/20 text-green-500"
            )}>
              <div className="flex items-center gap-3">
                 {updateMsg.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                 {updateMsg.text}
              </div>
            </motion.div>
          )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-[2rem] shadow-2xl p-8 border border-primary/20 space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Download className="w-8 h-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tighter text-foreground">Update Available</h3>
              <p className="text-muted-foreground text-sm font-medium">{updateMsg?.text || "A new version of the application is available. Please update to continue using all features securely."}</p>
            </div>
            <div className="space-y-3">
               <button
                 onClick={forceUpdate}
                 className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 <Download size={20} />
                 UPDATE NOW
               </button>
               <button
                 onClick={() => setIsUpdateModalOpen(false)}
                 className="w-full bg-muted text-muted-foreground font-bold py-3.5 rounded-xl shadow-sm hover:bg-muted/80 active:scale-95 transition-all"
               >
                 LATER
               </button>
            </div>
          </div>
        </div>
      )}`;

if (regexUpdateMsg.test(code)) {
  code = code.replace(regexUpdateMsg, newUpdateMsgSection);
  const searchState = "const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);";
  const replaceState = searchState + "\n  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);";
  code = code.replace(searchState, replaceState);
  
  // also modify checkForUpdates
  const checkForUpdatesStr = `        if (data.latestVersion !== CURRENT_VERSION) {
          setUpdateMsg({ type: 'info', text: \`Update available: v\${data.latestVersion}\` });
          if (data.updateUrl) setUpdateUrl(data.updateUrl);
        }`;
  const checkForUpdatesReplacement = `        if (data.latestVersion !== CURRENT_VERSION) {
          setUpdateMsg({ type: 'info', text: \`Version \${data.latestVersion} is ready to download.\` });
          setIsUpdateModalOpen(true);
          if (data.updateUrl) setUpdateUrl(data.updateUrl);
        }`;
  
  code = code.replace(checkForUpdatesStr, checkForUpdatesReplacement);
  
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find regexUpdateMsg");
}
