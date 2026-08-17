const fs = require('fs');
let content = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. Insert state
const stateHook = "const [statusUpdateAppt, setStatusUpdateAppt] = useState<Appointment | null>(null);\n  ";
if (!content.includes('statusUpdateAppt')) {
  content = content.replace(
    "const [apptSearch, setApptSearch] = useState('');",
    "const [apptSearch, setApptSearch] = useState('');\n  " + stateHook
  );
}

// 2. Replace map block
const startRegex = /\{filteredAppts\.map\(\(appt\) => \{/;
const matchStart = content.match(startRegex);
if (!matchStart) {
  console.log("No start match.");
  process.exit(1);
}
const startIndex = matchStart.index;

const endStr = "</motion.div> ); })}";
let endIndex = content.indexOf(endStr, startIndex);
if (endIndex !== -1) {
    endIndex += endStr.length;
} else {
    // try removing spacing
    const endStr2 = "</motion.div>\n                    );\n                  })}";
    endIndex = content.indexOf(endStr2, startIndex);
    if (endIndex !== -1) {
        endIndex += endStr2.length;
    } else {
        const endRegex = /<\/motion\.div>\s*\);\s*\}\)\}/;
        const matchEnd = content.substring(startIndex).match(endRegex);
        if (matchEnd) {
             endIndex = startIndex + matchEnd.index + matchEnd[0].length;
        } else {
             console.log("No end match.");
             process.exit(1);
        }
    }
}

