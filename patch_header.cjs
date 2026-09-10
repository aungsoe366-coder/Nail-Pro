const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetHeader = `const Header: React.FC<{ onMenuClick: () => void, className?: string }> = ({ onMenuClick, className }) => {
 const navigate = useNavigate();

 return (
 <header className={cn("sticky top-0 z-[1000] flex justify-between items-center px-4 md:px-6 py-4 bg-card  border-b border-border transition-all duration-500", className)}>
 <div className="flex items-center gap-3">
 <motion.button whileTap={{ scale: 0.97 }} 
 onClick={onMenuClick} 
 className="text-primary hover:scale-110 active:scale-90 transition-all p-2 bg-primary/20 rounded-xl border-primary/10"
 >
 <Menu size={20} />
 </motion.button>
 <div 
 onClick={() => navigate('/')} 
 className="flex flex-col cursor-pointer group"
 >
 <span className="text-xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none">NAIL PRO</span>
 <span className="text-[8px] font-black text-primary tracking-[0.4em] mt-0.5 opacity-80 uppercase">Luxury Salon</span>
 </div>
 </div>
 <div className="flex items-center gap-4">
 </div>
 </header>
 );
};`;

const newHeader = `const Header: React.FC<{ onMenuClick: () => void, className?: string }> = ({ onMenuClick, className }) => {
 const navigate = useNavigate();
 const { isCustomer, profile } = useAuth();

 return (
 <header className={cn("sticky top-0 z-[1000] flex justify-between items-center px-4 md:px-6 py-4 bg-card  border-b border-border transition-all duration-500", className)}>
 <div className="flex items-center gap-3">
 {!isCustomer && (
   <motion.button whileTap={{ scale: 0.97 }} 
   onClick={onMenuClick} 
   className="text-primary hover:scale-110 active:scale-90 transition-all p-2 bg-primary/20 rounded-xl border-primary/10"
   >
   <Menu size={20} />
   </motion.button>
 )}
 <div 
 onClick={() => navigate('/')} 
 className="flex flex-col cursor-pointer group"
 >
 <span className="text-xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none">NAIL PRO</span>
 <span className="text-[8px] font-black text-primary tracking-[0.4em] mt-0.5 opacity-80 uppercase">Luxury Salon</span>
 </div>
 </div>
 <div className="flex items-center gap-4">
    {isCustomer && profile && (
       <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-200 dark:border-amber-700/50 flex items-center justify-center overflow-hidden cursor-pointer"
       >
          {profile.photoURL ? (
             <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
             <span className="text-amber-700 dark:text-amber-400 font-bold text-lg">{profile.name?.charAt(0).toUpperCase() || 'U'}</span>
          )}
       </motion.button>
    )}
 </div>
 </header>
 );
};`;

let codeClean = code.replace(/\s+/g, ' ');
let targetClean = targetHeader.replace(/\s+/g, ' ');

if (codeClean.includes(targetClean)) {
    code = code.replace(targetHeader, newHeader);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched Header!");
} else {
    console.log("Target header not found in exact format.");
}
