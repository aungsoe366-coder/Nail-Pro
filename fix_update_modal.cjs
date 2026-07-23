const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// The badly placed block:
const badBlock = `      {needsUpdate && (
        <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-[2rem] shadow-2xl p-8 border border-primary/20 space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Download className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tighter text-foreground">Update Available</h3>
              <p className="text-muted-foreground text-sm font-medium">A new version of the application is available. Please update to continue using all features securely.</p>
            </div>
            <button
              onClick={() => { window.location.href = updateInfo.updateUrl; }}
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download size={20} />
              UPDATE NOW
            </button>
          </div>
        </div>
      )}`;

const luxuryModalBlock = `      {needsUpdate && updateInfo?.updateUrl && (
        <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 border border-primary/20 space-y-8 text-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10 border border-primary/20">
              <Download className="w-10 h-10 text-primary drop-shadow-sm" />
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="text-3xl font-black tracking-tighter text-foreground">Update Available</h3>
              <p className="text-muted-foreground text-sm font-medium px-4">A new version of the application is available. Please update to continue using all features securely.</p>
            </div>
            <div className="space-y-4 relative z-10">
               <button
                 onClick={() => { window.location.href = updateInfo.updateUrl; }}
                 className="w-full bg-primary text-primary-foreground font-black tracking-widest text-xs py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase"
               >
                 <Download size={18} />
                 UPDATE NOW
               </button>
            </div>
          </div>
        </div>
      )}`;

if (code.includes(badBlock)) {
  code = code.replace(badBlock, "");
}

// We also need to add it before renderExitConfirm() in the main render paths.
// Let's create a function renderNeedsUpdate()
const renderNeedsUpdate = `  const renderNeedsUpdate = () => {
    if (!needsUpdate || !updateInfo?.updateUrl) return null;
    return (
        <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 border border-primary/20 space-y-8 text-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10 border border-primary/20">
              <Download className="w-10 h-10 text-primary drop-shadow-sm" />
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="text-3xl font-black tracking-tighter text-foreground">Update Available</h3>
              <p className="text-muted-foreground text-sm font-medium px-4">A new version of the application is available. Please update to continue using all features securely.</p>
            </div>
            <div className="space-y-4 relative z-10">
               <button
                 onClick={() => { window.location.href = updateInfo.updateUrl; }}
                 className="w-full bg-primary text-primary-foreground font-black tracking-widest text-xs py-4 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase"
               >
                 <Download size={18} />
                 UPDATE NOW
               </button>
            </div>
          </div>
        </div>
    );
  };`;

// Insert renderNeedsUpdate before `if (loading) return`
code = code.replace("if (loading) return (", renderNeedsUpdate + "\n\n  if (loading) return (");

// Replace `<>{renderExitConfirm()}` with `<>{renderNeedsUpdate()}{renderExitConfirm()}`
code = code.replace(/<>\s*\{renderExitConfirm\(\)\}/g, "<>{renderNeedsUpdate()}{renderExitConfirm()}");

// For the main return:
code = code.replace("{renderExitConfirm()}\n      <Sidebar", "{renderNeedsUpdate()}\n      {renderExitConfirm()}\n      <Sidebar");

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Patched successfully");
