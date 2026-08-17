const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = `              <CustomSelect
                disabled={!isAdmin && (appt.status === 'completed' || appt.status === 'cancelled')}
                value={appt.status}
                onChange={(val) => handleQuickStatusUpdate(appt.id, val as any)}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
                buttonClassName={cn(
                  "text-[9px] font-black uppercase tracking-widest rounded-xl px-4 py-2 pr-8 ",
                  appt.status === 'pending' && "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-600 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
                  appt.status === 'confirmed' && "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
                  appt.status === 'completed' && "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
                  appt.status === 'cancelled' && "bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                )}
              />`;

const replacement1 = `              <CustomSelect
                disabled={!isAdmin && (appt.status === 'completed' || appt.status === 'cancelled')}
                value={appt.status}
                onChange={(val) => handleQuickStatusUpdate(appt.id, val as any)}
                options={[
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
                  <div className="flex items-center gap-2">
                    {opt?.value === 'pending' && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]" />}
                    {opt?.value === 'confirmed' && <Check size={12} strokeWidth={3} className="drop-shadow-sm" />}
                    {opt?.value === 'completed' && <Check size={12} strokeWidth={3} className="drop-shadow-sm" />}
                    {opt?.value === 'cancelled' && <X size={12} strokeWidth={3} className="drop-shadow-sm" />}
                    <span>{opt?.value}</span>
                  </div>
                )}
                dropdownClassName="p-2 space-y-1 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl"
                buttonClassName={cn(
                  "text-[9px] font-black uppercase tracking-widest rounded-xl px-4 py-2 pr-8 transition-all hover:scale-[1.02] active:scale-[0.98]",
                  appt.status === 'pending' && "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-600 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]",
                  appt.status === 'confirmed' && "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
                  appt.status === 'completed' && "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]",
                  appt.status === 'cancelled' && "bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                )}
              />`;

content = content.replace(target1, replacement1);
fs.writeFileSync('src/AppCore.tsx', content);
