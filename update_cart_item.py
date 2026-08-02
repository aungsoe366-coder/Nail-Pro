import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_cart_section = """                {cart.map((item, index) => (
                  <div key={item.id + index} className="bg-card p-3 sm:p-4 rounded-xl border border-border/50 shadow-sm space-y-3 relative">
                    {/* Remove */}
                    <button 
                      onClick={() => {
                        if (window.confirm("Remove this item from the cart?")) {
                          removeFromCart(index);
                        }
                      }} 
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-lg transition-colors z-20 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex flex-row items-start justify-between gap-3">
                      <div className="flex-1 pr-10">
                        <h4 className="font-bold text-foreground text-sm sm:text-base leading-tight truncate">{item.name}</h4>
                        <p className="text-primary font-bold text-xs mt-0.5">{item.price.toLocaleString()} Ks</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-border/20 items-end">
                      {/* Quantity */}
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Qty</label>
                        <div className="flex items-center bg-muted rounded-lg p-0.5 h-9">
                          <button onClick={() => updateCartItem(index, { qty: Math.max(1, item.qty - 1) })} className="w-8 h-full flex items-center justify-center hover:bg-background rounded-md transition-colors text-foreground">
                            <Minus size={14} />
                          </button>
                          <span className="flex-1 text-center text-xs font-bold text-foreground">{item.qty}</span>
                          <button onClick={() => updateCartItem(index, { qty: item.qty + 1 })} className="w-8 h-full flex items-center justify-center hover:bg-background rounded-md transition-colors text-foreground">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Discount % */}
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Disc %</label>
                        <div className="relative">
                          <Percent size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.disP}
                            onFocus={(e) => {
                              if (item.disP === 0) {
                                updateCartItem(index, { disP: '' as any });
                              }
                            }}
                            onBlur={(e) => {
                              if ((e.target.value as any) === '') {
                                updateCartItem(index, { disP: 0 });
                              }
                            }}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCartItem(index, { disP: val === '' ? ('' as any) : Number(val) });
                            }}
                            className="w-full h-9 bg-input border border-border rounded-lg pl-7 pr-2 text-xs font-bold text-foreground focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                        
                      {/* Assign Staff */}
                      <div>
                         <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Staff</label>
                         <div className="relative">
                            <UserIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <select 
                               value={item.staffName || ''}
                               onChange={(e) => updateCartItem(index, { staffName: e.target.value, staffEmail: staff.find(s => s.name === e.target.value)?.email || '' })}
                               className="w-full h-9 bg-input border border-border rounded-lg pl-7 pr-2 text-xs font-bold text-foreground focus:border-primary outline-none transition-all appearance-none"
                            >
                               <option value="">Any Staff</option>
                               {staff.map(s => (
                                 <option key={s.id} value={s.name}>{s.name}</option>
                               ))}
                            </select>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}"""

