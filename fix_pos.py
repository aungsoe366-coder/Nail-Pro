import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. State for confirm dialog
state_old = "const [showLoyaltyPrompt, setShowLoyaltyPrompt] = useState(false);"
state_new = "const [showLoyaltyPrompt, setShowLoyaltyPrompt] = useState(false);\n  const [confirmAction, setConfirmAction] = useState<{message: string, onConfirm: () => void} | null>(null);"
content = content.replace(state_old, state_new)

# 2. Service card
old_card = """                    <button
                      key={service.id}
                      onClick={() => addToCart(service)}
                      className={`text-left bg-card p-3.5 rounded-xl border transition-all active:scale-95 group relative overflow-hidden flex flex-col justify-between min-h-[90px] ${
                        isInCart ? 'border-primary ring-1 ring-primary/20 shadow-md shadow-primary/10' : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      {isInCart && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm">
                          <ShoppingCart size={10} />
                        </div>
                      )}
                      <div className="space-y-0.5 mt-1 pr-6">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-80 truncate">{service.category}</p>
                        <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">{service.name}</h3>
                      </div>
                      <p className="text-sm font-black text-foreground mt-2">{service.price.toLocaleString()} Ks</p>
                    </button>"""

new_card = """                    <button
                      key={service.id}
                      onClick={() => addToCart(service)}
                      className={`text-left bg-card p-2.5 rounded-xl border transition-all active:scale-95 group relative overflow-hidden flex flex-col justify-between min-h-[70px] ${
                        isInCart ? 'border-primary ring-1 ring-primary/20 shadow-md shadow-primary/10' : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      {isInCart && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm">
                          <ShoppingCart size={8} />
                        </div>
                      )}
                      <div className="space-y-0.5 pr-4">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest opacity-80 truncate">{service.category}</p>
                        <h3 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">{service.name}</h3>
                      </div>
                      <p className="text-[11px] font-black text-foreground mt-1.5">{service.price.toLocaleString()} Ks</p>
                    </button>"""

content = content.replace(old_card, new_card)

# 3. Clear All button
old_clear = """                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to clear all items from the cart?")) {
                      setCart([]); setIsLoyaltyDiscountActive(false); setPointsToRedeem(0); setSelectedCustomerId(''); setSelectedAppointmentId(''); setCustomerSearch(''); setAppointmentSearch('');
                    }
                  }} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <Trash2 size={14} /> Clear All
                  </button>"""

new_clear = """                  <button onClick={() => {
                    setConfirmAction({
                      message: "Are you sure you want to clear all items from the cart?",
                      onConfirm: () => {
                        setCart([]); setIsLoyaltyDiscountActive(false); setPointsToRedeem(0); setSelectedCustomerId(''); setSelectedAppointmentId(''); setCustomerSearch(''); setAppointmentSearch('');
                        setConfirmAction(null);
                      }
                    });
                  }} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <Trash2 size={14} /> Clear All
                  </button>"""
content = content.replace(old_clear, new_clear)

# 4. Item Delete Button
old_delete = """                    {/* Remove */}
                    <button 
                      onClick={() => {
                        if(window.confirm("Remove this item from the cart?")) removeFromCart(index);
                      }} 
                      className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>"""

new_delete = """                    {/* Remove */}
                    <button 
                      onClick={() => {
                        setConfirmAction({
                          message: "Remove this item from the cart?",
                          onConfirm: () => {
                            removeFromCart(index);
                            setConfirmAction(null);
                          }
                        });
                      }} 
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>"""
content = content.replace(old_delete, new_delete)

# 5. Add Modal to POSPage return
old_footer = """        />
      )}
    </div>
  );
};"""

new_footer = """        />
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-foreground mb-2">Confirm Action</h3>
            <p className="text-muted-foreground text-sm font-medium mb-8">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 bg-muted text-muted-foreground font-bold py-3.5 rounded-xl hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction.onConfirm}
                className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};"""
content = content.replace(old_footer, new_footer)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
