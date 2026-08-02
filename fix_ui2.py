import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_cart_item = """                {cart.map((item, index) => (
                  <div key={item.id + index} className="bg-card p-4 sm:p-6 rounded-2xl border border-border/50 shadow-sm space-y-4 relative">
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
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 pr-10">
                        <h4 className="font-black text-foreground text-lg leading-tight">{item.name}</h4>
                        <p className="text-primary font-bold mt-1">{item.price.toLocaleString()} Ks</p>
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
                            className="w-full bg-input border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                      
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Assign Staff</label>
                         <div className="relative">
                            <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
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
                ))}"""

new_cart_item = """                {cart.map((item, index) => (
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

content = content.replace(old_cart_item, new_cart_item)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
