import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

lines = content.split('\n')
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "{cart.map((item, index) => (" in line and start_idx == -1:
        if i + 1 < len(lines) and "div key={item.id + index}" in lines[i+1]:
            start_idx = i

if start_idx != -1:
    brace_count = 0
    for i in range(start_idx, len(lines)):
        if "{" in lines[i]:
            brace_count += lines[i].count("{")
        if "}" in lines[i]:
            brace_count -= lines[i].count("}")
        
        # We need to find the end of the cart.map which is ))}
        if lines[i].strip() == "))}":
            # Wait, we might hit other ))}, so let's verify if the next line is </div>
            if lines[i+1].strip() == "</div>":
                end_idx = i
                break

print("Start idx", start_idx)
print("End idx", end_idx)

if start_idx != -1 and end_idx != -1:
    replacement = """            {cart.map((item, index) => {
              const itemValidation = validateCartItem(item);
              const hasErrors = !itemValidation.isValid && itemValidation.errors.length > 0;
              
              return (
              <div key={item.id + index} className={`bg-card border-2 p-4 sm:p-5 rounded-2xl space-y-4 relative transition-all ${hasErrors ? 'border-red-500/50 shadow-sm shadow-red-500/10' : 'border-border/60 hover:border-primary/30 shadow-sm'}`}>
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
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-20 cursor-pointer"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
                
                <div className="flex flex-col gap-1 pr-10">
                  <h4 className="font-bold text-foreground text-base tracking-tight leading-tight">{item.name}</h4>
                  <p className="text-primary font-black text-sm">{item.price.toLocaleString()} Ks</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center bg-muted/60 rounded-xl p-1 shadow-inner border border-border/50">
                    <button onClick={() => updateCartItem(index, { qty: Math.max(1, item.qty - 1) })} className="w-8 h-8 flex items-center justify-center bg-card hover:bg-background rounded-lg shadow-sm transition-all text-foreground">
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <input 
                      type="number"
                      value={item.qty}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCartItem(index, { qty: val === '' ? ('' as any) : parseInt(val) || 1 });
                      }}
                      onFocus={() => updateCartItem(index, { qty: '' as any })}
                      onBlur={(e) => {
                        if (!e.target.value || parseInt(e.target.value) < 1)
                          updateCartItem(index, { qty: 1 });
                      }}
                      className="w-10 text-center text-sm font-black text-foreground bg-transparent border-none outline-none appearance-none"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    />
                    <button onClick={() => updateCartItem(index, { qty: item.qty + 1 })} className="w-8 h-8 flex items-center justify-center bg-card hover:bg-background rounded-lg shadow-sm transition-all text-foreground">
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                  
                  {/* Discount % */}
                  <div className="relative w-24">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center pointer-events-none">
                      <Percent size={12} strokeWidth={3} />
                    </div>
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
                      className="w-full h-10 bg-input border-2 border-border/50 rounded-xl pl-10 pr-2 text-sm font-black text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-muted-foreground/50"
                      placeholder="Disc"
                    />
                  </div>
                </div>

                <div className="h-px w-full bg-border/40" />

                {/* Assign Staff (Split Staff Logic) */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Staff Assignment</label>
                  
                  {(!item.staffAssignments || item.staffAssignments.length === 0) ? (
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 group">
                        <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                        <select 
                          value={item.staffName || ''}
                          onChange={(e) => updateCartItem(index, { staffName: e.target.value, staffEmail: staff.find(s => s.name === e.target.value)?.email || '' })}
                          className="w-full h-11 bg-input/50 border-2 border-border/60 hover:border-border rounded-xl pl-9 pr-3 text-sm font-semibold text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select Staff</option>
                          {staff.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => {
                          const firstStaff = item.staffName ? [{ name: item.staffName, qty: Math.max(1, Math.floor(item.qty / 2)) }] : [];
                          updateCartItem(index, { 
                            staffName: '', 
                            staffEmail: '', 
                            staffAssignments: [...firstStaff, { name: '', qty: Math.max(1, Math.ceil(item.qty / 2)) }] 
                          });
                        }}
                        className="h-11 px-4 bg-muted text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0"
                      >
                        Split
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 bg-muted/20 p-3 rounded-xl border border-border/40">
                      {item.staffAssignments.map((assignment, aIndex) => (
                        <div key={aIndex} className="flex items-center gap-2">
                          <div className="relative flex-1 group">
                            <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                            <select 
                              value={assignment.name || ''}
                              onChange={(e) => {
                                const newAssignments = [...(item.staffAssignments || [])];
                                newAssignments[aIndex].name = e.target.value;
                                updateCartItem(index, { staffAssignments: newAssignments });
                              }}
                              className="w-full h-10 bg-card border-2 border-border/60 rounded-xl pl-9 pr-2 text-sm font-semibold text-foreground focus:border-primary outline-none transition-all appearance-none shadow-sm cursor-pointer"
                            >
                              <option value="">Select Staff</option>
                              {staff.map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="relative w-20 shrink-0">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground pointer-events-none uppercase">qty</span>
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
                              className="w-full h-10 bg-card border-2 border-border/60 rounded-xl pl-3 pr-8 text-sm font-black text-foreground focus:border-primary outline-none transition-all shadow-sm"
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
                            className="w-10 h-10 flex items-center justify-center text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      
                      <button 
                        onClick={() => {
                          const newAssignments = [...(item.staffAssignments || []), { name: '', qty: 1 }];
                          updateCartItem(index, { staffAssignments: newAssignments });
                        }}
                        className="h-10 flex items-center justify-center gap-2 bg-background border-2 border-dashed border-border/80 hover:border-primary/50 text-muted-foreground hover:text-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-colors mt-1"
                      >
                        <Plus size={14} strokeWidth={3} /> Add Assignment
                      </button>
                    </div>
                  )}
                  
                  {hasErrors && (
                    <div className="space-y-1.5 mt-2 animate-in slide-in-from-top-1">
                      {itemValidation.errors.map((err, errIdx) => (
                        <div key={errIdx} className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-2.5 rounded-xl text-xs font-bold flex items-start gap-2 shadow-sm">
                          <AlertCircle size={14} className="shrink-0 text-red-500 mt-0.5" strokeWidth={2.5} />
                          <span className="leading-tight">{err}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )})}"""

    new_content = "\n".join(lines[:start_idx]) + "\n" + replacement + "\n" + "\n".join(lines[end_idx+1:])
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("Replaced!")

