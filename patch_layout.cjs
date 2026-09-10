const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const navCode = `
const renderCustomerBottomNav = () => {
    if (!isCustomer || isPos) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 [.midnight_&]:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 [.midnight_&]:border-slate-800 z-[999] pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around p-2">
          <button 
             onClick={() => navigate('/')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300", location.pathname === '/' ? "text-amber-600 scale-110 font-black drop-shadow-sm" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             <Home size={20} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
             <span className={cn("text-[9px]", location.pathname === '/' ? "font-black" : "font-bold")}>Home</span>
          </button>
          <button 
             onClick={() => navigate('/gallery')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300", location.pathname === '/gallery' && !(location.state as any)?.tab ? "text-amber-600 scale-110 font-black drop-shadow-sm" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             <Store size={20} strokeWidth={location.pathname === '/gallery' && !(location.state as any)?.tab ? 2.5 : 2} />
             <span className={cn("text-[9px]", location.pathname === '/gallery' && !(location.state as any)?.tab ? "font-black" : "font-bold")}>Shop</span>
          </button>
          <button 
             onClick={() => navigate('/appointments')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300", location.pathname === '/appointments' ? "text-amber-600 scale-110 font-black drop-shadow-sm" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             <Calendar size={20} strokeWidth={location.pathname === '/appointments' ? 2.5 : 2} />
             <span className={cn("text-[9px]", location.pathname === '/appointments' ? "font-black" : "font-bold")}>Booking</span>
          </button>
          <button 
             onClick={() => navigate('/gallery', { state: { tab: 'orders' } })} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300", location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' ? "text-amber-600 scale-110 font-black drop-shadow-sm" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             <PackageOpen size={20} strokeWidth={location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' ? 2.5 : 2} />
             <span className={cn("text-[9px]", location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' ? "font-black" : "font-bold")}>Orders</span>
          </button>
        </div>
      </div>
    );
};
`;

const targetRender = `      <main className={isPos ? "flex-1 flex flex-col overflow-hidden relative w-full min-h-0" : "w-full flex-1 flex flex-col"}>
        {isPos ? (
          children
        ) : (
          <PullToRefresh onRefresh={handleRefresh} isPos={isPos}>
            {children}
          </PullToRefresh>
        )}
      </main>
    </motion.div>
  );
};`;

const replacement = `      <main className={isPos ? "flex-1 flex flex-col overflow-hidden relative w-full min-h-0" : "w-full flex-1 flex flex-col"}>
        {isPos ? (
          children
        ) : (
          <PullToRefresh onRefresh={handleRefresh} isPos={isPos}>
            {children}
          </PullToRefresh>
        )}
      </main>
      {renderCustomerBottomNav()}
    </motion.div>
  );
};`;

if (code.includes("const isPos = location.pathname === '/pos';")) {
  // we can inject navCode just above the return
  code = code.replace(
    "const isPos = location.pathname === '/pos';",
    navCode + "\n  const isPos = location.pathname === '/pos';"
  );
  
  if (code.includes(targetRender)) {
    code = code.replace(targetRender, replacement);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched Layout Bottom Nav!");
  } else {
    // maybe spacing is different
    let c = code.replace(/\s+/g, ' ');
    let tr = targetRender.replace(/\s+/g, ' ');
    let rp = replacement.replace(/\s+/g, ' ');
    
    if (c.includes(tr)) {
       let s = c.indexOf(tr);
       // we can't easily replace. let's just do a simpler replace.
       code = code.replace("</main>\n    </motion.div>", "</main>\n    {renderCustomerBottomNav()}\n    </motion.div>");
       fs.writeFileSync('src/AppCore.tsx', code);
       console.log("Patched Layout Bottom Nav via alternative!");
    } else {
       console.log("targetRender not found at all");
    }
  }
} else {
  console.log("isPos declaration not found");
}
