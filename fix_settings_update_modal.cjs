const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regexModal = /\{isUpdateModalOpen && \([\s\S]*?\}\)/;

const luxuryModalBlock = `{isUpdateModalOpen && (
        <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 border border-primary/20 space-y-8 text-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10 border border-primary/20">
              <Download className="w-10 h-10 text-primary drop-shadow-sm" />
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="text-3xl font-black tracking-tighter text-foreground">Update Available</h3>
              <p className="text-muted-foreground text-sm font-medium px-4">{updateMsg?.text || "A new version of the application is available. Please update to continue using all features securely."}</p>
            </div>
            <div className="space-y-4 relative z-10">
               <button
                 onClick={forceUpdate}
                 className="w-full bg-primary text-primary-foreground font-black tracking-widest text-xs py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase"
               >
                 <Download size={18} />
                 UPDATE NOW
               </button>
               <button
                 onClick={() => setIsUpdateModalOpen(false)}
                 className="w-full bg-muted/50 text-muted-foreground font-bold text-xs tracking-widest uppercase py-4 rounded-2xl shadow-sm hover:bg-muted active:scale-95 transition-all"
               >
                 LATER
               </button>
            </div>
          </div>
        </div>
      )}`;

if (regexModal.test(code)) {
  code = code.replace(regexModal, luxuryModalBlock);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find regexModal");
}
