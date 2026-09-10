const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetStr = `export const CustomerDashboardPage: React.FC = () => {
 const { profile } = useAuth();
 const navigate = useNavigate();

 return (
 <motion.div
 className="w-full max-w-4xl mx-auto px-3 py-4 md:p-6 space-y-3"
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.18, ease: "easeInOut" }}
 style={{ willChange: "transform, opacity" }}
 >
 <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 border border-amber-200 p-4 rounded-2xl relative overflow-hidden [.midnight_&]:from-amber-900/30 [.midnight_&]:via-amber-800/20 [.midnight_&]:to-orange-900/30 [.midnight_&]:border-amber-700/50">
 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 [.midnight_&]:bg-amber-500/10 rounded-full blur-3xl"></div>
 <div className="relative z-10 space-y-2">
 <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37]">Welcome back, {profile?.name || 'Beautiful'}!</h2>
 <p className="text-amber-800/80 [.midnight_&]:text-amber-200/80 font-medium">Ready for your next salon experience?</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="bg-card border border-border p-4 rounded-2xl flex flex-col items-center text-center space-y-3">
 <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
 <Calendar size={32} />
 </div>
 <div className="space-y-1">
 <h3 className="font-bold text-lg">Book an Appointment</h3>
 <p className="text-sm text-muted-foreground">Schedule your next visit easily with our online booking system.</p>
 </div>
 <motion.button
 whileTap={{ scale: 0.97 }} 
 onClick={() => navigate('/appointments')}
 className="mt-4 px-4 md:px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
 >
 Book Now
 </motion.button>
 </div>

 <div className="bg-card border border-border p-4 rounded-2xl flex flex-col items-center text-center space-y-3">
 <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
 <Star size={32} />
 </div>
 <div className="space-y-1">
 <h3 className="font-bold text-lg">Loyalty Points</h3>
 <p className="text-sm text-muted-foreground">You currently have <strong className="text-green-500 text-xl">{profile?.points || 0}</strong> points.</p>
 </div>
 </div>
 </div>
 </motion.div>
 );
};`;

