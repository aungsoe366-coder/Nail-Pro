const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regexBottomNav = /const renderCustomerBottomNav = \(\) => \{[\s\S]*?    \);\n\};/;

const newNav = `const renderCustomerBottomNav = () => {
    if (!isCustomer || isPos) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-amber-200/60 shadow-lg pb-safe md:hidden">
        <div className="flex items-center justify-around p-2">
          <button 
             onClick={() => navigate('/')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/' ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600")}
          >
             {location.pathname === '/' && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <Home size={20} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
             <span className="text-[10px]">Home</span>
          </button>
          <button 
             onClick={() => navigate('/gallery')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/gallery' && !(location.state as any)?.tab ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600")}
          >
             {location.pathname === '/gallery' && !(location.state as any)?.tab && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <Store size={20} strokeWidth={location.pathname === '/gallery' && !(location.state as any)?.tab ? 2.5 : 2} />
             <span className="text-[10px]">Shop</span>
          </button>
          <button 
             onClick={() => navigate('/appointments')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/appointments' ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600")}
          >
             {location.pathname === '/appointments' && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <Calendar size={20} strokeWidth={location.pathname === '/appointments' ? 2.5 : 2} />
             <span className="text-[10px]">Booking</span>
          </button>
          <button 
             onClick={() => navigate('/gallery', { state: { tab: 'orders' } })} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600")}
          >
             {location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <PackageOpen size={20} strokeWidth={location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' ? 2.5 : 2} />
             <span className="text-[10px]">Orders</span>
          </button>
          <button 
             onClick={() => navigate('/settings')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/settings' ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600")}
          >
             {location.pathname === '/settings' && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <UserIcon size={20} strokeWidth={location.pathname === '/settings' ? 2.5 : 2} />
             <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </div>
    );
};`;

if (regexBottomNav.test(code)) {
    code = code.replace(regexBottomNav, newNav);
    console.log("Patched bottom nav!");
} else {
    console.log("Could not find renderCustomerBottomNav to patch.");
}

// Modify the padding of the layout wrapper
// Old: isCustomer ? 'min-h-screen pb-24' : 'min-h-screen pb-10'
// New: isCustomer ? 'min-h-screen pb-28' : 'min-h-screen pb-10'
code = code.replace(
    /isCustomer \? 'min-h-screen pb-24' : 'min-h-screen pb-10'/g,
    "isCustomer ? 'min-h-screen pb-28' : 'min-h-screen pb-10'"
);

// If it hasn't been replaced because it wasn't pb-24:
if (!code.includes("isCustomer ? 'min-h-screen pb-28' : 'min-h-screen pb-10'")) {
    code = code.replace(
        /'min-h-screen pb-10'/g,
        "isCustomer ? 'min-h-screen pb-28' : 'min-h-screen pb-10'"
    );
}

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Layout padding updated.");
