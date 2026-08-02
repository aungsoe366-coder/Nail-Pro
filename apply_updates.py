import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Update handleCheckout & Add validation helpers
old_checkout_start = """  const handleCheckout = (overridePayments?: typeof payments) => {
    if (cart.length === 0) return;
    for (const item of cart) {
      if (item.staffAssignments && item.staffAssignments.length > 0) {
        const sum = item.staffAssignments.reduce((acc, a) => acc + (a.qty || 0), 0);
        if (sum !== item.qty) {
          alert(`Cannot checkout. Please ensure the total staff assigned quantities match the service total quantity for ${item.name}.`);
          return;
        }
      }
    }"""

new_checkout_start = """  const validateCartItem = (item: CartItem) => {
    const errors: string[] = [];
    if (item.staffAssignments && item.staffAssignments.length > 0) {
      // Logic 2: Staff selection is mandatory for every split staff slot
      const hasUnassignedStaff = item.staffAssignments.some(a => !a.name || a.name.trim() === '');
      if (hasUnassignedStaff) {
        errors.push("You need to choose a staff member for all split staff rows.");
      }
      // Logic 1: Sum of split quantities must match service total quantity
      const sum = item.staffAssignments.reduce((acc, a) => acc + (Number(a.qty) || 0), 0);
      if (sum !== item.qty) {
        errors.push(`Staff assigned quantities (${sum}) do not match service total quantity (${item.qty}).`);
      }
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const getCartValidationErrors = (cartItems: CartItem[]): string[] => {
    const allErrors: string[] = [];
    cartItems.forEach((item, idx) => {
      const { errors } = validateCartItem(item);
      errors.forEach(err => {
        allErrors.push(`"${item.name}" (Item ${idx + 1}): ${err}`);
      });
    });
    return allErrors;
  };

  const handleClearAllCart = () => {
    if (cart.length === 0) return;
    setConfirmAction({
      message: "Are you sure you want to clear all items from the cart?",
      onConfirm: () => {
        setCart([]);
        setIsLoyaltyDiscountActive(false);
        setPointsToRedeem(0);
        setSelectedCustomerId('');
        setSelectedAppointmentId('');
        setCustomerSearch('');
        setAppointmentSearch('');
        setSelectedStaffEmail('');
        setPayments([{ method: 'Cash', amount: 0 }]);
        setConfirmAction(null);
      }
    });
  };

  const handleProceedToCheckout = () => {
    const cartValidationErrs = getCartValidationErrors(cart);
    if (cartValidationErrs.length > 0) {
      alert("Cannot proceed to checkout. Please fix the following errors in your cart:\\n\\n• " + cartValidationErrs.join("\\n• "));
      return;
    }
    setCurrentStep('checkout');
  };

  const handleCheckout = (overridePayments?: typeof payments) => {
    if (cart.length === 0) return;
    const cartValidationErrs = getCartValidationErrors(cart);
    if (cartValidationErrs.length > 0) {
      alert("Cannot complete sale. Please fix the following errors in your cart:\\n\\n• " + cartValidationErrs.join("\\n• "));
      return;
    }"""

content = content.replace(old_checkout_start, new_checkout_start)

# 2. Update invalidCartItem definition
old_invalid_cart = """  const invalidCartItem = cart.find(item => {
    if (item.staffAssignments && item.staffAssignments.length > 0) {
      const sum = item.staffAssignments.reduce((acc, a) => acc + (a.qty || 0), 0);
      return sum !== item.qty;
    }
    return false;
  });
  const isCartValid = !invalidCartItem;"""

new_invalid_cart = """  const invalidCartItem = cart.find(item => !validateCartItem(item).isValid);
  const isCartValid = cart.length > 0 && !invalidCartItem;"""

content = content.replace(old_invalid_cart, new_invalid_cart)

# 3. Update Clear All button
old_clear_all_button = """                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to clear all items from the cart?")) {
                      setCart([]); setIsLoyaltyDiscountActive(false); setPointsToRedeem(0); setSelectedCustomerId(''); setSelectedAppointmentId(''); setCustomerSearch(''); setAppointmentSearch('');
                    }
                  }} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <Trash2 size={14} /> Clear All
                  </button>"""

new_clear_all_button = """                  <button 
                    type="button"
                    onClick={handleClearAllCart} 
                    disabled={cart.length === 0}
                    className="text-xs text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <Trash2 size={14} /> Clear All
                  </button>"""

content = content.replace(old_clear_all_button, new_clear_all_button)

# 4. Update Checkout button in cart step
old_checkout_step_btn = """             {currentStep === 'cart' && (
               <button 
                  onClick={() => setCurrentStep('checkout')} 
                  disabled={cart.length === 0}
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
               >
                 CHECKOUT <ChevronRight size={18} />
               </button>
             )}"""

new_checkout_step_btn = """             {currentStep === 'cart' && (
               <button 
                  onClick={handleProceedToCheckout} 
                  disabled={cart.length === 0 || !isCartValid}
                  className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
               >
                 CHECKOUT <ChevronRight size={18} />
               </button>
             )}"""

content = content.replace(old_checkout_step_btn, new_checkout_step_btn)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

print("Applied updates 1-4 successfully.")
