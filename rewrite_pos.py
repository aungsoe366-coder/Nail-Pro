import sys

with open('src/AppCore.tsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if 'export const POSPage: React.FC = () => {' in line:
        start_idx = i
    if 'export const getEffectiveStaffItems = (s: any, staffName: string) => {' in line:
        end_idx = i
        break

if start_idx == -1 or end_idx == -1:
    print(f"Error: Could not find POSPage boundaries. Start: {start_idx}, End: {end_idx}")
    sys.exit(1)

new_code = """export const POSPage: React.FC = () => {
  const { profile, isAdmin, isStaff, isStaffMember, isCustomer } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [selectedStaffEmail, setSelectedStaffEmail] = useState('');
  const [payments, setPayments] = useState<{ method: 'Cash' | 'KBZPay' | 'WavePay' | 'AYA Pay' | 'CB PAY' | 'OK$'; amount: number }[]>([
    { method: 'Cash', amount: 0 }
  ]);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [showLoyaltyPrompt, setShowLoyaltyPrompt] = useState(false);
  const [isLoyaltyDiscountActive, setIsLoyaltyDiscountActive] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [pendingSaleParams, setPendingSaleParams] = useState<{sale: Omit<Sale, 'id'>, overridePayments?: typeof payments} | null>(null);
  const [loadingPOS, setLoadingPOS] = useState(true);
  const [currentStep, setCurrentStep] = useState<'services' | 'cart' | 'checkout'>('services');

  const LOYALTY_THRESHOLD = 500;
  const LOYALTY_DISCOUNT = 10; // 10%

  useEffect(() => {
    if (!isStaff) return;
    const q = query(collection(db, 'services'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoadingPOS(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
      setLoadingPOS(false);
    });
    return unsubscribe;
  }, [profile, isStaff]);

  useEffect(() => {
    if (!isStaff) return;
    const q = query(collection(db, 'categories'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));
    return unsubscribe;
  }, [profile, isStaff]);

  useEffect(() => {
    if (!isStaff) return;
    const uniqueStaff = new Map<string, UserProfile>();
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach(doc => {
        const data = doc.data() as UserProfile;
        if (data.email && (data.role === 'staff' || data.role === 'admin' || data.role === 'owner')) {
          const email = data.email.toLowerCase().trim();
          if (!uniqueStaff.has(email) || data.uid) {
            uniqueStaff.set(email, { ...data, id: doc.id });
          }
        }
      });
      const staffList = Array.from(uniqueStaff.values());
      setStaff(staffList);
      if (profile && !selectedStaffEmail) setSelectedStaffEmail(profile.email);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));
    return unsubscribe;
  }, [profile, isStaff, selectedStaffEmail]);

  useEffect(() => {
    if (!isStaff) return;
    const q = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'));
    return unsubscribe;
  }, [profile, isStaff]);

  useEffect(() => {
    if (!isStaff) return;
    const q = query(
      collection(db, 'appointments'), 
      where('status', 'in', ['pending', 'confirmed', 'completed']),
      orderBy('date', 'desc'),
      orderBy('time', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allAppts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      const filteredAppts = allAppts.filter(a => a.status !== 'completed' || !a.pointsProcessed);
      setAppointments(filteredAppts);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'appointments'));
    return unsubscribe;
  }, [profile, isStaff]);

  useEffect(() => {
    if (isCustomer) return;
    const docRef = doc(db, 'settings', 'salon');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setShopSettings(docSnap.data() as ShopSettings);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/salon'));
    return unsubscribe;
  }, [profile, isCustomer]);

  const categoryList = ['All', ...categories.map(c => c.name)];

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'All' || (s.category === selectedCategory);
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (service: Service) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      const initialDiscount = isLoyaltyDiscountActive ? LOYALTY_DISCOUNT : 0;
      if (existing) {
        return prev.map(item => item.id === service.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...service, qty: 1, disP: initialDiscount }];
    });
  };

  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    setCart(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.price * item.qty * (item.disP / 100)), 0);
  const pointsDiscount = pointsToRedeem * 10;
  const netTotal = Math.max(0, subTotal - totalDiscount - pointsDiscount);
  const pointsEarned = Math.floor(netTotal / 1000);

  useEffect(() => {
    if (payments.length === 1) {
      setPayments([{ ...payments[0], amount: netTotal }]);
    }
  }, [netTotal]);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = netTotal - totalPaid;

  const addPaymentMethod = () => {
    setPayments([...payments, { method: 'Cash', amount: Math.max(0, remainingAmount) }]);
  };

  const removePaymentMethod = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const updatePayment = (index: number, updates: Partial<{ method: any; amount: number }>) => {
    setPayments(payments.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const customerSuggestions = customerSearch.length > 0 
    ? customers.filter(c => 
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
        c.phone.includes(customerSearch)
      ).slice(0, 5)
    : [];

  const handleCheckout = (overridePayments?: typeof payments) => {
    if (cart.length === 0) return;
    for (const item of cart) {
      if (item.staffAssignments && item.staffAssignments.length > 0) {
        const sum = item.staffAssignments.reduce((acc, a) => acc + (a.qty || 0), 0);
        if (sum !== item.qty) {
          alert(`Cannot checkout. Please ensure the total staff assigned quantities match the service total quantity for ${item.name}.`);
          return;
        }
      }
    }
    let globalStaff = staff.find(s => s.email === selectedStaffEmail);
    if (!globalStaff) {
      globalStaff = staff.find(s => s.role === 'owner') || staff[0];
    }
    if (!globalStaff) return;
    
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    const now = new Date();
    const localDateStr = getLocalISODate(now);
    const finalPayments = overridePayments || payments;
    const finalTotalPaid = finalPayments.reduce((sum, p) => sum + p.amount, 0);
    
    if (finalTotalPaid !== netTotal) {
      alert(`Payment mismatch! Total paid: ${finalTotalPaid.toLocaleString()} Ks, Net Total: ${netTotal.toLocaleString()} Ks`);
      return;
    }
    
    let totalSaleCommission = 0;
    const mappedItems = cart.map(item => {
      let finalAssignments = item.staffAssignments ? [...item.staffAssignments] : [];
      let itemStaffEmail = item.staffEmail;
      let itemStaffName = item.staffName;
      if (finalAssignments.length > 0) {
        itemStaffEmail = "";
        itemStaffName = "";
      } else if (!itemStaffEmail) {
        itemStaffEmail = globalStaff.email;
        itemStaffName = globalStaff.name;
      }
      const itemStaff = staff.find(s => s.email === itemStaffEmail) || globalStaff;
      const itemSubtotal = item.price * item.qty * (1 - item.disP / 100);
      let itemCommission = 0;
      if (item.allowCommission !== false) {
        const proportion = subTotal > 0 ? (itemSubtotal / subTotal) : 0;
        const effectivePointsDiscount = pointsDiscount * proportion;
        const commissionableValue = Math.max(0, itemSubtotal - effectivePointsDiscount);
        if (finalAssignments.length > 0) {
          itemCommission = finalAssignments.reduce((sum, a, aIdx) => { 
             const s = staff.find(st => st.name === a.name);
             let aComm = 0;
             if (s) {
                const aCommValue = commissionableValue * (a.qty / item.qty);
                aComm = Math.round(aCommValue * ((s.commission || 0) / 100));
             }
             finalAssignments[aIdx] = { ...a, commission: aComm };
             return sum + aComm;
          }, 0);
        } else {
          itemCommission = Math.round(commissionableValue * ((itemStaff.commission || 0) / 100));
        }
        totalSaleCommission += itemCommission;
      }
      return {
        id: item.id,
        serviceId: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        disP: item.disP,
        staffId: itemStaffEmail,
        staffName: itemStaffName,
        staffAssignments: finalAssignments,
        commission: itemCommission
      };
    });
    
    let saleStaffNames: string[] = [];
    mappedItems.forEach(item => {
      if (item.staffAssignments && item.staffAssignments.length > 0) {
        saleStaffNames.push(...item.staffAssignments.map(a => a.name));
      } else if (item.staffName) {
        saleStaffNames.push(item.staffName);
      }
    });
    
    const uniqueSaleStaffNames = Array.from(new Set(saleStaffNames.filter(Boolean)));
    const finalSaleStaffName = uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames.join(' + ') : globalStaff.name;
    
    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: finalSaleStaffName,
      staffNames: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffNamesArray: uniqueSaleStaffNames.length > 0 ? uniqueSaleStaffNames : [globalStaff.name],
      staffEmail: globalStaff.email,
      customerName: selectedCustomer?.name || '',
      customerPhone: selectedCustomer?.phone || '',
      total: netTotal,
      payments: finalPayments,
      method: finalPayments.map(p => p.method).join(', '),
      commission: totalSaleCommission,
      pointsEarned,
      pointsRedeemed: pointsToRedeem,
      items: mappedItems
    };
    
    setPendingSaleParams({ sale, overridePayments });
    setShowPrintPreview(true);
  };

  const confirmCheckout = async (print: boolean) => {
    if (!pendingSaleParams) return;
    const { sale } = pendingSaleParams;
    try {
      await addDoc(collection(db, 'sales'), sale);
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      if (selectedCustomer) {
        const newPoints = (selectedCustomer.points || 0) + (sale.pointsEarned || 0) - (sale.pointsRedeemed || 0);
        await updateDoc(doc(db, 'customers', selectedCustomer.id), {
          points: newPoints
        });
        if (selectedCustomer.email) {
          const userDocRef = doc(db, 'users', selectedCustomer.email.toLowerCase());
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
             await updateDoc(userDocRef, { points: newPoints });
          }
        }
      }
      if (selectedAppointmentId) {
        await updateDoc(doc(db, 'appointments', selectedAppointmentId), {
          status: 'completed',
          pointsProcessed: true
        });
      }
      if (print) {
        const printText = generateReceiptHTML(sale, shopSettings);
        if (Capacitor.isNativePlatform()) {
          const htmlStr = `<html><body style='margin:0;padding:10px;'>${printText}</body></html>`;
          CapPrinter.printHtml({ name: 'Receipt', html: htmlStr }).catch(e => {
            console.error('Printer error:', e);
            alert('Failed to print: ' + String(e));
          });
        } else {
          const isAndroid = /android/i.test(navigator.userAgent);
          if (isAndroid) {
            const rawText = generateReceiptText(sale, shopSettings);
            triggerRawbtPrint(rawText);
          } else {
            window.dispatchEvent(new CustomEvent('print-html', { detail: printText }));
          }
        }
      }
      setCart([]);
      setSelectedCustomerId('');
      setSelectedAppointmentId('');
      setAppointmentSearch('');
      setPointsToRedeem(0);
      setIsLoyaltyDiscountActive(false);
      setPayments([{ method: 'Cash', amount: 0 }]);
      setShowPrintPreview(false);
      setPendingSaleParams(null);
      alert("Sale saved successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sales');
    }
  };

  const paymentMethods = [
    { id: 'Cash', label: 'Cash' },
    { id: 'KBZPay', label: 'KBZPay' },
    { id: 'WavePay', label: 'WavePay' },
    { id: 'AYA Pay', label: 'AYA Pay' },
    { id: 'CB PAY', label: 'CB PAY' },
    { id: 'OK$', label: 'OK$' },
  ];

  const invalidCartItem = cart.find(item => {
    if (item.staffAssignments && item.staffAssignments.length > 0) {
      const sum = item.staffAssignments.reduce((acc, a) => acc + (a.qty || 0), 0);
      return sum !== item.qty;
    }
    return false;
  });
  const isCartValid = !invalidCartItem;

  if (loadingPOS) {
    return (
      <div className="flex-1 flex justify-center items-center h-screen w-full bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      {/* Top Header & Step Indicator (Fixed, shrink-0) */}
      <div className="flex-shrink-0 bg-card border-b border-border/50 py-5 z-20 shadow-sm relative">
        <div className="max-w-2xl mx-auto w-full relative flex items-center justify-between px-6 sm:px-12">
          {/* Progress Track (Single Line) */}
          <div className="absolute top-1/2 left-[48px] right-[48px] sm:left-[64px] sm:right-[64px] h-[3px] bg-border/50 -translate-y-1/2 rounded-full overflow-hidden z-0">
             <div 
               className="h-full bg-primary transition-all duration-500 ease-in-out"
               style={{ 
                 width: currentStep === 'services' ? '0%' : currentStep === 'cart' ? '50%' : '100%' 
               }}
             />
          </div>

          {/* Steps */}
          {[
            { id: 'services', icon: LayoutGrid, label: 'Services' },
            { id: 'cart', icon: ShoppingCart, label: 'Cart' },
            { id: 'checkout', icon: CreditCard, label: 'Checkout' }
          ].map((step, idx) => {
            const isActive = currentStep === step.id;
            const isPast = ['services', 'cart', 'checkout'].indexOf(currentStep) > idx;
            const stateClass = isActive 
              ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/30" 
              : isPast 
                ? "bg-primary/20 text-primary border-primary/30" 
                : "bg-card text-muted-foreground border-border/50";
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id as any)}
                className="relative z-10 flex flex-col items-center gap-2 group outline-none"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stateClass}`}>
                  <step.icon size={20} className={isActive ? "animate-pulse" : ""} />
                  {step.id === 'cart' && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Middle Content Area (flex-1 overflow-y-auto) */}
      <div className="flex-1 overflow-y-auto pb-32">
        {currentStep === 'services' && (
          <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
            {/* Search and Category Filter */}
            <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50 space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-input border border-border rounded-xl pl-12 pr-10 py-3.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all font-medium"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categoryList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shrink-0 ${
                      selectedCategory === cat 
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Services */}
            {filteredServices.length === 0 ? (
              <div className="text-center p-10 bg-card rounded-2xl border border-border/50">
                <p className="text-muted-foreground font-medium">No services found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredServices.map(service => {
                  const isInCart = cart.some(c => c.id === service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => addToCart(service)}
                      className={`text-left bg-card p-5 rounded-2xl border transition-all active:scale-95 group relative overflow-hidden ${
                        isInCart ? 'border-primary ring-1 ring-primary/20 shadow-md shadow-primary/10' : 'border-border/50 hover:border-primary/50 hover:shadow-lg'
                      }`}
                    >
                      {isInCart && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm">
                          <ShoppingCart size={12} />
                        </div>
                      )}
                      <div className="space-y-1 mt-2">
                        <p className="text-xs font-black text-primary uppercase tracking-widest opacity-80 truncate">{service.category}</p>
                        <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{service.name}</h3>
                        <p className="text-sm font-black text-muted-foreground pt-1">{service.price.toLocaleString()} Ks</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentStep === 'cart' && (
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
            {cart.length === 0 ? (
              <div className="text-center p-12 bg-card rounded-2xl border border-border/50 flex flex-col items-center gap-4 shadow-sm">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <ShoppingCart size={32} />
                </div>
                <h3 className="text-lg font-black text-foreground">Your cart is empty</h3>
                <p className="text-muted-foreground">Select services to begin your order.</p>
                <button onClick={() => setCurrentStep('services')} className="mt-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all">
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                  <h3 className="font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                    <ShoppingCart size={18} className="text-primary" />
                    Order Items ({cart.length})
                  </h3>
                  <button onClick={() => {
                    setCart([]); setIsLoyaltyDiscountActive(false); setPointsToRedeem(0); setSelectedCustomerId(''); setSelectedAppointmentId(''); setCustomerSearch(''); setAppointmentSearch('');
                  }} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <Trash2 size={14} /> Clear All
                  </button>
                </div>

                {cart.map((item, index) => (
                  <div key={item.id + index} className="bg-card p-4 sm:p-6 rounded-2xl border border-border/50 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-black text-foreground text-lg">{item.name}</h4>
                        <p className="text-primary font-bold">{item.price.toLocaleString()} Ks</p>
                      </div>
                      
                      <div className="flex items-center gap-4 self-start sm:self-auto">
                        {/* Quantity */}
                        <div className="flex items-center bg-muted rounded-xl p-1">
                          <button onClick={() => updateCartItem(index, { qty: Math.max(1, item.qty - 1) })} className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-lg transition-colors text-foreground">
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-bold text-foreground">{item.qty}</span>
                          <button onClick={() => updateCartItem(index, { qty: item.qty + 1 })} className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-lg transition-colors text-foreground">
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        {/* Remove */}
                        <button onClick={() => removeFromCart(index)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Discount %</label>
                        <div className="relative">
                          <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.disP}
                            onChange={(e) => updateCartItem(index, { disP: Number(e.target.value) })}
                            className="w-full bg-input border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                      
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Assign Staff</label>
                         <div className="relative">
                            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <select 
                               value={item.staffName || ''}
                               onChange={(e) => updateCartItem(index, { staffName: e.target.value, staffEmail: staff.find(s => s.name === e.target.value)?.email || '' })}
                               className="w-full bg-input border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all appearance-none"
                            >
                               <option value="">Any Staff (Global)</option>
                               {staff.map(s => (
                                 <option key={s.id} value={s.name}>{s.name}</option>
                               ))}
                            </select>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 'checkout' && cart.length > 0 && (
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
             {/* Order Summary */}
             <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm space-y-4">
                <h3 className="font-black text-foreground uppercase tracking-widest mb-4">Order Summary</h3>
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{subTotal.toLocaleString()} Ks</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-red-500">
                    <span>Discount</span>
                    <span>-{totalDiscount.toLocaleString()} Ks</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-primary">
                    <span>Points Redeemed</span>
                    <span>-{pointsDiscount.toLocaleString()} Ks</span>
                  </div>
                )}
                <div className="h-px w-full bg-border/50 my-2" />
                <div className="flex justify-between items-center text-xl sm:text-2xl font-black text-foreground">
                  <span>Net Total</span>
                  <span className="text-primary">{netTotal.toLocaleString()} Ks</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Global Options */}
                <div className="space-y-6">
                   <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm space-y-4">
                      <h3 className="font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                         <User size={16} className="text-primary" /> Global Settings
                      </h3>
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Global Staff Assignment</label>
                         <select 
                             value={selectedStaffEmail}
                             onChange={(e) => setSelectedStaffEmail(e.target.value)}
                             className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                         >
                             {staff.map(s => (
                               <option key={s.id} value={s.email}>{s.name}</option>
                             ))}
                         </select>
                      </div>

                      <div className="pt-2 border-t border-border/50">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Customer Search</label>
                         <div className="relative">
                            <input 
                               type="text" 
                               placeholder="Search customer by name or phone..."
                               value={customerSearch}
                               onChange={(e) => setCustomerSearch(e.target.value)}
                               className="w-full bg-input border border-border rounded-xl pl-4 pr-10 py-3 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                            />
                            {customerSearch && (
                               <button onClick={() => setCustomerSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 transition-colors">
                                 <X size={16} />
                               </button>
                            )}
                         </div>
                         {customerSuggestions.length > 0 && (
                            <div className="absolute z-30 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden max-w-sm">
                               {customerSuggestions.map(c => (
                                  <button
                                     key={c.id}
                                     onClick={() => { setSelectedCustomerId(c.id); setCustomerSearch(''); }}
                                     className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                                  >
                                     <div className="font-bold text-foreground">{c.name}</div>
                                     <div className="text-xs text-muted-foreground">{c.phone}</div>
                                  </button>
                               ))}
                            </div>
                         )}

                         {selectedCustomerId && (
                            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-xl flex justify-between items-center">
                               <div>
                                  <div className="text-xs font-black text-primary uppercase tracking-widest">Selected Customer</div>
                                  <div className="font-bold text-foreground">{customers.find(c => c.id === selectedCustomerId)?.name}</div>
                               </div>
                               <button onClick={() => { setSelectedCustomerId(''); setPointsToRedeem(0); setIsLoyaltyDiscountActive(false); }} className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
                                 <X size={16} />
                               </button>
                            </div>
                         )}
                      </div>
                      
                      {selectedCustomerId && (
                         <div className="pt-2 border-t border-border/50">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 flex justify-between">
                               <span>Redeem Points</span>
                               <span className="text-primary font-bold">Avail: {customers.find(c => c.id === selectedCustomerId)?.points || 0}</span>
                            </label>
                            <div className="flex items-center gap-3">
                               <input 
                                  type="number"
                                  placeholder="Redeem points..."
                                  value={pointsToRedeem || ''}
                                  onChange={(e) => {
                                    const maxP = customers.find(c => c.id === selectedCustomerId)?.points || 0;
                                    setPointsToRedeem(Math.min(Math.max(0, Number(e.target.value)), maxP));
                                  }}
                                  className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                               />
                               <div className="bg-red-500 text-foreground px-4 py-3 rounded-xl text-xs font-black shadow-lg shadow-red-500/20 whitespace-nowrap">
                                  -{ (pointsToRedeem * 10).toLocaleString() } Ks
                               </div>
                            </div>
                         </div>
                      )}
                   </div>
                </div>

                {/* Payments */}
                <div className="space-y-6">
                   <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm space-y-4">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                            <DollarSign size={16} className="text-primary" /> Payments
                         </h3>
                         {remainingAmount > 0 && (
                            <button onClick={addPaymentMethod} className="text-xs text-primary font-bold uppercase tracking-widest hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                               <Plus size={14} /> Split
                            </button>
                         )}
                      </div>
                      
                      <div className="space-y-3">
                         {payments.map((payment, index) => (
                            <div key={index} className="flex gap-3 items-center">
                               <select
                                  value={payment.method}
                                  onChange={(e) => updatePayment(index, { method: e.target.value as any })}
                                  className="flex-1 bg-input border border-border rounded-xl px-3 py-3 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                               >
                                  {paymentMethods.map(pm => (
                                     <option key={pm.id} value={pm.id}>{pm.label}</option>
                                  ))}
                               </select>
                               <input
                                  type="number"
                                  value={payment.amount === 0 ? '' : payment.amount}
                                  onChange={(e) => updatePayment(index, { amount: Number(e.target.value) })}
                                  className="w-32 bg-input border border-border rounded-xl px-3 py-3 text-sm font-bold text-foreground focus:border-primary outline-none transition-all text-right"
                               />
                               {payments.length > 1 && (
                                  <button onClick={() => removePaymentMethod(index)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0">
                                     <Trash2 size={16} />
                                  </button>
                               )}
                            </div>
                         ))}
                      </div>

                      <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                         <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Remaining</span>
                         <span className={`text-lg font-black ${remainingAmount > 0 ? 'text-red-500' : remainingAmount < 0 ? 'text-amber-500' : 'text-green-500'}`}>
                            {remainingAmount.toLocaleString()} Ks
                         </span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Bottom Footer (Fixed, shrink-0) */}
      <div className="flex-shrink-0 bg-background/95 backdrop-blur-md border-t border-border/50 p-4 sm:p-6 z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center gap-4">
           {/* Left Info / Back Buttons */}
           <div className="hidden sm:block">
              {currentStep !== 'services' && (
                 <button onClick={() => setCurrentStep(currentStep === 'checkout' ? 'cart' : 'services')} className="text-muted-foreground font-bold hover:text-foreground transition-colors uppercase tracking-widest text-xs px-4 py-2 border border-transparent hover:border-border/50 rounded-lg">
                    Back
                 </button>
              )}
           </div>

           {/* Action Buttons */}
           <div className="flex-1 sm:flex-none flex justify-end">
             {currentStep === 'services' && (
               <button 
                  onClick={() => setCurrentStep('cart')} 
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group"
               >
                 PROCEED TO CART 
                 {cart.length > 0 && (
                    <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs group-hover:bg-white/30 transition-colors">
                       {cart.length}
                    </div>
                 )}
                 <ChevronRight size={18} />
               </button>
             )}
             
             {currentStep === 'cart' && (
               <button 
                  onClick={() => setCurrentStep('checkout')} 
                  disabled={cart.length === 0}
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
               >
                 CHECKOUT <ChevronRight size={18} />
               </button>
             )}

             {currentStep === 'checkout' && (
               <button 
                  onClick={() => handleCheckout()} 
                  disabled={cart.length === 0 || remainingAmount !== 0 || !isCartValid}
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
               >
                 COMPLETE SALE <ChevronRight size={18} />
               </button>
             )}
           </div>
        </div>
      </div>
      
      {showPrintPreview && pendingSaleParams && (
        <PrintView
          sale={pendingSaleParams.sale}
          shopSettings={shopSettings}
          onClose={() => {
            setShowPrintPreview(false);
            setPendingSaleParams(null);
          }}
          text={generateReceiptHTML(pendingSaleParams.sale, shopSettings)}
          onPrint={() => confirmCheckout(true)}
          onSkipPrint={() => confirmCheckout(false)}
          title="Checkout & Print Preview"
        />
      )}
    </div>
  );
};\n"""

lines[start_idx:end_idx] = [new_code]

with open('src/AppCore.tsx', 'w') as f:
    f.writelines(lines)

print("POSPage replaced successfully.")
