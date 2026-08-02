with open('src/AppCore.tsx', 'r') as f:
    lines = f.readlines()

start_idx = None
end_idx = None

for idx, line in enumerate(lines):
    if '{/* Payments */}' in line:
        start_idx = idx
        break

if start_idx is not None:
    for idx in range(start_idx, len(lines)):
        if '</div>' in lines[idx] and idx > start_idx + 30:
            end_idx = idx + 2
            break

print("Start:", start_idx, "End:", end_idx)
print("Replacing lines:")
print(''.join(lines[start_idx:end_idx]))

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
                </div>
"""

lines[start_idx:end_idx] = [new_payments + '\n']

with open('src/AppCore.tsx', 'w') as f:
    f.writelines(lines)

print("Replaced successfully!")
