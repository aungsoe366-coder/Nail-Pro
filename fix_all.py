import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Fix 2:
content = content.replace(
    '<div className="absolute top-1/2 left-[48px] right-[48px] sm:left-[64px] sm:right-[64px] h-[3px] bg-border/50 -translate-y-1/2 rounded-full overflow-hidden z-0">',
    '<div className="absolute top-1/2 left-[48px] right-[48px] sm:left-[64px] sm:right-[64px] h-[3px] bg-border/50 -translate-y-1/2 rounded-full overflow-hidden -z-10">'
)

content = content.replace(
    'const stateClass = isActive \n              ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/30" \n              : isPast \n                ? "bg-primary/20 text-primary border-primary/30" \n                : "bg-card text-muted-foreground border-border/50";',
    'const stateClass = isActive \n              ? "border-primary scale-110 shadow-lg shadow-primary/30" \n              : isPast \n                ? "border-primary" \n                : "border-border/50";'
)

content = content.replace(
    '<div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stateClass}`}>',
    '<div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative bg-card ${stateClass}`}>\n                  <div className={`absolute inset-0 rounded-full ${isActive ? \'bg-primary\' : isPast ? \'bg-primary/20\' : \'\'}`} />'
)

content = content.replace(
    '<step.icon size={20} className={isActive ? "animate-pulse" : ""} />',
    '<step.icon size={20} className={`relative z-10 ${isActive ? "text-primary-foreground animate-pulse" : isPast ? "text-primary" : "text-muted-foreground"}`} />'
)

# Fix 3, 4, 5 part 2
content = content.replace(
'''                      <div className="flex items-center gap-4 self-start sm:self-auto">
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
                      </div>''',
'''                      <div className="flex items-center gap-4 self-start sm:self-auto">
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
                      </div>'''
)

content = content.replace(
'''                  <div key={item.id + index} className="bg-card p-4 sm:p-6 rounded-2xl border border-border/50 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-black text-foreground text-lg">{item.name}</h4>
                        <p className="text-primary font-bold">{item.price.toLocaleString()} Ks</p>
                      </div>''',
'''                  <div key={item.id + index} className="bg-card p-4 sm:p-6 rounded-2xl border border-border/50 shadow-sm space-y-4 relative">
                    {/* Remove */}
                    <button 
                      onClick={() => {
                        if(window.confirm("Remove this item from the cart?")) removeFromCart(index);
                      }} 
                      className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 pr-10">
                        <h4 className="font-black text-foreground text-lg leading-tight">{item.name}</h4>
                        <p className="text-primary font-bold mt-1">{item.price.toLocaleString()} Ks</p>
                      </div>'''
)

content = content.replace(
'''                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.disP}
                            onChange={(e) => updateCartItem(index, { disP: Number(e.target.value) })}
                            className="w-full bg-input border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                          />''',
'''                          <input
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
                          />'''
)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

print("Done")
