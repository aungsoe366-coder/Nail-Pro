import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_service_card = """                    <button
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

new_service_card = """                    <button
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

content = content.replace(old_service_card, new_service_card)

old_clear_all = """                  <button onClick={() => {
                    setConfirmAction({
                      message: "Are you sure you want to clear all items from the cart?",
                      onConfirm: () => {
                        setCart([]); setIsLoyaltyDiscountActive(false); setPointsToRedeem(0); setSelectedCustomerId(''); setSelectedAppointmentId(''); setCustomerSearch(''); setAppointmentSearch('');
                        setConfirmAction(null);
                      }
                    });
                  }} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">"""

new_clear_all = """                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to clear all items from the cart?")) {
                      setCart([]); setIsLoyaltyDiscountActive(false); setPointsToRedeem(0); setSelectedCustomerId(''); setSelectedAppointmentId(''); setCustomerSearch(''); setAppointmentSearch('');
                    }
                  }} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">"""

content = content.replace(old_clear_all, new_clear_all)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