const replacement = `{filteredAppts.map((appt) => {
                    const customer = customers.find(c => c.id === appt.customerId);
                    return (
                      <motion.div 
                        layout
                        key={appt.id} 
                        onClick={() => {
                          if (isAdmin || (appt.status !== 'completed' && appt.status !== 'cancelled')) {
                            startEdit(appt);
                          }
                        }}
                        style={{ zIndex: openDropdownId === appt.id ? 50 : undefined }}
                        className={cn(
                          "bg-card border border-border rounded-3xl p-4 transition-all group relative overflow-hidden flex flex-col gap-4 shadow-sm",
                          (isAdmin || (appt.status !== 'completed' && appt.status !== 'cancelled')) ? "hover:border-primary/30 cursor-pointer" : "opacity-90"
                        )}
                      >
                        {/* Header: Date/Time + Customer Info */}
                        <div className="flex gap-4 items-start">
                          <div className="flex flex-col items-center justify-center bg-primary/10 rounded-2xl px-3 py-2 min-w-[75px] border border-primary/10 shrink-0">
                            <span className="text-sm font-black text-primary [.midnight_&]:text-amber-400">{appt.time}</span>
                            <span className="text-[9px] font-bold text-primary/70 uppercase tracking-widest mt-0.5">{formatDisplayDate(appt.date)}</span>
                          </div>
                          <div className="flex-1 flex flex-col min-w-0 pt-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-black text-foreground [.midnight_&]:text-slate-200 text-base truncate tracking-tight leading-none">
                                {appt.customerName}
                              </h3>
                              {customer && (
                                <span className="shrink-0 bg-primary/20 text-primary [.midnight_&]:text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-black border border-primary/10 tracking-widest">
                                  {customer.points} PTS
                               </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Phone size={12} className="text-primary [.midnight_&]:text-amber-400" />
                                <span className="text-xs font-bold">{appt.customerPhone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Middle: Service & Staff */}
                        <div className="grid grid-cols-2 gap-3 bg-muted/5 rounded-2xl p-3 border border-border/50">
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Service</span>
                            <span className="font-bold text-sm text-foreground truncate">{appt.serviceName}</span>
                            {(() => {
                              const svc = services?.find(s => s.name === appt.serviceName);
                              if (svc && svc.price >= 0) {
                                return <span className="text-xs font-bold text-primary [.midnight_&]:text-amber-400 mt-0.5">{svc.price > 0 ? \`\${svc.price.toLocaleString()} Ks\` : '0 Ks'}</span>;
                              }
                              return null;
                            })()}
                          </div>
                          <div className="flex flex-col gap-1 min-w-0 border-l border-border/50 pl-3">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Staff</span>
                            <span className="font-bold text-sm text-foreground truncate">{appt.staffName || 'Any'}</span>
                            {appt.isHomeService && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md mt-1 w-fit">
                                <Car size={10} /> HOME
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Notes (if any) */}
                        {appt.notes && (
                          <div className="text-xs text-muted-foreground italic line-clamp-2 bg-primary/5 p-3 rounded-2xl border border-primary/5 font-medium leading-relaxed">
                            <span className="text-primary [.midnight_&]:text-amber-400 font-black not-italic mr-1.5">Notes:</span>
                            "{appt.notes}"
                          </div>
                        )}

                        {/* Footer: Action Buttons & Single Status Badge */}
                        <div className="flex items-end justify-between pt-1">
                          <div className="flex flex-col gap-2">
                            <span className="text-[8px] text-primary/70 uppercase tracking-[0.2em] font-black">Booked By {appt.creatorName || 'SYSTEM'}</span>
                            <div className="flex gap-2">
                              {profile?.role !== 'customer' && (
                                <a 
                                  href={\`https://wa.me/\${appt.customerPhone.replace(/\\D/g, '')}?text=\${encodeURIComponent('Hello ' + appt.customerName + ',\\nYour appointment for ' + appt.serviceName + ' has been ' + appt.status + ' for ' + formatDisplayDate(appt.date) + ' at ' + appt.time + '.\\nThank you for choosing Nail Pro!')}\`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2.5 bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all border border-green-500/20 w-fit"
                                  title="WhatsApp"
                                >
                                  <MessageCircle size={16} strokeWidth={2.5} />
                                </a>
                              )}
                              {(isAdmin || (appt.status !== 'completed' && appt.status !== 'cancelled')) && (
                                <>
                                  <button onClick={(e) => { e.stopPropagation(); startEdit(appt); }} className="p-2.5 bg-muted/5 text-muted-foreground hover:bg-primary hover:text-white rounded-xl transition-all active:scale-90 border border-border" title="Edit">
                                    <Pencil size={16} strokeWidth={2.5} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteAppt(appt); }} className="p-2.5 bg-red-500/5 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-500/10 active:scale-90" title="Delete">
                                    <Trash2 size={16} strokeWidth={2.5} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (profile?.role !== 'customer') {
                                if (isAdmin || (appt.status !== 'completed' && appt.status !== 'cancelled')) {
                                  setStatusUpdateAppt(appt);
                                }
                              }
                            }}
                            disabled={profile?.role === 'customer' || (!isAdmin && (appt.status === 'completed' || appt.status === 'cancelled'))}
                            className={cn(
                              "px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border disabled:opacity-80 active:scale-95 shadow-sm",
                              appt.status === 'pending' && "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
                              appt.status === 'confirmed' && "bg-blue-500/10 text-blue-600 border-blue-500/30",
                              appt.status === 'completed' && "bg-green-500/10 text-green-600 border-green-500/30",
                              appt.status === 'cancelled' && "bg-red-500/10 text-red-600 border-red-500/30"
                            )}
                          >
                            {appt.status === 'pending' && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />}
                            {appt.status === 'confirmed' && <Check size={14} strokeWidth={3} />}
                            {appt.status === 'completed' && <Check size={14} strokeWidth={3} />}
                            {appt.status === 'cancelled' && <X size={14} strokeWidth={3} />}
                            {appt.status}
                            {profile?.role !== 'customer' && <ChevronDown size={14} className="ml-1 opacity-50" />}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  <Modal
                    isOpen={!!statusUpdateAppt}
                    onClose={() => setStatusUpdateAppt(null)}
                    title="Update Status"
                  >
                    {statusUpdateAppt && (
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => { handleQuickStatusUpdate(statusUpdateAppt.id, 'pending'); setStatusUpdateAppt(null); }} 
                          className={cn(
                            "p-4 rounded-2xl font-black flex items-center justify-between text-base sm:text-lg uppercase tracking-widest transition-all border-2",
                            statusUpdateAppt.status === 'pending' ? "bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-500/20" : "bg-card border-border text-yellow-600 hover:border-yellow-500/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full", statusUpdateAppt.status === 'pending' ? "bg-white animate-pulse" : "bg-yellow-500")} />
                            Pending
                          </div>
                          {statusUpdateAppt.status === 'pending' && <Check size={20} />}
                        </button>

                        <button 
                          onClick={() => { handleQuickStatusUpdate(statusUpdateAppt.id, 'confirmed'); setStatusUpdateAppt(null); }} 
                          className={cn(
                            "p-4 rounded-2xl font-black flex items-center justify-between text-base sm:text-lg uppercase tracking-widest transition-all border-2",
                            statusUpdateAppt.status === 'confirmed' ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20" : "bg-card border-border text-blue-600 hover:border-blue-500/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Check size={18} strokeWidth={3} className={statusUpdateAppt.status === 'confirmed' ? "text-white" : "text-blue-600"} />
                            Confirmed
                          </div>
                          {statusUpdateAppt.status === 'confirmed' && <Check size={20} />}
                        </button>

                        <button 
                          onClick={() => { handleQuickStatusUpdate(statusUpdateAppt.id, 'completed'); setStatusUpdateAppt(null); }} 
                          className={cn(
                            "p-4 rounded-2xl font-black flex items-center justify-between text-base sm:text-lg uppercase tracking-widest transition-all border-2",
                            statusUpdateAppt.status === 'completed' ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20" : "bg-card border-border text-green-600 hover:border-green-500/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Check size={18} strokeWidth={3} className={statusUpdateAppt.status === 'completed' ? "text-white" : "text-green-600"} />
                            Completed
                          </div>
                          {statusUpdateAppt.status === 'completed' && <Check size={20} />}
                        </button>

                        <button 
                          onClick={() => { handleQuickStatusUpdate(statusUpdateAppt.id, 'cancelled'); setStatusUpdateAppt(null); }} 
                          className={cn(
                            "p-4 rounded-2xl font-black flex items-center justify-between text-base sm:text-lg uppercase tracking-widest transition-all border-2",
                            statusUpdateAppt.status === 'cancelled' ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20" : "bg-card border-border text-red-600 hover:border-red-500/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <X size={18} strokeWidth={3} className={statusUpdateAppt.status === 'cancelled' ? "text-white" : "text-red-600"} />
                            Cancelled
                          </div>
                          {statusUpdateAppt.status === 'cancelled' && <Check size={20} />}
                        </button>
                      </div>
                    )}
                  </Modal>`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex);

fs.writeFileSync('src/AppCore.tsx', content);
console.log("Success: Patched appointment map and added status modal.");
