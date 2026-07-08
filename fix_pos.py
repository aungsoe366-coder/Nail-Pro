import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target1 = """                    <div className="flex items-center bg-muted/5 rounded-xl p-1 border border-border/50">
                      <button 
                        onClick={() => updateCartItem(i, { qty: Math.max(1, item.qty - 1) })}
                        className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <span className="w-8 text-center font-black text-sm">{item.qty}</span>
                      <button 
                        onClick={() => updateCartItem(i, { qty: item.qty + 1 })}
                        className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                      >
                        <ArrowUp size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Discount %</span>
                      <input 
                        type="number" 
                        value={item.disP === "" as any ? "" : (item.disP ?? 0)}
                        onFocus={() => {
                          if (item.disP === 0) updateCartItem(i, { disP: "" as any });
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") updateCartItem(i, { disP: 0 });
                        }}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            updateCartItem(i, { disP: "" as any });
                            return;
                          }
                          const val = Number(e.target.value);
                          if (val >= 0 && val <= 100) {
                            updateCartItem(i, { disP: val });
                          }
                        }}
                        className="w-12 bg-input border border-border/50 rounded-lg px-2 py-1 text-[10px] font-black text-center focus:border-primary outline-none transition-all"
                      />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Staff</span>
                        <div className="relative flex-1">
                          <select
                            value=""
                            onChange={(e) => {
                              const sName = e.target.value;
                              if (!sName) return;
                              let current = item.staffAssignments ? [...item.staffAssignments] : [];
                              if (!current.find(a => a.name === sName)) {
                                current.push({ name: sName, qty: 1 });
                                updateCartItem(i, { staffAssignments: current, staffEmail: "", staffName: "" });
                              }
                            }}
                            className="w-full px-2 py-1 bg-input border border-border/50 rounded-lg text-[10px] font-bold outline-none focus:border-primary"
                          >
                             <option value="">+ Assign Staff (Split Qty)</option>
                             {staff.filter(s => ["staff", "owner", "cashier"].includes(s.role || "")).map(s => (
                                <option key={s.email} value={s.name}>{s.name}</option>
                             ))}
                          </select>
                        </div>
                      </div>
                      {item.staffAssignments && item.staffAssignments.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.staffAssignments.map((assignment, aIdx) => (
                             <div key={aIdx} className="flex items-center gap-1 bg-primary/10 border border-primary/30 rounded px-1 py-0.5">
                               <button 
                                 onClick={() => {
                                   const newA = item.staffAssignments!.filter(a => a.name !== assignment.name);
                                   updateCartItem(i, { staffAssignments: newA });
                                 }}
                                 className="text-red-500 hover:bg-red-500/10 p-0.5 rounded-md"
                               >
                                 <X size={10} />
                               </button>
                               <span className="text-[10px] font-bold text-primary">{assignment.name}</span>
                               <input 
                                 type="number"
                                 min="1"
                                 value={assignment.qty || ""}
                                 onChange={(e) => {
                                   const val = parseInt(e.target.value) || 0;
                                   const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: val } : a);
                                   updateCartItem(i, { staffAssignments: newA });
                                 }}
                                 className="w-8 bg-background border border-primary/20 rounded px-1 py-0.5 text-[10px] font-black text-center focus:border-primary outline-none"
                               />
                             </div>
                          ))}
                        </div>
                      ) : (
                        <CustomSelect
                          value={item.staffEmail || ""}
                          onChange={(val) => {
                            const selected = staff.find(s => s.email === val);
                            if (selected) {
                              updateCartItem(i, { staffEmail: selected.email, staffName: selected.name, staffAssignments: [] });
                            } else {
                              updateCartItem(i, { staffEmail: "", staffName: "", staffAssignments: [] });
                            }
                          }}
                          placeholder="Auto (Main Staff)"
                          options={[
                            { value: "", label: "Auto (Main Staff)" },
                            ...staff.filter(s => ["staff", "owner", "cashier"].includes(s.role || "")).map(s => ({ value: s.email, label: s.name }))
                          ]}
                          buttonClassName="px-2 py-1 text-[10px] font-black w-full"
                        />
                      )}
                    </div>"""

