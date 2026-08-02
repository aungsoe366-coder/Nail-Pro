import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Replace Order Summary block
old_order_summary = """             {/* Order Summary */}
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
             </div>"""

new_order_summary = """             {/* Order Summary */}
             <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <h3 className="font-black text-foreground uppercase tracking-widest text-sm sm:text-base flex items-center gap-2">
                     <Receipt size={18} className="text-primary" /> Order Summary
                  </h3>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                    {cart.reduce((sum, item) => sum + item.qty, 0)} {cart.reduce((sum, item) => sum + item.qty, 0) === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Cart Items Detailed Breakdown */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/30 gap-2">
                    <div className="col-span-5 sm:col-span-6">Item (Dis%)</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-3 sm:col-span-2 text-right">Amount</div>
                  </div>
                  <div className="divide-y divide-border/20 max-h-60 overflow-y-auto pr-1 space-y-0.5">
                    {cart.map((item, idx) => {
                      const lineAmount = Math.round(item.price * item.qty * (1 - (item.disP || 0) / 100));
                      return (
                        <div key={idx} className="grid grid-cols-12 text-xs items-center py-2 gap-2">
                          <div className="col-span-5 sm:col-span-6 min-w-0 pr-1">
                            <div className="font-bold text-foreground truncate">{item.name}</div>
                            {item.disP > 0 && (
                              <span className="inline-block text-[10px] font-extrabold text-red-500 bg-red-500/10 px-1.5 py-0.2 rounded mt-0.5">
                                Dis: {item.disP}%
                              </span>
                            )}
                            {item.staffAssignments && item.staffAssignments.length > 0 ? (
                              <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                                Staff: {item.staffAssignments.map(a => `${a.name || 'Staff'} (${a.qty})`).join(', ')}
                              </div>
                            ) : item.staffName ? (
                              <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                                Staff: {item.staffName}
                              </div>
                            ) : null}
                          </div>
                          <div className="col-span-2 text-center text-muted-foreground font-semibold">{item.qty}</div>
                          <div className="col-span-2 text-right text-muted-foreground font-semibold">{item.price.toLocaleString()} Ks</div>
                          <div className="col-span-3 sm:col-span-2 text-right font-extrabold text-foreground">{lineAmount.toLocaleString()} Ks</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px w-full bg-border/50 my-2" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{subTotal.toLocaleString()} Ks</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-red-500">
                      <span>Item Discounts</span>
                      <span>-{totalDiscount.toLocaleString()} Ks</span>
                    </div>
                  )}
                  {pointsDiscount > 0 && (
                    <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-primary">
                      <span>Points Redeemed</span>
                      <span>-{pointsDiscount.toLocaleString()} Ks</span>
                    </div>
                  )}
                  <div className="h-px w-full bg-border/50 my-2" />
                  <div className="flex justify-between items-center text-lg sm:text-2xl font-black text-foreground">
                    <span>Net Total</span>
                    <span className="text-primary">{netTotal.toLocaleString()} Ks</span>
                  </div>
                </div>
             </div>"""

if old_order_summary in content:
    content = content.replace(old_order_summary, new_order_summary)
    print("Replaced Order Summary successfully.")
else:
    print("WARNING: old_order_summary not found!")

# 2. Replace Payments block
old_payments = """                {/* Payments */}
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
                </div>"""

new_payments = """                {/* Payments & Split Payment */}
                <div className="space-y-6">
                   <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border/50 shadow-sm space-y-4">
                      <div className="flex justify-between items-center mb-1">
                         <h3 className="font-black text-foreground uppercase tracking-widest flex items-center gap-2 text-sm sm:text-base">
                            <DollarSign size={18} className="text-primary" /> Split Payments
                         </h3>
                         <button 
                           type="button"
                           onClick={addPaymentMethod} 
                           className="text-xs text-primary font-extrabold uppercase tracking-widest bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                         >
                            <Plus size={14} /> Add Payment Method
                         </button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                         Split total across payment options (Cash, KBZPay, WavePay, AYA Pay, etc.).
                      </p>

                      <div className="space-y-3 pt-1">
                         {payments.map((payment, index) => (
                            <div key={index} className="flex gap-2.5 items-center bg-muted/30 p-2.5 rounded-xl border border-border/40">
                               <div className="flex-1 min-w-0">
                                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Method {index + 1}</label>
                                  <select
                                     value={payment.method}
                                     onChange={(e) => updatePayment(index, { method: e.target.value as any })}
                                     className="w-full bg-input border border-border rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:border-primary outline-none transition-all appearance-none"
                                  >
                                     {paymentMethods.map(pm => (
                                        <option key={pm.id} value={pm.id}>{pm.label}</option>
                                     ))}
                                  </select>
                               </div>

                               <div className="w-32 sm:w-36">
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Amount</label>
                                    {remainingAmount > 0 && payments.length > 1 && (
                                      <button 
                                        type="button"
                                        onClick={() => updatePayment(index, { amount: payment.amount + remainingAmount })}
                                        className="text-primary hover:underline font-bold text-[9px] lowercase cursor-pointer"
                                      >
                                        +fill
                                      </button>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <input
                                       type="number"
                                       value={payment.amount === 0 ? '' : payment.amount}
                                       placeholder="0"
                                       onChange={(e) => updatePayment(index, { amount: e.target.value === '' ? 0 : Number(e.target.value) })}
                                       className="w-full bg-input border border-border rounded-lg px-2.5 py-2 text-xs font-extrabold text-foreground focus:border-primary outline-none transition-all text-right pr-7"
                                    />
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none font-bold">
                                      Ks
                                    </span>
                                  </div>
                               </div>

                               {payments.length > 1 && (
                                  <button 
                                    type="button"
                                    onClick={() => removePaymentMethod(index)} 
                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 mt-4 cursor-pointer"
                                    title="Remove payment method"
                                  >
                                     <Trash2 size={16} />
                                  </button>
                               )}
                            </div>
                         ))}
                      </div>

                      {/* Payment Summary & Balance Status */}
                      <div className="pt-4 border-t border-border/50 space-y-2">
                         <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                           <span>Total Allocated</span>
                           <span className="text-foreground">{totalPaid.toLocaleString()} Ks</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Balance Status</span>
                            <span className={`text-sm font-black ${remainingAmount > 0 ? 'text-red-500' : remainingAmount < 0 ? 'text-amber-500' : 'text-green-500'}`}>
                               {remainingAmount === 0 ? (
                                 <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-lg text-xs font-extrabold">
                                   ✓ Balanced ({netTotal.toLocaleString()} Ks)
                                 </span>
                               ) : remainingAmount > 0 ? (
                                 <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 px-2.5 py-1 rounded-lg text-xs font-extrabold">
                                   Unpaid: {remainingAmount.toLocaleString()} Ks
                                 </span>
                               ) : (
                                 <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg text-xs font-extrabold">
                                   Overpaid: {Math.abs(remainingAmount).toLocaleString()} Ks
                                 </span>
                               )}
                            </span>
                         </div>
                      </div>
                   </div>
                </div>"""

if old_payments in content:
    content = content.replace(old_payments, new_payments)
    print("Replaced Payments block successfully.")
else:
    print("WARNING: old_payments not found!")

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

print("Done")
