const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex2 = /<CustomSelect\s*value={statusFilter}\s*onChange={setStatusFilter}\s*placeholder="All Status"\s*options={\[[\s\S]*?\]}\s*\/>/;

const match2 = content.match(regex2);
if (match2) {
  const replacement2 = `<CustomSelect
                        value={statusFilter} 
                        onChange={setStatusFilter}
                        placeholder="All Status"
                        options={[
                          { 
                            value: 'all', 
                            label: (
                              <div className="flex items-center gap-2 font-black tracking-wider uppercase text-[10px]">
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                                All Status
                              </div>
                            )
                          },
                          { 
                            value: 'pending', 
                            label: (
                              <div className="flex items-center gap-2 text-yellow-600 font-black tracking-wider uppercase text-[10px]">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                                Pending
                              </div>
                            ) 
                          },
                          { 
                            value: 'confirmed', 
                            label: (
                              <div className="flex items-center gap-2 text-blue-600 font-black tracking-wider uppercase text-[10px]">
                                <Check size={14} strokeWidth={3} className="drop-shadow-sm" />
                                Confirmed
                              </div>
                            ) 
                          },
                          { 
                            value: 'completed', 
                            label: (
                              <div className="flex items-center gap-2 text-green-600 font-black tracking-wider uppercase text-[10px]">
                                <Check size={14} strokeWidth={3} className="drop-shadow-sm" />
                                Completed
                              </div>
                            ) 
                          },
                          { 
                            value: 'cancelled', 
                            label: (
                              <div className="flex items-center gap-2 text-red-600 font-black tracking-wider uppercase text-[10px]">
                                <X size={14} strokeWidth={3} className="drop-shadow-sm" />
                                Cancelled
                              </div>
                            ) 
                          }
                        ]}
                        renderValue={(opt) => (
                          <div className="flex items-center gap-1.5">
                            {opt?.value === 'all' && <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />}
                            {opt?.value === 'pending' && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]" />}
                            {opt?.value === 'confirmed' && <Check size={12} strokeWidth={3} className="drop-shadow-sm text-blue-600" />}
                            {opt?.value === 'completed' && <Check size={12} strokeWidth={3} className="drop-shadow-sm text-green-600" />}
                            {opt?.value === 'cancelled' && <X size={12} strokeWidth={3} className="drop-shadow-sm text-red-600" />}
                            <span className={cn(
                              opt?.value === 'pending' && "text-yellow-600",
                              opt?.value === 'confirmed' && "text-blue-600",
                              opt?.value === 'completed' && "text-green-600",
                              opt?.value === 'cancelled' && "text-red-600",
                              opt?.value === 'all' && "text-foreground"
                            )}>
                              {opt?.value === 'all' ? 'All Status' : opt?.value}
                            </span>
                          </div>
                        )}
                        dropdownClassName="p-2 space-y-1 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl"
                        buttonClassName="text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-3"
                      />`;
  content = content.replace(match2[0], replacement2);
  fs.writeFileSync('src/AppCore.tsx', content);
  console.log('Filter dropdown patched correctly');
} else {
  console.log('Regex 2 did not match');
}