const newStr = `export const CustomerDashboardPage: React.FC = () => {
 const { user, profile } = useAuth();
 const navigate = useNavigate();
 
 const [upcomingAppt, setUpcomingAppt] = useState<any>(null);
 const [activeOrder, setActiveOrder] = useState<any>(null);

 useEffect(() => {
   if (!user) return;
   
   // Fetch Upcoming Appointment
   let apptConditions = [];
   if (profile?.email) apptConditions.push(where('customerEmail', '==', profile.email));
   if (profile?.email) apptConditions.push(where('creatorEmail', '==', profile.email));
   if (profile?.phone) apptConditions.push(where('customerPhone', '==', profile.phone));
   
   const fetchTrackers = async () => {
     try {
       // Since OR queries can be complex in Firestore, we'll fetch recently modified or just do simple fetch if possible
       // Let's keep it simple: fetch all for user's email/phone and find active client-side (it's safe for a single user's data scale)
       const apptQuery = query(collection(db, 'appointments'), where('status', 'in', ['pending', 'confirmed']));
       const unsubAppt = onSnapshot(apptQuery, (snap) => {
         const appts = snap.docs.map(doc => ({id: doc.id, ...doc.data()}))
           .filter(a => a.customerEmail === profile?.email || a.creatorEmail === profile?.email || (profile?.phone && a.customerPhone === profile?.phone));
         // sort by date asc
         appts.sort((a,b) => (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time));
         setUpcomingAppt(appts.length > 0 ? appts[0] : null);
       });
       
       // Fetch Active Order
       const orderQuery = query(collection(db, 'orders'), where('customerId', '==', user.uid));
       const unsubOrder = onSnapshot(orderQuery, (snap) => {
         const orders = snap.docs.map(doc => ({id: doc.id, ...doc.data()}))
           .filter(o => ['Pending', 'Confirmed', 'In Production', 'Ready for Delivery'].includes(o.status));
         orders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
         setActiveOrder(orders.length > 0 ? orders[0] : null);
       });
       
       return () => { unsubAppt(); unsubOrder(); };
     } catch (e) {
       console.error("Error fetching tracker data", e);
     }
   };
   
   fetchTrackers();
 }, [user, profile]);

 return (
 <motion.div
 className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-6"
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.18, ease: "easeInOut" }}
 style={{ willChange: "transform, opacity" }}
 >
 {/* 1. Welcome Banner */}
 <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 border border-amber-200 p-6 rounded-2xl relative overflow-hidden [.midnight_&]:from-amber-900/30 [.midnight_&]:via-amber-800/20 [.midnight_&]:to-orange-900/30 [.midnight_&]:border-amber-700/50">
   <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 [.midnight_&]:bg-amber-500/10 rounded-full blur-3xl"></div>
   <div className="relative z-10 space-y-2">
     <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 [.midnight_&]:text-[#D4AF37]">Welcome back, {profile?.name || 'Beautiful'}!</h2>
     <p className="text-amber-800/80 [.midnight_&]:text-amber-200/80 font-medium">Ready for your next salon experience?</p>
   </div>
 </div>

 {/* 2. Loyalty Points Card */}
 <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm">
   <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
        <Star size={24} className="fill-amber-500 text-amber-500" />
      </div>
      <div>
        <h3 className="font-bold text-base text-foreground">Loyalty Points</h3>
        <p className="text-xs text-muted-foreground">Keep earning points for rewards!</p>
      </div>
   </div>
   <div className="text-right">
      <p className="text-2xl font-black text-amber-500">{profile?.points || 0}</p>
      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Pts</p>
   </div>
 </div>

 {/* 3. Quick Action Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   {/* Card A */}
   <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow group">
     <div className="flex items-start gap-3">
       <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
         <Calendar size={20} />
       </div>
       <div>
         <h3 className="font-bold text-base text-foreground">Book an Appointment</h3>
         <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Schedule your next salon visit easily with our online booking system.</p>
       </div>
     </div>
     <button
       onClick={() => navigate('/appointments')}
       className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl group-hover:brightness-110 transition-all shadow-sm"
     >
       Book Now
     </button>
   </div>

   {/* Card B */}
   <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow group">
     <div className="flex items-start gap-3">
       <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center text-pink-500 shrink-0">
         <ShoppingBag size={20} />
       </div>
       <div>
         <h3 className="font-bold text-base text-foreground">Nail Gallery & Shop</h3>
         <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Browse and purchase our exclusive collection of custom press-on nails.</p>
       </div>
     </div>
     <button
       onClick={() => navigate('/shop')}
       className="w-full py-2.5 bg-pink-500 text-white text-sm font-bold rounded-xl group-hover:brightness-110 transition-all shadow-sm"
     >
       Explore Shop
     </button>
   </div>
 </div>

 {/* 4. Active Status Tracker Widget */}
 {(upcomingAppt || activeOrder) && (
   <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-3">Active Status</h3>
      <div className="space-y-3">
        {upcomingAppt && (
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                   <Clock size={16} />
                </div>
                <div>
                   <p className="text-xs font-bold text-foreground">Upcoming Appointment</p>
                   <p className="text-[10px] text-muted-foreground">{upcomingAppt.date} at {upcomingAppt.time} • {upcomingAppt.serviceName}</p>
                </div>
             </div>
             <div className="px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
               {upcomingAppt.status}
             </div>
          </div>
        )}
        
        {activeOrder && (
          <div className="flex items-center justify-between p-3 bg-pink-500/5 rounded-xl border border-pink-500/20">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 shrink-0">
                   <PackageOpen size={16} />
                </div>
                <div>
                   <p className="text-xs font-bold text-foreground">Active Order</p>
                   <p className="text-[10px] text-muted-foreground">Order ID: {activeOrder.id.slice(0,6)} • {activeOrder.items.length} item(s)</p>
                </div>
             </div>
             <div className="px-2 py-1 rounded bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider">
               {activeOrder.status}
             </div>
          </div>
        )}
      </div>
   </div>
 )}
 </motion.div>
 );
};`;

// replace multiple spaces with single to handle any indentation mismatches in target
let codeClean = code.replace(/\s+/g, ' ');
let targetClean = targetStr.replace(/\s+/g, ' ');

if(codeClean.includes(targetClean)) {
    // Perform exact replacement using index
    const startIndex = codeClean.indexOf(targetClean);
    
    // We can't easily replace on original string with normalized spaces.
    // Let's use a simpler string matching strategy or regex.
}

// Just try direct replace first, if it fails, I'll parse it.
if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched Customer Dashboard directly!");
} else {
  // Let's do string replacement from export const CustomerDashboardPage: React.FC = () => { to };
  const s = code.indexOf('export const CustomerDashboardPage: React.FC = () => {');
  const e = code.indexOf('export const DashboardPage: React.FC = () => {');
  if (s !== -1 && e !== -1) {
    code = code.substring(0, s) + newStr + "\n\n" + code.substring(e);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched Customer Dashboard via index!");
  } else {
    console.log("Target not found at all");
  }
}