replacement1 = """                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-muted/5 rounded-xl p-1 border border-border/50">
                        <button 
                          onClick={() => updateCartItem(i, { qty: Math.max(1, item.qty - 1) })}
                          className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <span className="w-8 text-center font-black text-sm">{item.qty}</span>
                        <button 
                          onClick={() => updateCartItem(i, { qty: item.qty + 1 })}
                          className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                        >
                          <ArrowUp size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(i)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/30 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Discount %</span>
                        <input 
                          type="number" 
                          value={item.disP === "" as any ? "" : (item.disP ?? 0)}
                          onFocus={() => {
                            if (item.disP === 0) updateCartItem(i, { disP: "" as any });
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") updateCartItem(i, { disP: 0 });
                          }}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              updateCartItem(i, { disP: "" as any });
                              return;
                            }
                            const val = Number(e.target.value);
                            if (val >= 0 && val <= 100) {
                              updateCartItem(i, { disP: val });
                            }
                          }}
                          className="w-12 bg-input border border-border/50 rounded-lg px-2 py-1 text-[10px] font-black text-center focus:border-primary outline-none transition-all"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Staff</span>
                        <div className="relative flex-1">
                          <select
                            value=""
                            onChange={(e) => {
                              const sName = e.target.value;
                              if (!sName) return;
                              let current = item.staffAssignments ? [...item.staffAssignments] : [];
                              if (!current.find(a => a.name === sName)) {
                                const otherQty = current.reduce((sum, a) => sum + (a.qty || 0), 0);
                                const defaultQty = Math.max(1, item.qty - otherQty);
                                current.push({ name: sName, qty: defaultQty });
                                updateCartItem(i, { staffAssignments: current, staffEmail: "", staffName: "" });
                              }
                            }}
                            className="w-full px-2 py-1 bg-input border border-border/50 rounded-lg text-[10px] font-bold outline-none focus:border-primary cursor-pointer"
                          >
                             <option value="">+ Assign Staff</option>
                             {staff.filter(s => ["staff", "owner", "cashier"].includes(s.role || "")).map(s => (
                                <option key={s.email} value={s.name}>{s.name}</option>
                             ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end gap-4 mt-1">
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {item.staffAssignments && item.staffAssignments.length > 0 ? (
                          item.staffAssignments.map((assignment, aIdx) => (
                             <div key={aIdx} className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-md px-1.5 py-1">
                               <button 
                                 onClick={() => {
                                   const newA = item.staffAssignments!.filter(a => a.name !== assignment.name);
                                   updateCartItem(i, { staffAssignments: newA });
                                 }}
                                 className="text-red-500 hover:bg-red-500/10 p-0.5 rounded transition-colors"
                               >
                                 <X size={12} />
                               </button>
                               <span className="text-[10px] font-bold text-primary">{assignment.name}</span>
                               <input 
                                 type="number"
                                 min="1"
                                 value={assignment.qty === "" as any ? "" : (assignment.qty || "")}
                                 onBlur={(e) => {
                                   if (e.target.value === "") {
                                     const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: 1 } : a);
                                     updateCartItem(i, { staffAssignments: newA });
                                   }
                                 }}
                                 onChange={(e) => {
                                   if (e.target.value === "") {
                                     const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: "" as any } : a);
                                     updateCartItem(i, { staffAssignments: newA });
                                     return;
                                   }
                                   let val = parseInt(e.target.value) || 0;
                                   const otherQty = item.staffAssignments!.filter(a => a.name !== assignment.name).reduce((sum, a) => sum + (a.qty || 0), 0);
                                   const maxVal = Math.max(1, item.qty - otherQty);
                                   if (val > maxVal) val = maxVal;
                                   const newA = item.staffAssignments!.map(a => a.name === assignment.name ? { ...a, qty: val } : a);
                                   updateCartItem(i, { staffAssignments: newA });
                                 }}
                                 className="w-10 bg-background border border-primary/20 rounded px-1 py-0.5 text-[10px] font-black text-center focus:border-primary outline-none transition-colors"
                               />
                             </div>
                          ))
                        ) : (
                          <CustomSelect
                            value={item.staffEmail || ""}
                            onChange={(val) => {
                              const selected = staff.find(s => s.email === val);
                              if (selected) {
                                updateCartItem(i, { staffEmail: selected.email, staffName: selected.name, staffAssignments: [] });
                              } else {
                                updateCartItem(i, { staffEmail: "", staffName: "", staffAssignments: [] });
                              }
                            }}
                            placeholder="Auto (Main Staff)"
                            options={[
                              { value: "", label: "Auto (Main Staff)" },
                              ...staff.filter(s => ["staff", "owner", "cashier"].includes(s.role || "")).map(s => ({ value: s.email, label: s.name }))
                            ]}
                            buttonClassName="px-2 py-1 text-[10px] font-black min-w-[120px]"
                          />
                        )}
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="font-black text-primary w-full text-right">
                          {(item.price * item.qty * (1 - item.disP / 100)).toLocaleString()} Ks
                        </span>
                      </div>
                    </div>
                  </div>"""

new_content = content.replace(target1, replacement1)

if new_content == content:
    print("NO CHANGE")
else:
    # Need to remove the extra </div> and </span> span which was originally:
    #                     <span className="font-black text-primary w-full text-right mt-1">
    #                      {(item.price * item.qty * (1 - item.disP / 100)).toLocaleString()} Ks
    #                    </span>
    #                  </div>
    #                </motion.div>
    # Wait! In the original code, the very end of this block is:
    #                     )}
    #                   </div>
    #                   <span className="font-black text-primary w-full text-right mt-1">
    #                     {(item.price * item.qty * (1 - item.disP / 100)).toLocaleString()} Ks
    #                   </span>
    #                 </div>
    #               </motion.div>
    pass
    
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS")