new_cart_section = """                {cart.map((item, index) => (
                  <div key={item.id + index} className="bg-card p-2.5 sm:p-3 rounded-xl border border-border/50 shadow-sm space-y-2.5 relative">
                    {/* Remove */}
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
                      className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-lg transition-colors z-20 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex flex-row items-center justify-between gap-3 pr-8">
                      <h4 className="font-bold text-foreground text-sm truncate">{item.name}</h4>
                      <p className="text-primary font-bold text-xs shrink-0">{item.price.toLocaleString()} Ks</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                      {/* Quantity */}
                      <div className="flex items-center bg-muted rounded-lg p-0.5 h-8">
                        <button onClick={() => updateCartItem(index, { qty: Math.max(1, item.qty - 1) })} className="w-6 h-full flex items-center justify-center hover:bg-background rounded-md transition-colors text-foreground">
                          <Minus size={12} />
                        </button>
                        <input 
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateCartItem(index, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-8 text-center text-xs font-bold text-foreground bg-transparent outline-none appearance-none"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                        />
                        <button onClick={() => updateCartItem(index, { qty: item.qty + 1 })} className="w-6 h-full flex items-center justify-center hover:bg-background rounded-md transition-colors text-foreground">
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Discount % */}
                      <div className="relative w-20">
                        <Percent size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.disP}
                          onFocus={(e) => {
                            if (item.disP === 0) {
                              updateCartItem(index, { disP: '' as any });
                            }
                          }}
                          onBlur={(e) => {
                            if ((e.target.value as any) === '') {
                              updateCartItem(index, { disP: 0 });
                            }
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCartItem(index, { disP: val === '' ? ('' as any) : Number(val) });
                          }}
                          className="w-full h-8 bg-input border border-border rounded-lg pl-6 pr-1 text-xs font-bold text-foreground focus:border-primary outline-none transition-all"
                          placeholder="Disc"
                        />
                      </div>
                    </div>
                      
                    {/* Assign Staff (Split Staff Logic) */}
                    <div className="pt-2 border-t border-border/20 flex flex-col gap-2">
                       {(!item.staffAssignments || item.staffAssignments.length === 0) ? (
                         <div className="flex items-center gap-2">
                           <div className="relative flex-1">
                              <UserIcon size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                              <select 
                                 value={item.staffName || ''}
                                 onChange={(e) => updateCartItem(index, { staffName: e.target.value, staffEmail: staff.find(s => s.name === e.target.value)?.email || '' })}
                                 className="w-full h-8 bg-input border border-border rounded-lg pl-7 pr-2 text-xs font-bold text-foreground focus:border-primary outline-none transition-all appearance-none"
                              >
                                 <option value="">Select Staff</option>
                                 {staff.map(s => (
                                   <option key={s.id} value={s.name}>{s.name}</option>
                                 ))}
                              </select>
                           </div>
                           <button 
                             onClick={() => {
                               // Initialize split staff with the first person if selected, or empty
                               const firstStaff = item.staffName ? [{ name: item.staffName, qty: Math.max(1, Math.floor(item.qty / 2)) }] : [];
                               updateCartItem(index, { 
                                 staffName: '', 
                                 staffEmail: '', 
                                 staffAssignments: [...firstStaff, { name: '', qty: Math.max(1, Math.ceil(item.qty / 2)) }]
                               });
                             }}
                             className="h-8 px-2 bg-muted text-foreground text-[10px] font-bold rounded-lg whitespace-nowrap hover:bg-muted/80"
                           >
                             Split
                           </button>
                         </div>
                       ) : (
                         <div className="flex flex-col gap-2">
                           {item.staffAssignments.map((assignment, aIndex) => (
                             <div key={aIndex} className="flex items-center gap-2">
                               <div className="relative flex-1">
                                  <UserIcon size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                                  <select 
                                     value={assignment.name || ''}
                                     onChange={(e) => {
                                       const newAssignments = [...(item.staffAssignments || [])];
                                       newAssignments[aIndex].name = e.target.value;
                                       updateCartItem(index, { staffAssignments: newAssignments });
                                     }}
                                     className="w-full h-8 bg-input border border-border rounded-lg pl-7 pr-2 text-xs font-bold text-foreground focus:border-primary outline-none transition-all appearance-none"
                                  >
                                     <option value="">Select Staff</option>
                                     {staff.map(s => (
                                       <option key={s.id} value={s.name}>{s.name}</option>
                                     ))}
                                  </select>
                               </div>
                               <div className="relative w-16">
                                 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">qty</span>
                                 <input
                                   type="number"
                                   min="0"
                                   max={item.qty}
                                   value={assignment.qty}
                                   onChange={(e) => {
                                     const newAssignments = [...(item.staffAssignments || [])];
                                     const val = parseInt(e.target.value) || 0;
                                     newAssignments[aIndex].qty = val;
                                     updateCartItem(index, { staffAssignments: newAssignments });
                                   }}
                                   className="w-full h-8 bg-input border border-border rounded-lg pl-2 pr-6 text-xs font-bold text-foreground focus:border-primary outline-none transition-all text-center"
                                 />
                               </div>
                               <button 
                                 onClick={() => {
                                   const newAssignments = [...(item.staffAssignments || [])];
                                   newAssignments.splice(aIndex, 1);
                                   if (newAssignments.length === 0) {
                                     updateCartItem(index, { staffAssignments: undefined });
                                   } else {
                                     updateCartItem(index, { staffAssignments: newAssignments });
                                   }
                                 }}
                                 className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                               >
                                 <Trash2 size={12} />
                               </button>
                             </div>
                           ))}
                           <button 
                             onClick={() => {
                               const newAssignments = [...(item.staffAssignments || []), { name: '', qty: 1 }];
                               updateCartItem(index, { staffAssignments: newAssignments });
                             }}
                             className="h-8 flex items-center justify-center gap-1 bg-muted/50 text-foreground text-[10px] font-bold rounded-lg border border-dashed border-border/50 hover:bg-muted"
                           >
                             <Plus size={10} /> Add Staff
                           </button>
                           {/* Warning if quantities don't match */}
                           {(item.staffAssignments.reduce((sum, a) => sum + (a.qty || 0), 0) !== item.qty) && (
                             <p className="text-[10px] text-red-500 font-bold">Staff quantities ({item.staffAssignments.reduce((sum, a) => sum + (a.qty || 0), 0)}) must match total qty ({item.qty}).</p>
                           )}
                         </div>
                       )}
                    </div>
                  </div>
                ))}"""

content = content.replace(old_cart_section, new_cart_section)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

print("done")
