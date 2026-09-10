const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldNavStart = code.indexOf('const renderCustomerBottomNav = () => {');
const navEndStr = "  const isPos = location.pathname === '/pos';";
const oldNavEnd = code.indexOf(navEndStr);

const newNav = `const renderCustomerBottomNav = () => {
    if (!isCustomer || isPos) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-[9999] bg-white/95 [.midnight_&]:bg-slate-900/95 backdrop-blur-md border-t border-amber-200/40 [.midnight_&]:border-slate-800 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-safe">
        <div className="flex items-center justify-around p-2">
          <button 
             onClick={() => navigate('/')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/' ? "text-amber-600 font-semibold" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             {location.pathname === '/' && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <Home size={20} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
             <span className="text-[10px]">Home</span>
          </button>
          <button 
             onClick={() => navigate('/gallery')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/gallery' && !(location.state as any)?.tab ? "text-amber-600 font-semibold" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             {location.pathname === '/gallery' && !(location.state as any)?.tab && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <Store size={20} strokeWidth={location.pathname === '/gallery' && !(location.state as any)?.tab ? 2.5 : 2} />
             <span className="text-[10px]">Shop</span>
          </button>
          <button 
             onClick={() => navigate('/appointments')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/appointments' ? "text-amber-600 font-semibold" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             {location.pathname === '/appointments' && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <Calendar size={20} strokeWidth={location.pathname === '/appointments' ? 2.5 : 2} />
             <span className="text-[10px]">Booking</span>
          </button>
          <button 
             onClick={() => navigate('/gallery', { state: { tab: 'orders' } })} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' ? "text-amber-600 font-semibold" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             {location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <PackageOpen size={20} strokeWidth={location.pathname === '/gallery' && (location.state as any)?.tab === 'orders' ? 2.5 : 2} />
             <span className="text-[10px]">Orders</span>
          </button>
          <button 
             onClick={() => navigate('/settings')} 
             className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-300 relative", location.pathname === '/settings' ? "text-amber-600 font-semibold" : "text-slate-400 hover:text-slate-600 [.midnight_&]:hover:text-slate-300")}
          >
             {location.pathname === '/settings' && <div className="absolute -top-2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
             <User size={20} strokeWidth={location.pathname === '/settings' ? 2.5 : 2} />
             <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </div>
    );
};

`;

if (oldNavStart !== -1 && oldNavEnd !== -1) {
    code = code.substring(0, oldNavStart) + newNav + code.substring(oldNavEnd);
    
    code = code.replace(
       "'min-h-screen pb-10'",
       "isCustomer ? 'min-h-screen pb-24' : 'min-h-screen pb-10'"
    );

    if (!code.includes('{renderCustomerBottomNav()}')) {
        const motionEndIndex = code.indexOf('</motion.div>\n  );\n};');
        if (motionEndIndex !== -1) {
            code = code.substring(0, motionEndIndex) + ' {renderCustomerBottomNav()}\n ' + code.substring(motionEndIndex);
        }
    }

    if (!code.includes('User } from \'lucide-react\'')) {
        code = code.replace(
           "} from 'lucide-react';",
           ", User } from 'lucide-react';"
        );
    }
    
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Updated Layout for Customer Bottom Nav!");
} else {
    console.log("oldNavStart:", oldNavStart, "oldNavEnd:", oldNavEnd);
}
